import React,{useState,useEffect,useContext} from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';
import { TokenContext } from '../tokenContext';
import { getAllVehicles } from '../utils/vehicle_api_calls';
import ProfileVehicleCard from '../Components/profileVehicleCard';
import {Avatar,MD2Colors} from 'react-native-paper';
const ProfilePage = (props) => {
	const [vehicles, setVehicles] = useState([]);
	const { user, token } = useContext(TokenContext);

	const getVehicles = async () => {
		try {
			const data = await getAllVehicles(token);
			setVehicles(data.vehicles);
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		console.log("Profile Page",token)
		getVehicles()
	}, []);	

    return (
        <View style={styles.container}>
       
         
			<Avatar.Text color={MD2Colors.error50} size={50} label={user} />

            {/* Add your profile content here */}
			<View style={styles.carsContianer}>
			<ProfileVehicleCard vehicles={vehicles} {...props}/>
		</View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
		marginTop: 10,
        alignItems: 'center',
    },
	carsContianer:{
		marginTop: 100,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		flexWrap: 'wrap',
	}
});

export default ProfilePage;