//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import '../node_modules/@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol';
import '../node_modules/@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol';
import '../node_modules/@openzeppelin/contracts/access/Ownable.sol';

contract HutToken is ERC20Burnable, Ownable, ERC20Capped {
    uint256 private _cap;
    uint256 private initialSupply = 1000 * 10 ** decimals();

    constructor() ERC20('HutToken', 'HUT') ERC20Capped(1000 * 10 ** 18) {
        _cap = initialSupply;
        _mint(msg.sender, _cap);
    }

    function checkSupply() public view returns (uint256) {
        return totalSupply();
    }

    function cap() public view virtual override returns (uint256) {
        return _cap;
    }

    function _mint(address account, uint256 amount) internal override(ERC20, ERC20Capped) {
        require(totalSupply() + amount <= cap(), 'ERC20Capped: cap exceeded');
        ERC20._mint(account, amount);
    }

    function minting(address rec, uint256 amount) external {
        _cap += amount;
        _mint(rec, amount);
    }

    function burning(address account, uint256 amount) public onlyOwner {
        _cap -= amount;
        _burn(account, amount);
    }
}
