// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PPF is ERC721, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint8;

    uint public constant maxTokens = 10000;
    uint public constant tokenPrice = 0.001 ether;
    uint public constant timeDelayAfterPurchase = 1 minutes;

    Counters.Counter private tokenCounter;

    struct Color {
      uint8 r;
      uint8 g;
      uint8 b;
    }

    mapping (uint => uint) lastPurchaseTimeOfTokenId;
    mapping (uint => uint) purchaseOfTokenIdCounter;
    mapping (uint => Color) tokenIdsPixelColor;

    event Purchased(address from, address to, uint price);

    constructor() ERC721("ThePixel", "PX") {
    }

    function purchasePixel(uint tokenId, Color memory userColor) external payable {
        require(msg.value >= calculatePixelPrice(tokenId) , "Value below price");
        require(checkPixelPurchasableTime(tokenId), "purchase too soon");

        tokenIdsPixelColor[tokenId] = userColor;
        purchaseOfTokenIdCounter[tokenId] = purchaseOfTokenIdCounter[tokenId] + 1;
        lastPurchaseTimeOfTokenId[tokenId] = block.timestamp;

        if (purchaseOfTokenIdCounter[tokenId] == 0){
          tokenCounter.increment();
        }

        _mint(msg.sender, tokenId);
    }

    function checkPixelPurchasableTime(uint tokenId) public view returns(bool) {
      return lastPurchaseTimeOfTokenId[tokenId] + timeDelayAfterPurchase <= block.timestamp;
    }

    function calculatePixelPrice(uint tokenId) public view returns(uint){
        return purchaseOfTokenIdCounter[tokenId] * tokenPrice;
    }

    // TODO implement SVG color part
    function tokenURI(uint256 _tokenID) override public view returns (string memory) {
        return string(abi.encodePacked(
          "ID: ", _tokenID, 
          " Color: ", tokenIdsPixelColor[_tokenID].r.toString(),
          " ", tokenIdsPixelColor[_tokenID].g.toString(),
           " ", tokenIdsPixelColor[_tokenID].b.toString()));
    }

    function totalSupply() public view returns (uint256) {
      return tokenCounter.current();
    }
}