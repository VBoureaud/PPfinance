
const hre = require("hardhat");

async function main() {

  const signers = await hre.ethers.getSigners();
  const addr = signers[0];
  console.log("deployer address ", addr.address);

  // CHANGE CONTRACT ADDRESS HERE
  const contractAddress = 
  "0x4EB09104fF5dDe029a78d9bb10DB7fCe25b2b06c"; 
  // yo
  console.log("contractAddress: ", contractAddress);

  const myContract = await hre.ethers.getContractAt("PPF", contractAddress);

  await myContract.purchasePixel(1,[222,222,222], {value: "2000000000000000", gasLimit: 200000});
  console.log("purchased pixel ");
    
}



main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
