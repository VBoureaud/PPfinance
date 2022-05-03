# PPFinance

ethAmsterdam

This project demonstrates our direct purchasable NFT Pixel Landscape, completely onchain with SVG art. 


# Dapp

[https://ppfinance.vercel.app/](https://ppfinance.vercel.app/)

## Links


[Rinkeby Smart Contract](https://rinkeby.etherscan.io/address/0x877ae605f9488e3cf4d220f20fefd1980772d156)

[testnet Opensea](https://testnets.opensea.io/collection/thepixel-jgsc699yse)


## What is it?

Interactive pixel canvas, based on Reddit's r/place and Million Dollar Homepage, powered by a new standard for a directly purchasable NFT. . Participants can mint a pixel NFT and change the color of the corresponding pixel on the canvas. Minted pixel NFTs may be traded on secondary markets, such as OpenSea (already support). Minted pixel NFTs may also be directly purchasable from the current holder. The direct purchase is mandatory as long as the price exceeds a floor. The floor price is a function of the last price paid for the pixel NFT, and will always be higher than the last price. This way the pixel NFT holder will be guaranteed compensation above their last paid price, in exchange for the forced sale of their NFT. This guarantees that no one user may hog all their NFTs (and part of the canvas). After each purchase, the NFT is protected from direct purchase for at least five minutes, to prevent immediate loss of NFT, wash trading, and potential MEV attacks. Having the five minute lockup time ensures that participants are limited to our target group and not arbitrageurs.

## How it's made?

Notable hacky bit: Although our NFTs are images (one pixel), they do not have to be stored on ipfs or require any additional storage. All pixel RBG data is stored onchain (EVMs for now). We can derive x and y coordinates on canvas grid using the token index, and we can render the pixel offchain from the RGB values stored on the smart contract. We set our pixel to be an <svg> onchain so anyone can render it independently. Sponsors: Ethereum & Optimism & Polygon helped us with testnets and resources (faucets, nodes, validators). Coinbase and WalletConnect helped us with APIs to connect user wallets to our front end. 