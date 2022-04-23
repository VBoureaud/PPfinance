import { Button, Typography } from "antd";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
//import logo from "../assets/logo.png";
import Web3Context from "../store/web3Context";
import SvgMap from "../components/SvgMap";
import NftView from "../components/NftView";
import { coordToTokenId } from "../utils";
import config from "../config.js";

const { Title } = Typography;

export default function Home(props) {
  const [visible, setVisible] = useState(false);
  const [tokenId, setTokenId] = useState(null);
  
  const {
      initWeb3Modal,
      loading,
      loadingBuy,
      purchasePixel,
  } = useContext(Web3Context);

  const handleClickNft = (coord) => {
    setTokenId(coordToTokenId(coord.x, coord.y, config.xLine));
    setVisible(true);
  }

  const confirmBuy = (color) => {
    purchasePixel(tokenId, color);
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
        />}

      {!loading && props.isLogged && (
        <>
          <SvgMap
            width={window.innerWidth}
            height={window.innerHeight}
            onClick={handleClickNft}
          />
        </>
      )}
      {!loading && !props.isLogged && (
        <>
          <Typography.Title variant="h1" style={{ textAlign: 'center', marginTop: '50px' }}>Welcome to PPfinance</Typography.Title>
          <Button type="primary" style={{ margin: '10px auto', maxWidth: '180px' }} onClick={initWeb3Modal}>Connect your Wallet</Button>
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
