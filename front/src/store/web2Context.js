import React, {useState} from "react";

import config from "../config.js";

const Web2Context = React.createContext({
    loadingColors: false,
    //errorColors: false,
    nftTokens: null,

    getTokens: () => {},
});

export const Web2ContextProvider = (props) => {
    const [loadingColors, setLoadingColors] = useState(false);
    //const [errorColors, setErrorColors] = useState(false);
    const [nftTokens, setNftTokens] = useState(null);

	const getTokens = async () => {
		setLoadingColors(true);
		let response = await fetch(
			config.apiColors.url,
			{
				mode: 'cors',
				credentials: 'same-origin',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
			},
		);
		const data = await response.text();
    	const jsonData = JSON.parse(data);
    	if (jsonData.pixels)
    		setNftTokens(jsonData.pixels);
		setLoadingColors(false);
    }

    return (
        <Web2Context.Provider
            value={{
                loadingColors,
                //errorColors,
                nftTokens,
                getTokens,
            }}>
            {props.children}
        </Web2Context.Provider>
    )
}

export default Web2Context;