const hut = artifacts.require('HutToken');

module.exports = (deployer) => {
    deployer.deploy(hut);
};
