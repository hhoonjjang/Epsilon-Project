const winenwinToken = artifacts.require('WinenwinToken.sol');
module.exports = (deployer) => {
    deployer.deploy(winenwinToken, 'NFTToken', 'nft');
};
