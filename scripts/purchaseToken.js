
const hre = require("hardhat");

async function main() {

  const signers = await hre.ethers.getSigners();
  const addr = signers[0];
  console.log("deployer address ", addr.address);

  // CHANGE CONTRACT ADDRESS HERE
  const contractAddress = 
  "0x877aE605f9488e3cf4D220F20FefD1980772D156"; 
  // yo
  console.log("contractAddress: ", contractAddress);

  const myContract = await hre.ethers.getContractAt("PPF", contractAddress);

  
  for(let i = 0; i < 10; i++){
    await myContract.purchasePixel(1337 + i,[123,52,91], {value: "1000000000000000", gasLimit: 200000});
    console.log("purchased pixel ");
  }
    
}



main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
