const hre = require("hardhat");

async function main() {
  console.log("Deploying AuthenticationContract...");

  const AuthenticationContract = await hre.ethers.getContractFactory("AuthenticationContract");
  const authContract = await AuthenticationContract.deploy();

  await authContract.waitForDeployment();
  
  const deployedAddress = await authContract.getAddress();
  console.log(`AuthenticationContract deployed to: ${deployedAddress}`);
  
  // Write deployment details to a file for the frontend
  const fs = require("fs");
  const deployData = {
    authContractAddress: deployedAddress,
    deploymentTimestamp: new Date().toISOString(),
    network: hre.network.name
  };
  
  if (!fs.existsSync("./src/deployments")) {
    fs.mkdirSync("./src/deployments", { recursive: true });
  }
  
  fs.writeFileSync(
    `./src/deployments/${hre.network.name}.json`,
    JSON.stringify(deployData, null, 2)
  );
  
  console.log(`Deployment data saved to src/deployments/${hre.network.name}.json`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 