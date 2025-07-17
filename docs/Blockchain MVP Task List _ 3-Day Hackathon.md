# Blockchain MVP Task List (3-Day Hackathon)

**Task Numbering System:**

* BC: Blockchain Team  
* D1/D2/D3: Day 1 / Day 2 / Day 3  
* T\#: Task Number

---

### **Day 1: Contract Scaffolding and Local Testing**

**Goal:** Write and unit-test the core logic for placing bets in a local Hardhat environment.

* **BCD1T1\_HardhatSetup:** **Initialize Hardhat Project.**  
  * In the packages/contracts directory of the monorepo, initialize a new Hardhat project (npx hardhat init).  
  * Install necessary dependencies like @nomicfoundation/hardhat-toolbox and @openzeppelin/contracts for potential use.  
  * Configure the hardhat.config.ts file with a default local Hardhat network.  
*   
* **BCD1T2\_ContractDataStructures:** **Define Core Contract State.**  
  * Create contracts/BettingManager.sol.  
  * Inside, define the core data structures. Create a Bet struct to hold bettor (address), stake (uint256), marketId (uint256), and selection (uint256).  
  * Define the primary state variable: mapping(bytes32 \=\> Bet\[\]) public betsByMatch. This will map a matchId to an array of all bets placed on it.  
  * Define mapping(bytes32 \=\> bool) public isMatchSettled to prevent duplicate settlements.  
*   
* **BCD1T3\_PlaceBetFunction:** **Implement the placeBet Function.**  
  * Create the placeBet(bytes32 matchId, uint256 marketId, uint256 selection) external payable function.  
  * Add require statements to ensure msg.value \> 0 and isMatchSettled\[matchId\] \== false.  
  * Implement the logic to create a new Bet struct in memory and push it to the betsByMatch\[matchId\] array.  
  * Define and emit a BetPlaced event with indexed parameters for matchId and bettor.  
*   
* **BCD1T4\_PlaceBetTests:** **Write Unit Tests for placeBet.**  
  * In the test directory, create BettingManager.ts.  
  * Using ethers.js and Hardhat's testing environment, write tests to:  
    * Verify that a bet can be placed successfully.  
    * Confirm the BetPlaced event is emitted with the correct arguments.  
    * Ensure the bettor's ETH is transferred to the contract.  
    * Test that the function reverts if no stake is sent (msg.value \== 0).  
    * Test that the function reverts if the match is already settled.  
  *   
*   
* **BCD1T5\_SettleFunctionShell:** **Create the settleMatch Function Shell.**  
  * Create an internal function \_settleMatch(bytes32 matchId, uint256 winningSelectionForMarket1) (for example).  
  * For now, leave the function body empty or with a simple placeholder. The goal is to define the interface that the mocked oracle will call on Day 2\.  
  * Add a public-facing settleMatch function that can only be called by the contract owner (onlyOwner) for now, which in turn calls the internal function. This will be our initial "mock oracle" entry point.  
* 

---

### **Day 2: Settlement Logic and Testnet Deployment**

**Goal:** Implement the settlement logic, deploy the contract to the Polygon Mumbai testnet, and create a script to act as the mocked oracle.

* **BCD2T1\_SettlementLogic:** **Implement Simplified Settlement Logic.**  
  * Flesh out the \_settleMatch function from **BCD1T5\_SettleFunctionShell**.  
  * The logic should:  
    1. Set isMatchSettled\[matchId\] \= true.  
    2. Iterate through the betsByMatch\[matchId\] array.  
    3. For each bet, check if its selection matches the winningSelection passed to the function.  
    4. Calculate a total prize pool from the stakes of all losing bets.  
    5. For the MVP, assume a simple "winner-take-all" from the losing pool. Distribute the prize pool to the winner(s).  
    6. Define and emit a BetSettled(address indexed bettor, uint256 payout, bool won) event for each bet processed.  
  *   
