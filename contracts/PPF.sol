// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PPF is ERC721, Ownable{
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

  mapping (uint => uint) public lastPurchaseTimeOfTokenId;
  mapping (uint => uint) public purchaseOfTokenIdCounter;
  mapping (uint => Color) public tokenIdsPixelColor;

  event Purchased(address from, address to, uint price);

  constructor() ERC721("ThePixel", "PX") {
  }

  function approve(address to, uint256 tokenId) public override {
    address owner = ERC721.ownerOf(tokenId);
    require(to == address(this), "can only approve this smart contract");
    require(
        _msgSender() == owner || isApprovedForAll(owner, _msgSender()),
        "ERC721: approve caller is not owner nor approved for all"
    );

    _approve(to, tokenId);
  }

  function purchasePixel(uint tokenId, Color memory userColor) external payable {
    require(msg.value >= calculatePixelPrice(tokenId) , "Value below price");
    require(checkPixelPurchasableTime(tokenId), "purchase too soon");
    require(tokenId <= maxTokens, "unknown Pixel");

    // mint (for the first time)
    if (purchaseOfTokenIdCounter[tokenId] == 0){
      require(tokenCounter.current() < maxTokens, "max minted");
      tokenCounter.increment();
      emit Purchased(address(0), msg.sender, msg.value);
      _mint(msg.sender, tokenId);
      approve(address(this), tokenId);
    } 
    // purchase (from another holder)
    else {
      address previousOwner = ownerOf(tokenId);
      emit Purchased(previousOwner, msg.sender, msg.value);
      _transfer(previousOwner, msg.sender, tokenId);
      approve(address(this), tokenId);
      (bool s,) = payable(previousOwner).call{value: msg.value}("");
      require(s, "tx failed");
    }
    // update storage mappings
    tokenIdsPixelColor[tokenId] = userColor;
    purchaseOfTokenIdCounter[tokenId] = purchaseOfTokenIdCounter[tokenId] + 1;
    lastPurchaseTimeOfTokenId[tokenId] = block.timestamp;
  }

  function checkPixelPurchasableTime(uint tokenId) public view returns(bool) {
    return lastPurchaseTimeOfTokenId[tokenId] + timeDelayAfterPurchase <= block.timestamp;
  }

  function calculatePixelPrice(uint tokenId) public view returns(uint){
    return (purchaseOfTokenIdCounter[tokenId] + 1) * tokenPrice;
  }

  function tokenURI(uint256 _tokenId) override public view returns (string memory) {
    string[7] memory parts;
    parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 1 1"><path stroke="rgb(';
    parts[1] = Strings.toString(tokenIdsPixelColor[_tokenId].r);
    parts[2] = ',';
    parts[3] = Strings.toString(tokenIdsPixelColor[_tokenId].g);
    parts[4] = ',';
    parts[5] = Strings.toString(tokenIdsPixelColor[_tokenId].b);
    parts[6] = ')" d="M0 0h1"></path></svg>';
    string memory output = string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6]));
    string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "PP #', Strings.toString(_tokenId),
        '", "description": "pixels place", "image": "data:image/svg+xml;base64,', Base64.encode(bytes(output)), '"}'))));
    output = string(abi.encodePacked('data:application/json;base64,', json));
    return output;
  }

  function totalSupply() public view returns (uint256) {
    return tokenCounter.current();
  }

  function withdrawBalance() external onlyOwner {
    (bool s,) = payable(msg.sender).call{value: address(this).balance}("");
    require(s, "tx failed");
  }

}
