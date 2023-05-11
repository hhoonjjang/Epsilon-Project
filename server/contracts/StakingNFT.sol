//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import '../contracts/HutToken.sol';
import '../contracts/WinenwinToken.sol';
import '../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol';
import '../node_modules/@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol';
import '../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol';

contract StakingNFT is IERC1155Receiver, ReentrancyGuard {
    using SafeMath for uint256;
    WinenwinToken public nft;
    HutToken public hutToken;

    mapping(uint => mapping(address => uint256)) private stakeAmount;
    mapping(uint256 => uint256) public stakePrices;
    mapping(uint256 => uint256) public nftAmount;

    struct NftInfo {
        uint256 tokenId;
        uint256 amount;
    }
    struct StakeItem {
        address owner;
        uint256 tokenId;
        uint256 start;
        uint256 amount;
        uint256 deadline;
        uint256 reward;
        bool isClaimed;
    }

    uint256 public totalRewards;
    StakeItem[] public stakeList;
    event NFTStaked(address _owner, uint256 _tokenId, uint _amount);
    event NFTUnstaked(address _owner, uint256 _tokenId, uint _amount);
    event Claimed(address _owner, uint256 amount);

    constructor(address _HutTokenAddress, address _nftAddress) {
        nft = WinenwinToken(_nftAddress);
        hutToken = HutToken(_HutTokenAddress);
    }

    function staking(uint256 _tokenId, uint256 _amount, uint256 _duration, uint256 _reward) public {
        require(nft.balanceOf(msg.sender, _tokenId) > 0, 'Not the owner of the NFT');
        uint256 start = block.timestamp;
        uint256 deadline = start + _duration * 1 minutes;
        uint256 reward = _reward.div(100);
        StakeItem memory stake = StakeItem(msg.sender, _tokenId, start, _amount, deadline, reward, false);
        stakeList.push(stake);
        nft.safeTransferFrom(msg.sender, address(this), _tokenId, _amount, '');
        totalRewards += reward;
        emit NFTStaked(msg.sender, _tokenId, _amount);
    }

    function stakingBatch(
        uint256[] calldata _tokenIds,
        uint256[] calldata _amounts,
        uint256[] calldata _durations,
        uint256[] calldata _rewards
    ) public nonReentrant {
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            staking(_tokenIds[i], _amounts[i], _durations[i], _rewards[i].div(100));
        }
    }

    function stakingBatch2(
        uint256[] calldata _tokenIds,
        uint256[] calldata _amounts,
        uint256[] calldata _durations,
        uint256[] calldata _rewards
    ) public nonReentrant {
        uint256 start = block.timestamp;
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            StakeItem memory stake = StakeItem(
                msg.sender,
                _tokenIds[i],
                start,
                _amounts[i],
                start + _durations[i] * 1 minutes,
                _rewards[i].div(100),
                false
            );
            totalRewards += _rewards[i] / 100;
            stakeList.push(stake);
        }
        nft.safeBatchTransferFrom(msg.sender, address(this), _tokenIds, _amounts, '');
    }

    function unStaking(uint256 _tokenId, uint256 _start) public {
        uint256 index = stakeList.length;
        for (uint256 i = 0; i < stakeList.length; i++) {
            if (stakeList[i].tokenId == _tokenId && stakeList[i].start == _start && stakeList[i].owner == msg.sender) {
                index = i;
                break;
            }
        }
        require(index < stakeList.length, 'Stake not found');
        StakeItem memory stake = stakeList[index];
        uint256 elapsed = block.timestamp;
        require(elapsed < stake.deadline, 'Stake period already ended');

        // Transfer the NFT back to the user
        nft.safeTransferFrom(address(this), msg.sender, stake.tokenId, stake.amount, '');

        // Update the stakeList and totalRewards
        totalRewards -= stake.reward;
        emit NFTUnstaked(msg.sender, stake.tokenId, stake.amount);
        popStake(_tokenId, _start);
    }

    function popStake(uint256 _tokenId, uint256 _start) internal {
        for (uint256 i = 0; i < stakeList.length; i++) {
            if (stakeList[i].tokenId == _tokenId && stakeList[i].start == _start) {
                delete stakeList[i];
                stakeList[i] = stakeList[stakeList.length - 1];
                stakeList.pop();
                return;
            }
        }
        revert('Stake not found for the given token ID');
    }

    function getStakeInfo(uint256 _tokenId, uint256 _start) public view returns (StakeItem memory) {
        require(stakeList.length > 0, 'No stakes found');
        for (uint256 i = 0; i < stakeList.length; i++) {
            if (stakeList[i].tokenId == _tokenId && stakeList[i].start == _start) {
                return stakeList[i];
            }
        }
        revert('Stake not found');
    }

    function getHutToken() public view returns (uint tokenAmount) {
        uint256 vendorBalance = hutToken.balanceOf(address(this));
        return vendorBalance;
    }

    function getTotalRewards() public view returns (uint) {
        return totalRewards;
    }

    function getStakingList() public view returns (StakeItem[] memory) {
        require(stakeList.length > 0);
        return stakeList;
    }

    function getTokenListLength() public view returns (uint256) {
        return stakeList.length;
    }

    function getStakeTime(uint256 _stakeListLength) public view returns (uint256) {
        return stakeList[_stakeListLength - 1].start;
    }

    function getDeadline(uint256 _stakeListLength) public view returns (uint256) {
        return stakeList[_stakeListLength - 1].deadline;
    }

    function getOwnerTokenList() public view returns (NftInfo[] memory) {
        uint256 balance = nft.getNftAmount(); // 총발행한 컬렉션수
        NftInfo[] memory list = new NftInfo[](balance);
        for (uint256 i = 0; i < balance; i++) {
            if (nft.balanceOf(msg.sender, i + 1) > 0) {
                list[i] = NftInfo(i + 1, nft.balanceOf(msg.sender, i + 1));
            }
        }
        return list;
    }

    function batchClaim(uint256[] calldata _tokenIds, uint256[] calldata _startTime) public nonReentrant {
        uint256 tempRewards;
        for (uint i = 0; i < _tokenIds.length; i++) {
            StakeItem memory stake = getStakeInfo(_tokenIds[i], _startTime[i]);
            require(stake.owner == msg.sender, 'Not the owner of the stake');
            require(stake.isClaimed == false, 'Reward already claimed');
            uint256 elapsed = block.timestamp;
            require(elapsed >= stake.deadline, 'Stake period has not ended yet');
            stake.isClaimed = true;
            tempRewards += stake.reward;
            nft.safeTransferFrom(address(this), msg.sender, stake.tokenId, stake.amount, '');
            popStake(_tokenIds[i], _startTime[i]);
        }
        totalRewards -= tempRewards;
        hutToken.transfer(msg.sender, tempRewards);
        emit Claimed(msg.sender, tempRewards);
    }

    function getBatchReward(address _account) public view returns (uint256) {
        uint256 batchReward = 0;
        for (uint256 i = 0; i < stakeList.length; i++) {
            if (
                stakeList[i].owner == _account &&
                block.timestamp >= stakeList[i].deadline &&
                stakeList[i].isClaimed == false
            ) {
                batchReward += stakeList[i].reward;
            }
        }
        return batchReward;
    }

    function getBatchRewardLength(address _account) public view returns (uint256) {
        uint256 batchRewardLength = 0;
        for (uint256 i = 0; i < stakeList.length; i++) {
            if (
                stakeList[i].owner == _account &&
                block.timestamp >= stakeList[i].deadline &&
                stakeList[i].isClaimed == false
            ) {
                batchRewardLength++;
            }
        }
        return batchRewardLength;
    }

    function getBatchClaimList(address _account) public view returns (uint256[] memory) {
        uint256[] memory claimableList = new uint256[](getBatchRewardLength(_account) * 2);
        uint256 j = 0;
        for (uint256 i = 0; i < stakeList.length; i++) {
            if (
                stakeList[i].owner == _account &&
                block.timestamp >= stakeList[i].deadline &&
                stakeList[i].isClaimed == false
            ) {
                StakeItem memory stake = getStakeInfo(stakeList[i].tokenId, stakeList[i].start);
                claimableList[j++] = stake.tokenId;
                claimableList[j++] = stake.start;
            }
        }
        return claimableList;
    }

    function batchClaim2(address _account) public nonReentrant {
        uint256 tempReward;
        uint256 tempLength = getBatchRewardLength(_account);
        uint256[] memory ids = new uint256[](tempLength);
        uint256[] memory amounts = new uint256[](tempLength);
        uint256[] memory startTimes = new uint256[](tempLength);
        uint256 j = 0;
        for (uint256 i = 0; i < stakeList.length; i++) {
            if (
                stakeList[i].owner == _account &&
                block.timestamp >= stakeList[i].deadline &&
                stakeList[i].isClaimed == false
            ) {
                StakeItem memory stake = getStakeInfo(stakeList[i].tokenId, stakeList[i].start);
                tempReward += stake.reward;
                stake.isClaimed = true;
                ids[j] = stake.tokenId;
                amounts[j] = stake.amount;
                startTimes[j] = stake.start;
                j++;
            }
        }
        for (uint256 i = 0; i < tempLength; i++) {
            popStake(ids[i], startTimes[i]);
        }
        totalRewards -= tempReward;
        nft.safeBatchTransferFrom(address(this), msg.sender, ids, amounts, '');
        hutToken.transfer(msg.sender, tempReward);
        emit Claimed(msg.sender, tempReward);
    }

    function claimReward(uint256 _tokenId, uint256 _start) public nonReentrant {
        StakeItem memory stake = getStakeInfo(_tokenId, _start);
        require(stake.owner == msg.sender, 'Not the owner of the stake');
        require(stake.isClaimed == false, 'Reward already claimed');

        uint256 elapsed = block.timestamp;
        require(elapsed >= stake.deadline, 'Stake period has not ended yet');

        uint256 reward = stake.reward;
        stake.isClaimed = true;
        totalRewards -= reward;

        hutToken.transfer(msg.sender, reward);
        nft.safeTransferFrom(address(this), msg.sender, stake.tokenId, stake.amount, '');
        popStake(stake.tokenId, stake.start);
        emit Claimed(msg.sender, reward);
        emit NFTStaked(msg.sender, stake.tokenId, stake.amount);
    }

    function checkBlockTime() public view returns (uint256) {
        return block.timestamp;
    }

    function onERC1155Received(address, address, uint256, uint256, bytes calldata) public pure returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata
    ) public pure returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function supportsInterface(bytes4 interfaceID) external pure returns (bool) {
        return interfaceID == type(IERC1155Receiver).interfaceId;
    }
}
