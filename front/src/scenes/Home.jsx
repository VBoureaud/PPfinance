import { Button, Typography, message } from "antd";
import React, { useContext, useEffect, useState } from "react";
import Web3Context from "../store/web3Context";
import Web2Context from "../store/web2Context";
import SvgMap from "../components/SvgMap";
import NftView from "../components/NftView";
import { coordToTokenId } from "../utils";
import config from "../config.js";

export default function Home(props) {
  const [visible, setVisible] = useState(false);
  const [tokenId, setTokenId] = useState(null);

  const {
      initWeb3Modal,
      loading,
      loadingBuy,
      loadingPrice,
      loadingCount,
      nftPrice,
      nftCount,
      countLifePixel,
      getPixelPrice,
      purchasePixel,
      openSeaLink,
  } = useContext(Web3Context);

  const {
      loadingColors,
      nftTokens,
      getTokens,
  } = useContext(Web2Context);

  // Get Colors Pixels
  useEffect(() => {
    if (!nftTokens) {
      getTokens();
    }
  }, [])

  const handleClickPixel = (coord) => {
    const tkId = coordToTokenId(coord.x, coord.y, config.xNum);
    setTokenId(tkId);
    getPixelPrice(tkId);
    countLifePixel(tkId);
    setVisible(true);
  }

  const successBuy = async (success) => {
    if (success)
      message.success('You successfully get this token.');
    else
      message.error('A error happened. Do you have enough in your balance ?');
    setVisible(false);

    // update grid
    getTokens();
  }

  const confirmBuy = (color) => {
    purchasePixel(tokenId, color, successBuy);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: '70vh',
      }}
    >
      {props.isLogged && visible && 
        <NftView 
          tokenId={tokenId}
          loading={loadingBuy}
          visible={visible}
          setVisible={setVisible}
          confirmBuy={confirmBuy}
          nftPrice={nftPrice}
          loadingPrice={loadingPrice}
          nftCount={nftCount}
          loadingCount={loadingCount}
          openSeaLink={openSeaLink}
        />}

      {!loading && props.isLogged && (
        <>
          <SvgMap
            width={window.innerWidth}
            height={window.innerHeight - 50}
            sizeBox={config.sizeBox}
            paddBox={config.paddBox}
            xNum={config.xNum}
            yNum={config.yNum}
            onClick={handleClickPixel}
            reload={getTokens}
            loading={loadingColors}
            nftTokens={nftTokens}
          />
        </>
      )}
      {!loading && !props.isLogged && (
        <>
          <Typography.Title variant="h1" style={{ textAlign: 'center', marginTop: '50px' }}>Welcome to PPfinance</Typography.Title>
          <Button type="primary" style={{ margin: '10px auto', maxWidth: '180px' }} onClick={initWeb3Modal}>Connect your Wallet</Button>
          <p style={{ maxWidth: '1064px', margin: '15px auto', padding: '15px' }}>Interactive canvas, based on Reddit's r/place and Million Dollar Homepage, powered by a new standard for a directly purchasable NFT. . Participants can mint a pixel NFT and change the color of the corresponding pixel on the canvas. Minted pixel NFTs may be traded on secondary markets, such as OpenSea (already support). Minted pixel NFTs may also be directly purchasable from the current holder. The direct purchase is mandatory as long as the price exceeds a floor. The floor price is a function of the last price paid for the pixel NFT, and will always be higher than the last price. This way the pixel NFT holder will be guaranteed compensation above their last paid price, in exchange for the forced sale of their NFT. This guarantees that no one user may hog all their NFTs (and part of the canvas). After each purchase, the NFT is protected from direct purchase for at least five minutes, to prevent immediate loss of NFT, wash trading, and potential MEV attacks. Having the five minute lockup time ensures that participants are limited to our target group and not arbitrageurs.</p>
        </>
      )}
      
      {loading && (
        <Button type="primary" style={{ margin: 'auto' }} loading>
          Loading
        </Button>
      )}
    </div>
  );
}
