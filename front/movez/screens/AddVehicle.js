import React, { useContext, useState } from 'react';
import { Text, TextInput, Button, Icon, MD3Colors } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { createVehicle } from '../utils/vehicle_api_calls';
import { TokenContext } from '../tokenContext';
const AddVehicle = () => {
	const {token} = useContext(TokenContext)


    const [vehicle, setVehicle] = useState({
        VehicleType:'',
        Depth:'',
        Width:'', 
        Height:''
    });

    const inputs = [
        { name: 'VehicleType', type: 'text' , placeholder: 'Vehicle Type'},
        { name: 'Depth', type: 'number' , placeholder: 'Depth'},
		{ name: 'Width', type: 'number' , placeholder: 'Width'},
		{ name: 'Height', type: 'number' , placeholder: 'Height'}
        
    ]

    const handleChange = (e,input) => {
		setVehicle(prev => ({ ...prev, [`${input.name}`]: e }));
    };

    const handleSubmit = async (e) => {
		try{
			// Add your logic here to handle the form submission
			console.log(vehicle, token);
			const res = await createVehicle(token, vehicle)
			if(res.status !== 201)
				throw new Error(res.message)
			console.log(res)
		}catch(err){
			console.log(err)
		}
  
    };

    return (
        <View >
			
			<Text variant="displayLarge">Add vehicle</Text>
			<Icon name="car-estate" size={100} color={MD3Colors.error50} />
         <View>
                {inputs.map((input, index) => (
                    <TextInput
						mode="outlined"
                        key={index}
                        // style={styles.input}
                        placeholder={input.placeholder}
                        value={vehicle[input.name]}
						onChangeText={(e) => handleChange(e, input)}
                    />
                ))}
				<Button mode='outlined' onPress={handleSubmit} >Add Vehicle</Button>
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