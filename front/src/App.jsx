import React, {useContext} from 'react';
//import './App.css';
import Web3Context from "./store/web3Context";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

import "antd/dist/antd.css";
import { Layout, Typography } from "antd";
//import logo from "./assets/favicon-80x80.png";

import MenuItems from "./components/MenuItems";
import Home from "./scenes/Home";

const { Header, Footer } = Layout;
const { Text, Title } = Typography;

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
    marginTop: "130px",
    padding: "10px",
  },
  header: {
    position: "fixed",
    zIndex: 1,
    width: "100%",
    background: "#fff",
    borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
  },
  headerContainer: {
    maxWidth: '1056px',
    margin: 'auto',
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
  },
  headerSub: {
    background: "#eee",
    lineHeight: '39px',
    textAlign: 'center',
    height: '40px'
  }
};

function App() {
  const {
    web3,
    signer,
    account,
  } = useContext(Web3Context);
  const isLogged = (web3 && signer);

  return (
    <Layout style={{ height: "100vh", overflow: "auto" }}>
      <Router>
        <Header style={styles.header}>
          <div style={styles.headerContainer}>
            <Link to="/" style={{ display: "flex", alignItems: "center" }}>
              {/*<img src={logo} alt="logo" width="60" height="60" />*/}
              <Title level={5}>PPfinance</Title>
            </Link>
            <MenuItems isLogged={isLogged} />
          </div>
          <div style={styles.headerSub}>
            {account && <p>
              {account.network.name} - {account.network.chainId}
            </p>}
          </div>
        </Header>

        <div style={styles.content}>
          <Switch>
            <Route exact path="/">
              <Home isLogged={isLogged} />
            </Route>
            <Route path="/nonauthenticated">
              <>Please login using the "Authenticate" button</>
            </Route>
          </Switch>
        </div>
      </Router>
      <Footer style={{ textAlign: "center" }}>
        <Text style={{ display: "block" }}>Built at ETHAmsterdam 2022</Text>
      </Footer>
    </Layout>
  );
}

export default App;
