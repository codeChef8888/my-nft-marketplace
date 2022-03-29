const NFT = artifacts.require("NFT");
const Marketplace = artifacts.require("Marketplace");

module.exports = function (deployer) {
  deployer.deploy(NFT);

  deployer.deploy(Marketplace, 1);
};
