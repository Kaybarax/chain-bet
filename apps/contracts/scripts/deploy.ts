import { ethers } from "hardhat";
import { network, run } from "hardhat";

async function main() {
  console.log("Deploying FootballBetting contract...");

  // Deploy the FootballBetting contract
  const FootballBetting = await ethers.getContractFactory("FootballBetting");
  const footballBetting = await FootballBetting.deploy();

  // Wait for the contract to be deployed
  await footballBetting.waitForDeployment();

  // Get the contract address
  const address = await footballBetting.getAddress();
  console.log(`FootballBetting deployed to: ${address}`);

  // Log deployment information for verification
  console.log(`\nDeployment information:`);
  console.log(`Network: ${network.name}`);
  console.log(`Contract address: ${address}`);
  
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  if (deployer) {
    console.log(`Deployer: ${deployer.address}`);
  }
  
  console.log(`Block number: ${await ethers.provider.getBlockNumber()}`);

  // Wait for 5 confirmations for better reliability
  console.log("\nWaiting for 5 confirmations...");
  await footballBetting.deploymentTransaction()?.wait(5);
  console.log("Confirmed!");

  // Verify the contract on Etherscan if not on a local network
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("\nVerifying contract on Etherscan...");
    try {
      await run("verify:verify", {
        address: address,
        constructorArguments: [],
      });
      console.log("Contract verified on Etherscan!");
    } catch (error) {
      console.error("Error verifying contract:", error);
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
