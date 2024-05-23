import React, { createContext, useState ,useEffect} from 'react';
import {_removeToken, _retrieveStorage,_storeStorage} from './utils/token_service';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
const TokenContext = createContext();

const TokenProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const retrievingToken = async () => {
        try{
            setLoading(true)
            let userToken = await _retrieveStorage("token");
            userToken = JSON.parse( userToken );
            console.log("async storge token data: ",userToken)
            if(userToken){
            setToken(userToken.token)
            setUser(userToken.username)
            
            }
            setLoading(false)
        }
        catch(e){
            console.log(e)
            setLoading(false)
        }
    }

    useEffect(() => {
        if(!token)
        retrievingToken();
    }
    ,[]);


    

    // Function to update the token
    const updateToken = async (newToken) => {
        try{
            if(newToken.token && newToken.username) 
            await _storeStorage(JSON.stringify( newToken ) ,"token");
         

            setToken(newToken.token);
            setUser(newToken.username)
        }
        catch(e){
            console.log(e)
        }
   
       
    };

    const removeToken = async () => {
        try{
            await _removeToken("token");
            setToken(undefined)
            setUser(undefined)
        }
        catch(e){
            console.log(e)


        }
    }

    if(loading){
        return <ActivityIndicator animating={true} color={MD2Colors.red500} />
    }

    else return (
        <TokenContext.Provider value={{ token, removeToken,updateToken,user,setUser }}>
            {children}
        </TokenContext.Provider>
    );
};

export { TokenContext, TokenProvider };