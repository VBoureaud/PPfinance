
const hre = require("hardhat");

async function main() {

  const signers = await hre.ethers.getSigners();
  const addr = signers[0];
  console.log("deployer address ", addr.address);

  // CHANGE CONTRACT ADDRESS HERE
  const contractAddress = 
  "0x36f9bc3C015e4798B74231bAdDAf8DC534B52403"; 
  // yo
  console.log("contractAddress: ", contractAddress);

  const myContract = await hre.ethers.getContractAt("PPF", contractAddress);

  await myContract.purchasePixel(1,[1,2,3], {value: "1000000000000000"});
  console.log("purchased pixel ");
    
}



main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
