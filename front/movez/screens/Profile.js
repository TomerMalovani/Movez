import React,{useState,useEffect,useContext} from 'react';
import { View, StyleSheet,Image } from 'react-native';
import { TokenContext } from '../tokenContext';
import { getAllVehicles } from '../utils/vehicle_api_calls';
import ProfileVehicleCard from '../Components/profileVehicleCard';
import { Avatar, MD2Colors, Surface, Text,Button, ActivityIndicator } from 'react-native-paper';
import { getProfile } from '../utils/user_api_calls';
const ProfilePage = (props) => {
	const { navigation } = props;
	const { user, token } = useContext(TokenContext);
	const [profile, setProfile] = useState();
	const [loading, setLoading] = useState(false);


	const getUser = async () => {
		try {
			setLoading(true);
			const profile = await getProfile(token);
			console.log("profile api", profile.email)
			setProfile(profile);
			
			setLoading(false);

		} catch (error) {
			setLoading(false);
			console.log(error);
		}
	}

	useEffect(() => {
		getUser()
	}, []);	

	if(loading) return <ActivityIndicator animating={true} color={MD2Colors.error50} size={50} style={{marginTop: 50}} />

	else if (profile) return (
		<Surface elevation={0} style={styles.container}>
       
         
			<Avatar.Text color={MD2Colors.error50} size={100} label={user} />
			<Text variant="headlineSmall">{user}</Text>
			<Text variant="titleMedium">{profile.email}</Text>
			<Button style={styles.editBtn} mode='contained' >Edit user</Button>

			

            {/* Add your profile content here */}
			<Surface style={styles.butttonsCon}>
				<Button onPress={() => navigation.navigate('My Vehicles')} icon="car" mode='text' >my vehicles</Button>
			</Surface>

		</Surface>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
		// borderWidth: 1,
		
		// padding: 20,
		marginTop: 10,
        alignItems: 'center',
    },
	butttonsCon:{
		marginTop: 50,
		width: "80%",
		// display: 'flex',
		// flexDirection: 'row',
		// justifyContent: 'center',
		// alignItems: 'center',
		// flexWrap: 'wrap',
	},
	editBtn:{
		marginTop: 20,
		padding: 10,
		// width: "50%",
	},
});

export default ProfilePage;