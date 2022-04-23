import { Button, Typography } from "antd";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
//import logo from "../assets/logo.png";
import Web3Context from "../store/web3Context";
import SvgMap from "../components/SvgMap";
import NftView from "../components/NftView";

const { Title } = Typography;

export default function Home(props) {
  const [visible, setVisible] = useState(false);
  const [nft, setNft] = useState(null);
  
  const {
      initWeb3Modal,
      loading,
  } = useContext(Web3Context);

  const handleClickNft = (nftId) => {
    console.log({ clickNft: nftId });
    setNft(nftId);
    setVisible(true);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      {visible && 
        <NftView 
          title={nft}
          visible={visible}
          setVisible={setVisible}
        />}

      {!loading && props.isLogged && (
        <div>
          <div>
            <SvgMap />
          </div>
            <Title level={4} style={{ textAlign: 'center', marginTop: '15px' }}>You are connected</Title>
        </div>
      )}
      {/*!loading && !props.isLogged && (
        <Button type="primary" style={{ margin: 'auto' }} onClick={initWeb3Modal}>Connect your Wallet</Button>
      )*/}
      {!loading && !props.isLogged && (
        <SvgMap
          width={window.innerWidth}
          height={window.innerHeight}
          onClick={handleClickNft}
        />
      )}
      
      {loading && (
        <Button type="primary" style={{ margin: 'auto' }} loading>
          Loading
        </Button>
      )}
    </div>
  );
}
