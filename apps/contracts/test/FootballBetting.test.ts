import { expect } from "chai";
import hre from "hardhat";
import { FootballBetting } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import "@nomicfoundation/hardhat-chai-matchers";

const { ethers } = hre;

describe("FootballBetting", function () {
  let footballBetting: FootballBetting;
  let owner: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;

  beforeEach(async function () {
    // Get signers
    const signers = await ethers.getSigners();
    owner = signers[0]!;
    user1 = signers[1]!;
    user2 = signers[2]!;

    // Deploy the contract
    const FootballBettingFactory = await ethers.getContractFactory("FootballBetting");
    footballBetting = await FootballBettingFactory.deploy();
  });

  describe("Match Creation", function () {
    it("should create a new match", async function () {
      const matchId = "match-001";
      const homeTeam = "Arsenal";
      const awayTeam = "Chelsea";
      const startTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

      // Create a match
      const tx = await footballBetting.createMatch(matchId, homeTeam, awayTeam, startTime);
      const receipt = await tx.wait();

      // Check event
      const event = receipt?.logs[0];
      expect(event).to.not.be.undefined;

      // Get the match
      const match = await footballBetting.getMatch(matchId);

      // Verify match properties
      expect(match.id).to.equal(matchId);
      expect(match.homeTeam).to.equal(homeTeam);
      expect(match.awayTeam).to.equal(awayTeam);
      expect(match.startTime).to.equal(startTime);
      expect(match.finished).to.be.false;
    });

    it("should not create a match with empty match ID", async function () {
      const startTime = Math.floor(Date.now() / 1000) + 3600;
      
      await expect(footballBetting.createMatch("", "Arsenal", "Chelsea", startTime))
        .to.be.revertedWith("Match ID cannot be empty");
    });

    it("should not create a match with start time in the past", async function () {
      const pastTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      
      await expect(footballBetting.createMatch("match-001", "Arsenal", "Chelsea", pastTime))
        .to.be.revertedWith("Start time must be in the future");
    });

    it("should not allow non-owner to create matches", async function () {
      const startTime = Math.floor(Date.now() / 1000) + 3600;
      
      await expect(footballBetting.connect(user1).createMatch("match-001", "Arsenal", "Chelsea", startTime))
        .to.be.revertedWith("Only owner can call this function");
    });
  });

  describe("Bet Placement", function () {
    let matchId: string;
    let startTime: number;

    beforeEach(async function () {
      matchId = "match-001";
      startTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      await footballBetting.createMatch(matchId, "Arsenal", "Chelsea", startTime);
    });

    it("should place a bet on a match", async function () {
      const betAmount = ethers.parseEther("0.1");
      const betType = "win";
      const prediction = "home";
      const odds = 2000; // 2.0x

      // Place a bet
      const tx = await footballBetting.connect(user1).placeBet(matchId, betType, prediction, odds, {
        value: betAmount,
      });
      const receipt = await tx.wait();

      // Check event
      const event = receipt?.logs[0];
      expect(event).to.not.be.undefined;

      // Get the bet
      const bet = await footballBetting.connect(user1).getBet(0);

      // Verify bet properties
      expect(bet.id).to.equal(0);
      expect(bet.matchId).to.equal(matchId);
      expect(bet.betType).to.equal(betType);
      expect(bet.prediction).to.equal(prediction);
      expect(bet.amount).to.equal(betAmount);
      expect(bet.odds).to.equal(odds);
      expect(bet.settled).to.be.false;
    });

    it("should not allow betting with zero amount", async function () {
      await expect(footballBetting.connect(user1).placeBet(matchId, "win", "home", 2000, {
        value: 0,
      })).to.be.revertedWith("Bet amount must be greater than 0");
    });

    it("should not allow betting on non-existent match", async function () {
      const betAmount = ethers.parseEther("0.1");
      
      await expect(footballBetting.connect(user1).placeBet("non-existent", "win", "home", 2000, {
        value: betAmount,
      })).to.be.revertedWith("Match does not exist");
    });

    it("should allow different users to place bets", async function () {
      const betAmount = ethers.parseEther("0.1");

      // User 1 places a bet
      await footballBetting.connect(user1).placeBet(matchId, "win", "home", 2000, {
        value: betAmount,
      });

      // User 2 places a bet
      await footballBetting.connect(user2).placeBet(matchId, "win", "away", 2500, {
        value: betAmount,
      });

      // Check that each user has their own bet
      const user1Bet = await footballBetting.connect(user1).getBet(0);
      const user2Bet = await footballBetting.connect(user2).getBet(1);

      expect(user1Bet.prediction).to.equal("home");
      expect(user2Bet.prediction).to.equal("away");
    });
  });

  describe("Bet Retrieval", function () {
    let matchId: string;
    let startTime: number;

    beforeEach(async function () {
      matchId = "match-001";
      startTime = Math.floor(Date.now() / 1000) + 3600;
      await footballBetting.createMatch(matchId, "Arsenal", "Chelsea", startTime);
      
      // Create some test bets
      const betAmount = ethers.parseEther("0.1");
      await footballBetting.connect(user1).placeBet(matchId, "win", "home", 2000, {
        value: betAmount,
      });
      await footballBetting.connect(user1).placeBet(matchId, "win", "away", 2500, {
        value: betAmount,
      });
    });

    it("should get a bet by id", async function () {
      const bet = await footballBetting.connect(user1).getBet(0);
      expect(bet.prediction).to.equal("home");
      expect(bet.odds).to.equal(2000);
    });

    it("should get all bets for a user", async function () {
      const bets = await footballBetting.connect(user1).getAllBets();
      expect(bets.length).to.equal(2);
      expect(bets[0]?.prediction).to.equal("home");
      expect(bets[1]?.prediction).to.equal("away");
    });

    it("should return empty array for user with no bets", async function () {
      const bets = await footballBetting.connect(user2).getAllBets();
      expect(bets.length).to.equal(0);
    });

    it("should revert when getting non-existent bet", async function () {
      await expect(footballBetting.connect(user1).getBet(999)).to.be.revertedWith("Bet does not exist");
    });
  });

  describe("Match Settlement", function () {
    let matchId: string;
    let startTime: number;

    beforeEach(async function () {
      matchId = "match-001";
      const currentBlock = await ethers.provider.getBlock("latest");
      startTime = currentBlock!.timestamp + 7200; // 2 hours from current block
      await footballBetting.createMatch(matchId, "Arsenal", "Chelsea", startTime);
    });

    it("should settle a match", async function () {
      // Fast forward time to after match start
      await ethers.provider.send("evm_increaseTime", [7300]);
      await ethers.provider.send("evm_mine", []);

      const result = "home";
      await footballBetting.settleMatch(matchId, result);

      const match = await footballBetting.getMatch(matchId);
      expect(match.result).to.equal(result);
      expect(match.finished).to.be.true;
    });

    it("should not allow non-owner to settle matches", async function () {
      // Fast forward time to after match start
      await ethers.provider.send("evm_increaseTime", [7300]);
      await ethers.provider.send("evm_mine", []);

      await expect(footballBetting.connect(user1).settleMatch(matchId, "home"))
        .to.be.revertedWith("Only owner can call this function");
    });

    it("should not settle match before start time", async function () {
      await expect(footballBetting.settleMatch(matchId, "home"))
        .to.be.revertedWith("Match hasn't started yet");
    });
  });

  describe("Bet Settlement", function () {
    let matchId: string;
    let startTime: number;

    beforeEach(async function () {
      matchId = "match-001";
      const currentBlock = await ethers.provider.getBlock("latest");
      startTime = currentBlock!.timestamp + 7200; // 2 hours from current block
      await footballBetting.createMatch(matchId, "Arsenal", "Chelsea", startTime);
    });

    it("should settle a winning bet", async function () {
      const betAmount = ethers.parseEther("0.1");
      const odds = 2000; // 2.0x
      
      // Fund the contract with enough ETH to cover potential payouts
      await owner.sendTransaction({
        to: await footballBetting.getAddress(),
        value: ethers.parseEther("1.0")
      });
      
      // Place a bet
      await footballBetting.connect(user1).placeBet(matchId, "win", "home", odds, {
        value: betAmount,
      });

      // Fast forward time and settle match
      await ethers.provider.send("evm_increaseTime", [7300]);
      await ethers.provider.send("evm_mine", []);
      await footballBetting.settleMatch(matchId, "home");

      // Get initial balance
      const initialBalance = await ethers.provider.getBalance(user1.address);

      // Settle the bet
      await footballBetting.settleBet(user1.address, 0);

      // Check that user received payout
      const finalBalance = await ethers.provider.getBalance(user1.address);
      const expectedPayout = (betAmount * BigInt(odds)) / BigInt(1000);
      expect(finalBalance).to.be.greaterThan(initialBalance);

      // Check bet is marked as settled and won
      const bet = await footballBetting.connect(user1).getBet(0);
      expect(bet.settled).to.be.true;
      expect(bet.won).to.be.true;
    });

    it("should not settle bet before match is finished", async function () {
      const betAmount = ethers.parseEther("0.1");
      
      await footballBetting.connect(user1).placeBet(matchId, "win", "home", 2000, {
        value: betAmount,
      });

      await expect(footballBetting.settleBet(user1.address, 0))
        .to.be.revertedWith("Match not finished yet");
    });
  });

  describe("Bet Count", function () {
    let matchId: string;
    let startTime: number;

    beforeEach(async function () {
      matchId = "match-001";
      const currentBlock = await ethers.provider.getBlock("latest");
      startTime = currentBlock!.timestamp + 7200; // 2 hours from current block
      await footballBetting.createMatch(matchId, "Arsenal", "Chelsea", startTime);
    });

    it("should return correct bet count", async function () {
      const betAmount = ethers.parseEther("0.1");
      
      expect(await footballBetting.getBetCount(user1.address)).to.equal(0);

      await footballBetting.connect(user1).placeBet(matchId, "win", "home", 2000, {
        value: betAmount,
      });
      expect(await footballBetting.getBetCount(user1.address)).to.equal(1);

      await footballBetting.connect(user1).placeBet(matchId, "win", "away", 2500, {
        value: betAmount,
      });
      expect(await footballBetting.getBetCount(user1.address)).to.equal(2);
    });
  });
});
