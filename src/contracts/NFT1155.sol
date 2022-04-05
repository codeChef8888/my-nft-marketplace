// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT1155 is ERC1155, Ownable {
    uint256 public tokenCount;
    
    //For Mapping Specific Token Ids to it's corresponding token URI.
    struct tokenURI {
        string URI;
    }

    mapping(uint256 => tokenURI) public tokenURIs;


    constructor() ERC1155("") {}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(uint256 _amount, string memory _tokenURI)
        public
        returns (uint256)
    {
        require(_amount > 0, "Amount must be greater than zero");

        tokenCount++;
        _setURI(_tokenURI);
        tokenURIs[tokenCount] = tokenURI (
            _tokenURI
        );
    _mint(msg.sender, tokenCount, _amount, "");

        return (tokenCount);
    }
}
