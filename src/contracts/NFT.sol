// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage  {
  //The tokenCount var is the Token's ID.
  uint public tokenCount;

  //Calling the Inherited Constructor of ERC721URIStorage passing (NFTname,sNFTsymbol)
  constructor() ERC721("MyNFT", "NFT") {}
  
  //Mint New NFT
  function mint(string memory _tokenURI) external returns(uint newTokenCount) {
    tokenCount ++;
    _safeMint(msg.sender, tokenCount);
    _setTokenURI(tokenCount, _tokenURI);
    return(tokenCount);
  }

}
