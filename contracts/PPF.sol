// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PPF is ERC721, Ownable {
    using Counters for Counters.Counter;

    uint public constant maxTokens;
    uint public constant tokenPrice;
    uint public constant timeDelayAfterPurchase;

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
    // TODO mint specific tokenID to allow coordinate selection
    // TODO multiply price by purchase counter
    // TODO update the mapping values

    function purchasePixel(uint tokenId, Color userColor) external payable {
        require(ownerOf[tokenId] == address(0), "Id already minted");
        require(msg.value == calculatePixelPrice(tokenId) , "Value below price");
        require(lastPurchaseTimeOfTokenId[tokenId] + timeDelayAfterPurchase <= block.timestamp, "purchase too soon");

        tokenIdsPixelColor[tokenId] = userColor;
        purchaseOfTokenIdCounter = purchaseOfTokenIdCounter + 1;
        lastPurchaseTimeOfTokenId = block.timestamp;

        if (purchaseOfTokenIdCounter == 0){
            tokenCounter.increment();
        }

        _mint(sender, tokenId);
    }

    function calculatePixelPrice(uint tokenId) public view returns(uint){
        return purchaseOfTokenIdCounter[tokenId] * tokenPrice;
    }

    function mint() private tokensAvailable {
        require(totalSupply() < maxTokens, "Soldout");
        address sender = _msgSender();
        uint256 tokenId = totalSupply() + 1;
        _mint(sender, tokenId);
        tokenCounter.increment();
    }

    // TODO implement SVG color part
    function tokenURI(uint256 _tokenID) override public view returns (string memory) {
        return "SVG";
    }

    function totalSupply() public view returns (uint256) {
        return tokenCounter.current();
    }
}