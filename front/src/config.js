const data = {
  "xNum": 100,
  "yNum": 100,
  "paddBox": 1,
  "sizeBox": 15,
  "apiColors": {
    //"url": "https://colorsnft.herokuapp.com/",
    "url": "https://ppfinance.herokuapp.com/",
  },
  "LOCAL": {
    "CHAIN_ID": 1337,
    "RPC": "http://127.0.0.1:8545",
    "NATIVE_DECIMAL": '18',
    "STABLE_DECIMAL": '6',
  },
  "PROD": {
    "CHAIN_ID": 4,
    "RPC": "https://rinkeby.infura.io/v3/ebc3a388e39840dc8313350226433c1e",
    "NATIVE_DECIMAL": '18',
    "STABLE_DECIMAL": '6',
  },
}

export default data