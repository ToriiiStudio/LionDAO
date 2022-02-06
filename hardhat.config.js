require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-truffle5");
require('hardhat-deploy');
require("hardhat-gas-reporter");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require('solidity-coverage')


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",

  networks:{
    hardhat: {
      accounts:{
        "mnemonic": ""
      }
    },
    rinkeby: {
      url: process.env.ALCHEMY_API_RINKEBY_KEY,
      accounts:{
        "mnemonic": process.env.RINKEBY_TEST_MNEMONIC
      }
    },
    // mainnet: {
    //   url: process.env.ALCHEMY_API_MAINNET_KEY, 
    //   accounts:[process.env.MAINNET_PRIVATE_KEY],
    //   gas: 32718,
    //   gasPrice: 75000000000

    // }
  },  
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};