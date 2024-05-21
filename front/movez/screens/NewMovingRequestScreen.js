import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AddMovingRequest from '../Components/AddMovingRequest';
import AddItemsForm from '../Components/AddItemsForm';

const NewMovingRequestScreen = () => {
    const [locationfrom, setLocationTo] = useState(undefined);
    const [locationto, setLocationFrom] = useState(undefined);



    const renderForm = () => {
        if(locationfrom === undefined && locationto === undefined){
            return <AddMovingRequest 
             setLocationFrom={setLocationFrom} setLocationTo={setLocationTo}/>
        }
        else{
            return <AddItemsForm/>
        
        }
    };
    
    return (
        <View>
            {renderForm()}
        </View>
    );
};

export default NewMovingRequestScreen;