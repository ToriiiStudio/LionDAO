const { ethers } = require("hardhat");

const NFT = artifacts.require("LionDAO");

module.exports = async ({
  getNamedAccounts,
  deployments,
  getChainId,
  getUnnamedAccounts,
}) => {
  const {deploy, all} = deployments;
  const accounts = await ethers.getSigners();
  const deployer = accounts[0];
  console.log("");
  console.log("Deployer: ", deployer.address);

  nft = await deploy('LionDAO', {
    contract: "LionDAO",
    from: deployer.address,
    args: [
    ],
  });

  console.log("LionDAO address: ", nft.address);
};

module.exports.tags = ['LionDAO'];