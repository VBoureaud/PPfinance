require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();
require('hardhat-contract-sizer');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.13",
        settings: {
          optimizer: {
            enabled: true,
            runs: 500,
          },
        },
      },
      {
        version: "0.8.0"
      }
    ]
  },
  networks: {
    rinkeby: {
      url: `${process.env.RINKEBY_RPC_URL}`, //PRIVATE_KEY
      accounts: [`0x${process.env.PRIVATE_KEY}`] // pkey2
    },
    matic: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY]
    },
    'optimistic-kovan': {
      chainId: 69,
      url: 'https://kovan.optimism.io',
      accounts: [process.env.PRIVATE_KEY]
  },
    },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: false,
    strict: true,
  },

};
