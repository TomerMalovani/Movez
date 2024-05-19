import React, { createContext, useState } from 'react';
import {_retrieveToken,_storeToken} from './utils/token_service';
// Create the context
const TokenContext = createContext();

// Create the provider component
const TokenProvider = ({ children }) => {
    const [token, setToken] = useState(_retrieveToken);
    const [user, setUser] = useState(null);

    // Function to update the token
    const updateToken = async (newToken) => {
        try{
            await _storeToken(newToken);
            setToken(newToken);
        }
        catch(e){
            console.log(e)
        }
   
       
    };

    return (
        <TokenContext.Provider value={{ token, updateToken,user,setUser }}>
            {children}
        </TokenContext.Provider>
    );
};

export { TokenContext, TokenProvider };