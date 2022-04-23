
const hre = require("hardhat");

async function main() {

  const signers = await hre.ethers.getSigners();
  const addr = signers[0];
  console.log("deployer address ", addr.address);

  // CHANGE CONTRACT ADDRESS HERE
  const contractAddress = 
  "0xaC4DA59Ca9Eab74e19A91670CA50B6df6C63841C"; 
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
