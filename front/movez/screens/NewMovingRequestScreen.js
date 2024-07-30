import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import AddMovingRequest from '../Components/AddMovingRequest';
import AddItemsForm from '../Components/AddItemsForm';
import { createNewMoveRequest } from '../utils/moveRequest_api_calls';
import { TokenContext } from '../tokenContext';
import { ToastContext } from '../toastContext';

const NewMovingRequestScreen = ({ navigation }) => {
    const [locationfrom, setLocationTo] = useState(undefined);
    const [locationto, setLocationFrom] = useState(undefined);
    const [items, setItems] = useState([])
    const [moveDate, setMoveDate] = useState(new Date());
    const {token} = useContext(TokenContext)
	const { showError, showSuccess } = useContext(ToastContext)

    const handleCreateNewRequest = async () => {
        let formData;
        try{
            items.forEach(item => {
                console.log(item)
                console.log(item.Photo)
                formData = new FormData();
                formData.append('photo', {
                    uri: item.Photo,
                    type: 'image/jpeg',
                    name: 'photo.jpg',
                });
                item.Photo = formData;
                console.log("photo: ", item.Photo)
            })
            const body = {
                moveDate: moveDate,
                moveFromCoor: {type:"Point", coordinates: [locationfrom.coor.longitude,locationfrom.coor.latitude]},
                moveToCoor:{type:"Point", coordinates: [locationto.coor.longitude,locationto.coor.latitude]},
                fromAddress: locationfrom.address ,
                toAddress: locationto.address,
                items: items
            }
       
            await createNewMoveRequest(token,body)
			showSuccess("Request created successfully")
			navigation.navigate('MovesRequested')
          
        }catch(err){
            console.log("Error: ",err) 
			showError(err.toString())
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