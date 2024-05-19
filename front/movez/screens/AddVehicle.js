import React, { useState } from 'react';
import { Text,TextInput,Button, View, StyleSheet } from 'react-native';

const AddVehicle = () => {

    const [vehicle, setVehicle] = useState({
        MoverID:'',
        VehicleType:'',
        Depth:'',
        Width:'', 
        Height:''
    });

    const inputs = [
        { name: 'VehicleType', type: 'text' , placeholder: 'Vehicle Type'},
        { name: 'Depth', type: 'text' , placeholder: 'Depth'},
        { name: 'Width', type: 'text' , placeholder: 'Width'},
        { name: 'Height', type: 'text' , placeholder: 'Height'}
        
    ]

    const handleChange = (e) => {
        setVehicle({ ...vehicle, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        // Add your logic here to handle the form submission
        console.log(vehicle);
    };

    return (
        <View >
            <Text>Add Vehicle</Text>
         <View>
                {inputs.map((input, index) => (
                    <TextInput
                        key={index}
                        style={styles.input}
                        placeholder={input.placeholder}
                        value={vehicle[input.name]}
                        onChangeText={handleChange}
                    />
                ))}
                <Button title="Add Vehicle" onPress={handleSubmit} />
</View>
            </View>          
    );

  
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
       
    },
    input: {
        width: '100vw',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        padding: 8,
    },
});
export default AddVehicle;