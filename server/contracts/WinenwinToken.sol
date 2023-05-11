// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import '../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '../node_modules/@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol';
import '../node_modules/@openzeppelin/contracts/access/Ownable.sol';
import '../node_modules/@openzeppelin/contracts/utils/Counters.sol';

contract WinenwinToken is ERC1155, Ownable, ERC1155URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;
    string public constant name = 'winenwin';
    string public constant symbol = 'WIN';
    string private _uri;
    address[] private _admins;

    // address public tokenOwner; // 토큰 소유자
    // address public admin; // 토큰 관리자

    constructor(address[] memory admins_) ERC1155(_uri) {
        // tokenOwner = msg.sender;
        // admin = address(0);
        _setBaseURI('https://gateway.pinata.cloud/ipfs/');
        for (uint256 i = 0; i < admins_.length; i++) {
            _admins.push(admins_[i]);
        }
    }

    mapping(uint256 => uint256) public tokenSupply;
    mapping(uint256 => string) private _tokenURIs;

    function uri(uint256 tokenId) public view virtual override(ERC1155, ERC1155URIStorage) returns (string memory) {
        return super.uri(tokenId);
    }

    function mint(address account, uint256 amount, string memory _tokenURI) public {
        // require( msg.sender == tokenOwner || msg.sender == admin, "Caller is not authorized" ); // 민트 권한 제어
        // require(totalSupply + amount <= maxSuply, "Exceeds maximum supply."); // 최대 발행량 제한
        require(isAdmin(msg.sender), 'Caller is not authorized');

        _tokenId.increment();
        uint256 tokenId = _tokenId.current();

        tokenSupply[tokenId] += amount;
        _setURI(tokenId, _tokenURI);
        _mint(account, tokenId, amount, '');
    }

    // 총 수량에서 추가
    function addTokenSupply(uint256 tokenId, uint256 amount) public onlyOwner {
        // uint256 newSupply = tokenSupply[tokenId] + amount;
        // require(newSupply >= tokenSupply[tokenId], "Invalid token supply."); // token 추가할 경우 소유한 만큼 추가할 수 있도록 예외처리

        tokenSupply[tokenId] += amount;
        _mint(msg.sender, tokenId, amount, '');
    }

    // 총 수량에서 제거
    function removeTokenSupply(uint256 tokenId, uint256 amount) public {
        tokenSupply[tokenId] -= amount;
        uint256 newSupply = tokenSupply[tokenId];
        require(newSupply >= 0, 'Invalid token supply.'); // token 제거할 경우 0원 미만으로 되지 않도록 예외처리

        _burn(msg.sender, tokenId, amount);
    }

    // 여러 개를 한번에 mint 가능한 함수
    function mintBatch(address[] memory accounts, uint256[] memory amounts, string[] memory tokenURIs) public {
        require(accounts.length == amounts.length && accounts.length == tokenURIs.length, 'Arrays length mismatch');

        for (uint256 i = 0; i < accounts.length; i++) {
            mint(accounts[i], amounts[i], tokenURIs[i]);
        }
    }

    function isAdmin(address account) public view returns (bool) {
        for (uint256 i = 0; i < _admins.length; i++) {
            if (_admins[i] == account) {
                return true;
            }
        }
        return false;
    }

    function getNftAmount() public view returns (uint256) {
        uint256 tokenId = uint256(_tokenId.current());
        return tokenId;
    }

    function getOwners() public view onlyOwner returns (address[] memory) {
        return _admins;
    }
}
