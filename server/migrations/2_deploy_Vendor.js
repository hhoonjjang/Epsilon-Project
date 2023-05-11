const vendor = artifacts.require('Vendor.sol');
module.exports = (deployer) => {
    deployer.deploy(vendor, '0xd7Cd0D73151aef7024b09DE17Fe0619076336d90');
};
