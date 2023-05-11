const stakingNFT = artifacts.require('StakingNFT.sol');
module.exports = (deployer) => {
    deployer.deploy(
        stakingNFT,
        '0xd7Cd0D73151aef7024b09DE17Fe0619076336d90',
        '0x45F7375F1d484E2D6f080Bb908b62D60387eB968'
    );
};
