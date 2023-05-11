const crowdSale = artifacts.require('CrowdSale.sol');
module.exports = (deployer) => {
    deployer.deploy(
        crowdSale,
        '0x68776746d0d9F615b3ED0DFA970C73c45458A4A3',
        '100000000000000000000',
        330,
        10,
        '0xd7Cd0D73151aef7024b09DE17Fe0619076336d90'
    );
    // address payable _beneficiary, uint _fundingGoal, uint _duration, uint _price, address _reward
};
