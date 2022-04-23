import React, {useEffect, useState} from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnect from "@walletconnect/web3-provider";

import config from "../config.js";

import NftContractArtifact from "../contracts/NftContract.json";
import NftContractAddress from "../contracts/NftContract_address.json";

const Web3Context = React.createContext({
    web3: null,
    signer: null,
    account: null,
    loading: false,
    loadingBuy: false,

    initWeb3Modal: () => {},
    purchasePixel: () => {},
});

export const Web3ContextProvider = (props) => {
    const [web3, setWeb3] = useState(null);
    const [signer, setSigner] = useState(null);
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingBuy, setLoadingBuy] = useState(false);
    const [nftContract, setNftContract] = useState(null);

/*    useEffect(() => {
        const initData = async () => {
            //const count = await factoryContract.sizeInvestment();
        }
        signer && initData();

    }, [factoryContract])*/

    useEffect(() => {
        const initUrlWeb3 = async () => {
            console.log('initUrlWeb3');
            setLoading(true)
            try {
                const provider = new ethers.providers.JsonRpcProvider(config.PROD.RPC);
                setWeb3(provider);
                console.log("No web3 instance injected, using Local web3.");
                initContracts(provider);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false)
            }
        }

        !web3 && initUrlWeb3()
    }, [web3]);

    useEffect(() => {
        if (window.ethereum) {
           window.ethereum.on('accountsChanged', accounts => window.location.reload())
           window.ethereum.on('chainChanged', () => window.location.reload())
           window.ethereum.on('connect', (connectInfo) => { console.log({connectInfo}); })
        }
    }, [])

    const initContracts = (provider) => {
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(
            NftContractAddress.Contract,
            NftContractArtifact.abi,
            signer);
        setNftContract(nftContract);
    }

    const initWeb3Modal = async () => {
        console.log('initWeb3Modal');
        try {
            setLoading(true)
            const providerOptions = {
                walletlink: {
                    package: CoinbaseWalletSDK,
                    options: {
                        appName: "PPfinance",
                        //infuraId: process.env.INFURA_KEY
                    }
                },
                walletconnect: {
                    package: WalletConnect,
                    options: {
                        //infuraId: process.env.INFURA_KEY
                    }
                }
            };

            const web3Modal = new Web3Modal({
                cacheProvider: true, // optional
                providerOptions // required
            });

            const instance = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(instance);
            const network = await provider.getNetwork();
            const signer = provider.getSigner();
            const balance = await signer.getBalance();
            const address = await signer.getAddress();
            const txCount = await signer.getTransactionCount();
            const newAcc = {
                balance: ethers.utils.formatEther(balance._hex),
                address,
                txCount,
                network,
            };
            console.log(newAcc);
            setWeb3(provider);
            setSigner(signer);
            setAccount(newAcc);
            initContracts(provider);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false)
        }
    }

    // tokenId: number
    // color: arrayOf(number) ex: [ 12, 23, 56 ]
    const purchasePixel = async (tokenId, color) => {
        //5*10 + 5
        //y * maxX + x
        setLoadingBuy(true);
        const pixelPrice = await nftContract.calculatePixelPrice(tokenId);
        console.log({ pixelPrice });
        const possiblePurchasable = await nftContract.checkPixelPurchasableTime(tokenId);
        console.log({ possiblePurchasable });
        const tx = await nftContract.purchasePixel(tokenId, color, { value: pixelPrice });
        wait(tx).then(function(receipt) {
          // do whatever you wanna do with `receipt`
          console.log({ tx });
          setLoadingBuy(false);
        });
        
    }


    return (
        <Web3Context.Provider
            value={{
                web3,
                signer,
                loading,
                loadingBuy,
                initWeb3Modal,
                purchasePixel,
                account,
            }}>
            {props.children}
        </Web3Context.Provider>
    )
}

export default Web3Context;