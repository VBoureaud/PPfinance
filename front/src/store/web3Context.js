import React, {useEffect, useState} from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnect from "@walletconnect/web3-provider";

import config from "../config.js";

//import InvestmentFactoryArtifact from "../contracts/InvestmentFactory.json";
//import InvestmentFactoryAddress from "../contracts/InvestmentFactory_address.json";

const dataTest = {};

const Web3Context = React.createContext({
    web3: null,
    signer: null,
    account: null,
    loading: false,

    initWeb3Modal: () => {},
});

export const Web3ContextProvider = (props) => {
    const [web3, setWeb3] = useState(null);
    const [signer, setSigner] = useState(null);
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(false);

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
        /*const investmentFactory = new ethers.Contract(
            InvestmentFactoryAddress.Contract,
            InvestmentFactoryArtifact.abi,
            signer);
        setFactoryContract(investmentFactory);*/
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
                        infuraId: process.env.INFURA_KEY
                    }
                },
                walletconnect: {
                    package: WalletConnect,
                    options: {
                        infuraId: process.env.INFURA_KEY
                    }
                }
            };

            const web3Modal = new Web3Modal({
                cacheProvider: false, // optional
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


    return (
        <Web3Context.Provider
            value={{
                web3,
                signer,
                loading,
                initWeb3Modal,
                account,
            }}>
            {props.children}
        </Web3Context.Provider>
    )
}

export default Web3Context;