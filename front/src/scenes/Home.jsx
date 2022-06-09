import { Button, message } from "antd";
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
    if (props.isLogged) {
      const tkId = coordToTokenId(coord.x, coord.y, config.xNum);
      setTokenId(tkId);
      getPixelPrice(tkId);
      countLifePixel(tkId);
      setVisible(true);
    } else {
      message.warn('You need to be connected to continue.');
    }
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

      {!loading && (
        <>
          <SvgMap
            width={window.innerWidth}
            height={window.innerHeight - 200}
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
      
      {loading && (
        <Button type="primary" style={{ margin: 'auto' }} loading>
          Loading
        </Button>
      )}
    </div>
  );
}