*   
* **BCD2T2\_SettlementTests:** **Write Unit Tests for Settlement.**  
  * Add new tests to test/BettingManager.ts to cover the settlement logic.  
  * Test scenarios with one winner, multiple winners (simple equal split), and no winners (contract keeps funds, for the MVP).  
  * Verify that BetSettled events are emitted correctly and that winners receive the correct payout.  
*   
* **BCD2T3\_HardhatConfigTestnet:** **Configure Hardhat for Polygon Mumbai.**  
  * Install dotenv to manage environment variables securely.  
  * In hardhat.config.ts, add a networks configuration for polygonMumbai, including the RPC URL and a private key for deployment (sourced from a .env file).  
  * **Note:** If you are waiting on the DevOps team for a specific RPC provider URL, you can use a public RPC for now, but be aware it may be rate-limited.  
*   
* **BCD2T4\_DeploymentScript:** **Create a Reusable Deployment Script.**  
  * In the scripts directory, create deploy.ts.  
  * This script should use ethers.js to get the BettingManager contract factory and deploy it.  
  * It should print the deployed contract's address to the console upon completion.  
*   
* **BCD2T5\_DeployToTestnet:** **Deploy Contract to Polygon Mumbai.**  
  * Run the deployment script, targeting the polygonMumbai network (e.g., npx hardhat run scripts/deploy.ts \--network polygonMumbai).  
  * Carefully record the final, deployed contract address. This address is the critical deliverable for the Frontend and Backend teams.  
  * Verify the contract deployment on Polygonscan.  
*   
* **BCD2T6\_MockOracleScript:** **Create Manual Settlement Script.**  
  * Create a new Hardhat task or a script file: scripts/settle.ts.  
  * This script will take a matchId and a winning outcome as command-line arguments.  
  * It will connect to the deployed contract on Polygon Mumbai and call the public settleMatch function, acting as the trusted oracle for the demo. This is the key to simulating the end of a match.  
* 

---

### **Day 3: Integration and Demonstration Support**

**Goal:** Provide the final contract details to other teams, support integration, and execute the settlement part of the live demo.

* **BCD3T1\_ShareABIAndAddress:** **Distribute Final Contract Artifacts.**  
  * This is your most important task on Day 3\.  
  * Share the final, verified Polygon Mumbai contract address from **BCD2T5\_DeployToTestnet** with both the Frontend and Backend team leads.  
  * Copy the compiled contract ABI (BettingManager.json from the artifacts directory) into a shared location, such as a new packages/contract-abi directory, so that other teams can easily import it.  
*   
* **BCD3T2\_IntegrationSupport:** **Support On-Chain Debugging.**  
  * Be on standby to help the Frontend team debug their placeBet transaction calls.  
  * Use Polygonscan to inspect incoming transactions to your contract in real-time. Check for reverts and help diagnose issues related to parameters, stake value, etc.  
  * Work with the Backend team to ensure their event listener is correctly configured with the final address and ABI and is picking up BetPlaced events.  
*   
* **BCD3T3\_LiveSettlementExecution:** **Execute the Settlement Demo.**  
  * During the full E2E test and the final demonstration, you will be responsible for the "match has ended" part of the flow.  
  * When the presenter announces they will settle a match, run your scripts/settle.ts script from your command line, passing the correct matchId and a pre-determined winning outcome that corresponds to a bet placed during the demo.  
  * Confirm on Polygonscan that the settlement transaction was successful and that the payout transactions to the winning user occurred as expected.  
*   
* **BCD3T4\_DemoPrep:** **Prepare Blockchain Talking Points.**  
  * Prepare a concise explanation of the smart contract's role for the presentation.  
  * Be ready to explain how it works: it holds funds in escrow, receives a trusted result from a (mocked) oracle, and autonomously pays out winners, removing any need to trust a central company.  
  * Explain why the mocked oracle was used for the hackathon and briefly describe how Chainlink Functions would replace it in production.  
* 

