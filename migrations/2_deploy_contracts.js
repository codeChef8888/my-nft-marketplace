const NFT = artifacts.require("NFT");
const Marketplace = artifacts.require("Marketplace");
const NFT1155 = artifacts.require("NFT1155");

module.exports = function (deployer) {
  deployer.deploy(NFT);

  deployer.deploy(Marketplace, 1);

  deployer.deploy(NFT1155);
};
