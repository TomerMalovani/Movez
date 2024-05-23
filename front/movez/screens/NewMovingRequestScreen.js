import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AddMovingRequest from '../Components/AddMovingRequest';
import AddItemsForm from '../Components/AddItemsForm';
import { createNewMoveRequest } from '../utils/moveRequest_api_calls';
import { TokenContext } from '../tokenContext';

const NewMovingRequestScreen = () => {
    const [locationfrom, setLocationTo] = useState(undefined);
    const [locationto, setLocationFrom] = useState(undefined);
    const [items, setItems] = useState([])
    const [moveDate, setMoveDate] = useState(new Date());
    const {token} = useContext(TokenContext)

    const handleCreateNewRequest = async () => {
        console.log("Location From: ", locationfrom);
        console.log("Location To: ", locationto);
        console.log("Items: ", items);
        console.log("Move Date: ", moveDate);
        const body = {
            moveDate: moveDate,
            moveFromCoor: {type:"Point", coordinates: [locationfrom.coor.longitude,locationfrom.coor.latitude]},
            moveToCoor:{type:"Point", coordinates: [locationto.coor.longitude,locationto.coor.latitude]},
            fromAddress: locationfrom.address ,
            toAddress: locationto.address,
            items: items
        }
        try{
            const res = await createNewMoveRequest(token,body)
            if(res.status===201){
                console.log("res",res)

            }else {
                console.log(res)
                throw new Error(res.message)}
        }catch(err){
            console.log("Error: ",err) 
        }
    };



    const renderForm = () => {
        if(locationfrom === undefined && locationto === undefined){
            return <AddMovingRequest dateState={[moveDate, setMoveDate]}
             setLocationFrom={setLocationFrom} setLocationTo={setLocationTo}/>
        }
        else{
            return <AddItemsForm handleCreateNewRequest={handleCreateNewRequest} itemsState={[items, setItems] }/>

        }
    };
    
    return (
        <View>
            {renderForm()}
        </View>
    );
};

export default NewMovingRequestScreen;