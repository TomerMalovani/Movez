import React, { useContext, useState } from 'react';
import { Text, TextInput, Button, Icon, MD3Colors } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { createVehicle } from '../utils/vehicle_api_calls';
import { TokenContext } from '../tokenContext';
const AddVehicle = ({ handleAddVehicle }) => {
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
			const newCar = await createVehicle(token, vehicle)
			console.log("create car response", newCar)

			handleAddVehicle(newCar)
		

		}catch(err){
			console.log(err)
		}
  
    };

    return (
        <View >
			
			<Text style={{textAlign:"center",marginBottom:10}} variant="headlineMedium">Add vehicle</Text>
			<Icon name="car-estate" size={100} color={MD3Colors.error50} />
         <View>
                {inputs.map((input, index) => (
                    <TextInput
						mode="outlined"
                        key={index}
                        style={styles.input}
                        label={input.placeholder}
                        value={vehicle[input.name]}
						onChangeText={(e) => handleChange(e, input)}
                    />
                ))}
				<Button style={styles.btn} mode='contained' onPress={handleSubmit} >Add Vehicle</Button>
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
   
        height: 40,
   
        marginBottom: 20,
        // padding: 8,
    },
	btn:{
		marginTop: 20
	}
});
export default AddVehicle;