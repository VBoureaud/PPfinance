// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
//import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract PPF is ERC721{
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

    // TODO implement payback the previous owner functionality
    function purchasePixel(uint tokenId, Color memory userColor) external payable {
      require(msg.value >= calculatePixelPrice(tokenId) , "Value below price");
      require(checkPixelPurchasableTime(tokenId), "purchase too soon");

      tokenIdsPixelColor[tokenId] = userColor;
      purchaseOfTokenIdCounter[tokenId] = purchaseOfTokenIdCounter[tokenId] + 1;
      lastPurchaseTimeOfTokenId[tokenId] = block.timestamp;

      // first purchase aka mint
      if (purchaseOfTokenIdCounter[tokenId] == 1){
        tokenCounter.increment();
        emit Purchased(address(0), msg.sender, msg.value);
        _mint(msg.sender, tokenId);
      }
      // purchase from another holder
      else{
        // TODO purchase token from previous owner
        address previousOwner = ownerOf(tokenId);
        emit Purchased(previousOwner, msg.sender, msg.value);
        // TODO check if approval is needed first or smart contract has it

        transferFrom(previousOwner, msg.sender, tokenId);
        (bool s,) = payable(previousOwner).call{value: msg.value}("");
        require(s, "tx failed");
      }
        
    }


    function checkPixelPurchasableTime(uint tokenId) public view returns(bool) {
      return lastPurchaseTimeOfTokenId[tokenId] + timeDelayAfterPurchase <= block.timestamp;
    }

    function calculatePixelPrice(uint tokenId) public view returns(uint){
        return purchaseOfTokenIdCounter[tokenId] * tokenPrice;
    }


    function tokenURI(uint256 _tokenID) override public view returns (string memory) {
        string[7] memory parts;
        parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 1 1"><path stroke="rgb(';
        parts[1] = toString(tokenIdsPixelColor[_tokenID].r);
        parts[2] = ',';
        parts[3] = toString(tokenIdsPixelColor[_tokenID].g);
        parts[4] = ',';
        parts[5] = toString(tokenIdsPixelColor[_tokenID].b);
        parts[6] = ')" d="M0 0h1"></path></svg>';
        string output = string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6]));
        string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "PP #', toString(tokenId),
            '", "description": "pixels place", "image": "data:image/svg+xml;base64,', Base64.encode(bytes(output)), '"}'))));
        output = string(abi.encodePacked('data:application/json;base64,', json));
        return output;
    }


    function totalSupply() public view returns (uint256) {
      return tokenCounter.current();
    }
}
