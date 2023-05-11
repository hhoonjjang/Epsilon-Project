//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import '../contracts/HutToken.sol';
import '../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol';
import '../node_modules/@openzeppelin/contracts/access/Ownable.sol';

contract CrowdSale is Ownable {
    using SafeMath for uint256;

    address payable public beneficiary; // 최종적으로 ICO를 통해 모인 이더리움을 받게 될 주소
    uint public fundingGoal; // 모아야 하는 이더리움의 양
    uint public amountRaised; // 현재까지 모아진 이더리움의 양
    uint public deadline; // ICO 투자 마감 deadline
    uint public price; // 이더리움 1 wei당 코인 가격
    HutToken public tokenReward; // ICO하는 코인 주소

    mapping(address => uint256) public donations;

    event FundTransfer(address backer, uint amount, bool isContribution);
    event GoalReached(uint amountRaised);
    event Refund(address investor, uint value);
    event TokenRewardSent(address investor, uint amount);
    struct Funder {
        address payable addr;
        uint amount;
    }

    Funder[] public funders;

    constructor(address payable _beneficiary, uint _fundingGoal, uint _duration, uint _price, address _reward) {
        require(_beneficiary != address(0), 'Invalid beneficiary address');
        require(_fundingGoal > 0, 'Invalid funding goal');
        require(_duration > 0, 'Invalid duration');
        require(_price > 0, 'Invalid price');
        require(_reward != address(0), 'Invalid token reward address');

        beneficiary = _beneficiary;
        fundingGoal = _fundingGoal;
        deadline = block.timestamp + (_duration * 1 minutes);
        price = _price;
        tokenReward = HutToken(_reward);
    }

    receive() external payable {
        require(msg.sender != address(0), 'Invalid sender address');
        require(msg.value > 0, 'Invalid value');

        uint256 amount = msg.value;
        funders.push(Funder({ addr: payable(msg.sender), amount: amount }));
        amountRaised = amountRaised.add(amount);
        emit FundTransfer(msg.sender, amount, true);
    }

    function checkBlockTime() public view returns (uint256) {
        return block.timestamp;
    }

    function getFundingGoal() public view returns (uint256) {
        return fundingGoal;
    }

    function getNowAmountRasied() public view returns (uint256) {
        return amountRaised;
    }

    function getDeadLine() public view returns (uint256) {
        return deadline;
    }

    function getHutToken() public view returns (uint tokenAmount) {
        return tokenReward.balanceOf(address(this));
    }

    function checkGoalReached() public {
        require(block.timestamp >= deadline, 'Crowdsale not yet ended');
        if (amountRaised >= fundingGoal) {
            uint256 amount = amountRaised;
            amountRaised = 0;
            beneficiary.transfer(amount);
            emit FundTransfer(beneficiary, amount, false);
            emit GoalReached(amount);
            for (uint256 i = 0; i < funders.length; i++) {
                Funder storage funder = funders[i];
                uint256 rewardAmount = funder.amount * price;
                tokenReward.transfer(funder.addr, rewardAmount);
                emit TokenRewardSent(funder.addr, rewardAmount);
            }
        } else {
            for (uint256 i = 0; i < funders.length; i++) {
                Funder storage funder = funders[i];
                uint256 amount = funder.amount;
                funder.amount = 0;

                if (amount > 0) {
                    funder.addr.transfer(amount);
                    emit Refund(funder.addr, amount);
                    emit FundTransfer(funder.addr, amount, false);
                }
            }
        }
    }

    function getFundersCount() public view returns (uint256) {
        return funders.length;
    }

    function withdraw(uint256 _amount) public onlyOwner {
        uint256 ownerBalance = address(this).balance;
        require(ownerBalance > _amount, 'Owner has not balance to withdraw');
        (bool sent, ) = msg.sender.call{ value: _amount }('');
        require(sent, 'Failed to send user balance back to the owner');
    }
}
