import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
import App from './App';
import {Web3ContextProvider} from "./store/web3Context";

ReactDOM.render(
  <div>
    <Web3ContextProvider>
      <App />
    </Web3ContextProvider>
  </div>,
  document.getElementById('root')
);
