import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import AddMovingRequest from '../components/AddMovingRequest';
import AddItemsForm from '../components/AddItemsForm';
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
        let numOfPhotos = 0;
        try {
            const formData = new FormData();
            items.forEach(item => {
                if (item.Photo) {
                    formData.append('photos', {
                        uri: item.Photo,
                        type: 'image/jpeg',
                        name: `photo${numOfPhotos}.jpg`,
                    });
                    numOfPhotos++;
                }
            })
            const updatedItems = items.map(item => {
                return {
                    ItemDescription: item.ItemDescription,
                    Height: item.Height,
                    Width: item.Width,
                    Depth: item.Depth,
                    Weight: item.Weight,
                    Quantity: item.Quantity,
                    SpecialInstructions: item.SpecialInstructions,
                };
            });
            
            const body = {
                moveStatus: "Pending",
                moveDate: moveDate,
                moveTime: moveDate,
                moveFromCoor: {type:"Point", coordinates: [locationfrom.coor.longitude,locationfrom.coor.latitude]},
                moveToCoor:{type:"Point", coordinates: [locationto.coor.longitude,locationto.coor.latitude]},
                fromAddress: locationfrom.address ,
                toAddress: locationto.address,
                items: updatedItems
            }
            
            if(numOfPhotos > 0){
                formData.append('moveStatus', "Pending");
                formData.append('moveDate', moveDate.toDateString());
                formData.append('moveTime', moveDate.toDateString());
                formData.append('moveFromCoor', JSON.stringify(body.moveFromCoor));
                formData.append('moveToCoor', JSON.stringify(body.moveToCoor));
                formData.append('fromAddress', body.fromAddress);
                formData.append('toAddress', body.toAddress);
                formData.append('items', JSON.stringify(body.items));
                console.log('FormData entries:');
                formData.getParts().forEach(part => {
                    console.log(part.fieldName, part || part.uri);
                });
                await createNewMoveRequest(token, formData, numOfPhotos);
        }
        else{
            await createNewMoveRequest(token, body, numOfPhotos);
        }
			showSuccess("Request created successfully")
			setLocationTo(undefined);
			setLocationFrom(undefined);
			setItems([]);
			navigation.navigate('Moves Requested')
          
        }catch(err){
            console.log("Error: ",err) 
			showError(err.toString())
        }
    };

//formData.append('moveDate', moveDate);
           // formData.append('moveFromCoor', { type: "Point", coordinates: [locationfrom.coor.longitude, locationfrom.coor.latitude] });
            //formData.append('moveToCoor', { type: "Point", coordinates: [locationto.coor.longitude, locationto.coor.latitude] });
            //formData.append('fromAddress', locationfrom.address);
            //formData.append('toAddress', locationto.address);
            //formData.append('items', updatedItems);

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