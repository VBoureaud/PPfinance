
const hre = require("hardhat");

async function main() {
  const signers = await hre.ethers.getSigners();
  const addr = signers[0];
  console.log("deployer address ", addr.address);
  const NFT = await hre.ethers.getContractFactory("PPF");
  const nFT = await NFT.deploy();

  await nFT.deployed();

  console.log("PPF testnet deployed to:", nFT.address);

  await new Promise(resolve => setTimeout(resolve, 75000));
  /* await hre.run("verify:verify", {
    address: nFT.address,
    constructorArguments: [
      50,
      "a string argument",
      {
        x: 10,
        y: 5,
      },
      "0xabcdef",
    ],
  }); */

  await hre.run("verify:verify", {
    address: nFT.address,
    /* constructorArguments: [
      testNaddress,
      testNOwnersRegistry
    ] */
    });
  console.log("verified");
    
}



main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
