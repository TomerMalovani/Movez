import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AddMovingRequest from '../Components/AddMovingRequest';
import AddItemsForm from '../Components/AddItemsForm';
const NewMovingRequestScreen = () => {
    const [location, setLocation] = useState(undefined);
    



    const renderForm = () => {
        if(location === undefined){
            return <AddMovingRequest setLocation={setLocation}/>
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