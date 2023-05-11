//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import '../contracts/HutToken.sol';
import '../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol';
import '../node_modules/@openzeppelin/contracts/access/Ownable.sol';

contract Vendor is Ownable {
    using SafeMath for uint256;
    HutToken public hutToken;
    event BuyTokens(address buyer, uint256 amountOfMatic, uint256 amountOfTokens);
    event SellTokens(address seller, uint256 amountofTokens, uint256 amountOfMatic);
    address private admin;
    uint256 private feeRate = 3; //수수료 퍼센트

    constructor(address _tokenAddress) {
        admin = msg.sender;
        hutToken = HutToken(_tokenAddress);
    }

    function getHutToken() public view returns (uint256 tokenAmount) {
        return hutToken.balanceOf(address(this));
    }

    function buyTokens(uint256 _rate) public payable {
        require(msg.sender != address(0), 'Sender address cannot be zero');
        require(msg.value > 0, 'Send Matic to buy some tokens');

        uint256 vendorBalance = hutToken.balanceOf(address(this));

        uint256 hutTokenAmount = msg.value.mul(_rate).div(100).mul(100 - feeRate).div(100);
        uint256 feeAmount = msg.value.mul(feeRate).div(100);

        require(vendorBalance >= hutTokenAmount, 'Vendor contract has not enough tokens in its balance');
        bool sent = hutToken.transfer(msg.sender, hutTokenAmount);
        payable(admin).transfer(feeAmount);
        require(sent, 'Failed to transfer tokens to buyer');
        emit BuyTokens(msg.sender, msg.value, hutTokenAmount);
    }

    function sellTokens(uint256 _tokenAmountToSell, uint256 _rate) public {
        require(_tokenAmountToSell > 0, 'Specify an amount of token greater than zero');

        uint256 userBalance = hutToken.balanceOf(msg.sender);
        require(userBalance >= _tokenAmountToSell, 'Your balance is lower than the amount of tokens you want to sell');

        uint256 amountOfMaticToTransfer = _tokenAmountToSell.mul(_rate).div(100).mul(100 - feeRate).div(100);
        require(amountOfMaticToTransfer > 0, 'Amount of Matic to transfer must be greater than zero');

        uint256 ownerMaticBalance = address(this).balance;
        require(ownerMaticBalance >= amountOfMaticToTransfer, 'Vendor has not enough funds to accept the sell request');

        bool sent = hutToken.transferFrom(msg.sender, address(this), _tokenAmountToSell);
        require(sent, 'Failed to transfer tokens from user to vendor');
        (sent, ) = msg.sender.call{ value: amountOfMaticToTransfer }('');
        require(sent, 'Failed to send Matic to the user');
        emit SellTokens(msg.sender, _tokenAmountToSell, amountOfMaticToTransfer);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function setFeeRate(uint256 _newFeeRate) external {
        require(msg.sender == admin, 'Only admin can set the fee rate');
        feeRate = _newFeeRate;
    }

    function withdrawEther(uint256 _amount) external {
        require(msg.sender == admin, 'Only admin can withdraw Ether from the contract');
        require(address(this).balance >= _amount, 'Insufficient Ether balance in the contract');
        payable(admin).transfer(_amount);
    }

    function withdrawHutToken(uint256 _amount) external {
        require(msg.sender == admin, 'Only admin can withdraw HutToken from the contract');
        require(hutToken.balanceOf(address(this)) >= _amount, 'Insufficient HutToken balance in the contract');
        hutToken.transfer(admin, _amount);
    }
}
