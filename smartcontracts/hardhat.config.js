require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

let accounts = { mnemonic: process.env.MNEMONIC }

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  //defaultNetwork: "gnosis",
  networks: {
    hardhat: {
    },
    gnosis: {
      url: "https://rpc.gnosischain.com",
      //url: "https://rpc.ankr.com/gnosis",
      gasPrice: 160000000000, //units of gas you are willing to pay, aka gas limit
      //gasMultiplier: 2,
      accounts: accounts,
    },
    chiado: {
      url: "https://rpc.chiadochain.net",
      gasPrice: 1000000000,
      accounts: accounts,
    },
  },
};
