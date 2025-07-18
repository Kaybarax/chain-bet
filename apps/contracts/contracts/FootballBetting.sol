// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title FootballBetting
 * @dev A decentralized football betting smart contract
 */
contract FootballBetting {
    struct Bet {
        uint256 id;
        string matchId;
        string betType; // "win", "draw", "over_under", etc.
        string prediction;
        uint256 amount;
        uint256 odds; // Represented as multiplier * 1000 (e.g., 1500 = 1.5x)
        bool settled;
        bool won;
        uint256 createdAt;
        uint256 settledAt;
    }

    struct Match {
        string id;
        string homeTeam;
        string awayTeam;
        uint256 startTime;
        string result; // "home", "away", "draw", or empty if not finished
        bool finished;
    }

    // Events
    event BetPlaced(uint256 indexed id, string matchId, address indexed bettor, uint256 amount);
    event BetSettled(uint256 indexed id, bool won, uint256 payout);
    event MatchCreated(string indexed matchId, string homeTeam, string awayTeam);
    event MatchFinished(string indexed matchId, string result);

    // State variables
    uint256 private _nextBetId;
    mapping(string => Match) private _matches;
    mapping(address => mapping(uint256 => Bet)) private _bets;
    mapping(address => uint256[]) private _userBetIds;
    mapping(string => bool) private _matchExists;
    address private _owner;
    uint256 private _contractBalance;

    modifier onlyOwner() {
        require(msg.sender == _owner, "Only owner can call this function");
        _;
    }

    constructor() {
        _owner = msg.sender;
    }

    /**
     * @dev Allow contract to receive ETH
     */
    receive() external payable {
        _contractBalance += msg.value;
    }

    /**
     * @dev Create a new match for betting
     * @param matchId Unique identifier for the match
     * @param homeTeam Home team name
     * @param awayTeam Away team name
     * @param startTime Match start timestamp
     */
    function createMatch(
        string memory matchId,
        string memory homeTeam,
        string memory awayTeam,
        uint256 startTime
    ) public onlyOwner {
        require(!_matchExists[matchId], "Match already exists");
        require(bytes(matchId).length > 0, "Match ID cannot be empty");
        require(bytes(homeTeam).length > 0, "Home team cannot be empty");
        require(bytes(awayTeam).length > 0, "Away team cannot be empty");
        require(startTime > block.timestamp, "Start time must be in the future");

        _matches[matchId] = Match({
            id: matchId,
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            startTime: startTime,
            result: "",
            finished: false
        });

        _matchExists[matchId] = true;
        emit MatchCreated(matchId, homeTeam, awayTeam);
    }

    /**
     * @dev Place a bet on a match
     * @param matchId The match identifier
     * @param betType Type of bet (win, draw, over_under, etc.)
     * @param prediction The prediction (home, away, draw, etc.)
     * @param odds The odds for this bet (multiplier * 1000)
     * @return id The id of the placed bet
     */
    function placeBet(
        string memory matchId,
        string memory betType,
        string memory prediction,
        uint256 odds
    ) public payable returns (uint256) {
        require(_matchExists[matchId], "Match does not exist");
        require(!_matches[matchId].finished, "Match has already finished");
        require(block.timestamp < _matches[matchId].startTime, "Match has already started");
        require(msg.value > 0, "Bet amount must be greater than 0");
        require(bytes(betType).length > 0, "Bet type cannot be empty");
        require(bytes(prediction).length > 0, "Prediction cannot be empty");
        require(odds > 1000, "Odds must be greater than 1.0");

        uint256 id = _nextBetId++;
        uint256 timestamp = block.timestamp;

        Bet memory newBet = Bet({
            id: id,
            matchId: matchId,
            betType: betType,
            prediction: prediction,
            amount: msg.value,
            odds: odds,
            settled: false,
            won: false,
            createdAt: timestamp,
            settledAt: 0
        });

        _bets[msg.sender][id] = newBet;
        _userBetIds[msg.sender].push(id);
        _contractBalance += msg.value;

        emit BetPlaced(id, matchId, msg.sender, msg.value);

        return id;
    }

    /**
     * @dev Get a bet by id
     * @param id The id of the bet
     * @return The bet
     */
    function getBet(uint256 id) public view returns (Bet memory) {
        require(_betExists(msg.sender, id), "Bet does not exist");
        return _bets[msg.sender][id];
    }

    /**
     * @dev Get all bets for the caller
     * @return An array of bets
     */
    function getAllBets() public view returns (Bet[] memory) {
        uint256[] memory betIds = _userBetIds[msg.sender];
        Bet[] memory bets = new Bet[](betIds.length);

        for (uint256 i = 0; i < betIds.length; i++) {
            bets[i] = _bets[msg.sender][betIds[i]];
        }

        return bets;
    }

    /**
     * @dev Get a match by id
     * @param matchId The match identifier
     * @return The match
     */
    function getMatch(string memory matchId) public view returns (Match memory) {
        require(_matchExists[matchId], "Match does not exist");
        return _matches[matchId];
    }

    /**
     * @dev Settle a match and all associated bets
     * @param matchId The match identifier
     * @param result The match result (home, away, draw)
     */
    function settleMatch(string memory matchId, string memory result) public onlyOwner {
        require(_matchExists[matchId], "Match does not exist");
        require(!_matches[matchId].finished, "Match already settled");
        require(block.timestamp >= _matches[matchId].startTime, "Match hasn't started yet");
        require(bytes(result).length > 0, "Result cannot be empty");

        _matches[matchId].result = result;
        _matches[matchId].finished = true;

        emit MatchFinished(matchId, result);
    }

    /**
     * @dev Settle a specific bet after match is finished
     * @param bettor The address of the bettor
     * @param betId The id of the bet
     */
    function settleBet(address bettor, uint256 betId) public onlyOwner {
        require(_betExists(bettor, betId), "Bet does not exist");
        
        Bet storage bet = _bets[bettor][betId];
        require(!bet.settled, "Bet already settled");
        require(_matches[bet.matchId].finished, "Match not finished yet");

        bet.settled = true;
        bet.settledAt = block.timestamp;

        // Determine if bet won based on match result and bet prediction
        string memory matchResult = _matches[bet.matchId].result;
        bool won = _compareBetResult(bet.betType, bet.prediction, matchResult);
        bet.won = won;

        if (won) {
            uint256 payout = (bet.amount * bet.odds) / 1000;
            require(_contractBalance >= payout, "Insufficient contract balance");
            _contractBalance -= payout;
            payable(bettor).transfer(payout);
        }

        emit BetSettled(betId, won, won ? (bet.amount * bet.odds) / 1000 : 0);
    }

    /**
     * @dev Withdraw contract balance (owner only)
     */
    function withdrawBalance() public onlyOwner {
        require(_contractBalance > 0, "No balance to withdraw");
        uint256 amount = _contractBalance;
        _contractBalance = 0;
        payable(_owner).transfer(amount);
    }

    /**
     * @dev Compare bet result with match result
     * @param betType The type of bet
     * @param prediction The bet prediction
     * @param matchResult The actual match result
     * @return True if bet won
     */
    function _compareBetResult(
        string memory betType,
        string memory prediction,
        string memory matchResult
    ) private pure returns (bool) {
        // Simple comparison for match winner bets
        if (keccak256(abi.encodePacked(betType)) == keccak256(abi.encodePacked("win"))) {
            return keccak256(abi.encodePacked(prediction)) == keccak256(abi.encodePacked(matchResult));
        }
        // Add more bet types as needed
        return false;
    }

    /**
     * @dev Check if a bet exists
     * @param bettor The bettor address
     * @param id The id of the bet
     * @return True if the bet exists
     */
    function _betExists(address bettor, uint256 id) private view returns (bool) {
        return _bets[bettor][id].createdAt != 0;
    }

    /**
     * @dev Get the number of bets for a user
     * @param user The user address
     * @return The number of bets
     */
    function getBetCount(address user) public view returns (uint256) {
        return _userBetIds[user].length;
    }

    /**
     * @dev Get contract balance
     * @return The contract balance
     */
    function getContractBalance() public view returns (uint256) {
        return _contractBalance;
    }
}
