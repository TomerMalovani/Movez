import React,{useState,useEffect,useContext} from 'react';
import { View, StyleSheet,Image } from 'react-native';
import { TokenContext } from '../tokenContext';
import { ToastContext } from '../toastContext';
import { getAllVehicles } from '../utils/vehicle_api_calls';
import ProfileVehicleCard from '../Components/profileVehicleCard';
import { Avatar, MD2Colors, Surface, Text,Button, ActivityIndicator } from 'react-native-paper';
import { getProfile, uploadPhoto } from '../utils/user_api_calls';
import * as ImagePicker from 'expo-image-picker';

const ProfilePage = (props) => {
	const { navigation } = props;
	const { user, token } = useContext(TokenContext);
	const [profile, setProfile] = useState();
	const [loading, setLoading] = useState(false);
	let buttonPictureLabel = '';
	const { showError, showSuccess } = useContext(ToastContext)

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

	const handleUploadPhoto = async () => {
		// Ask for permission to access media library
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== 'granted') {
		  Alert.alert('Permission Denied', 'Permission to access media library is required.');
		  return;
		}
	
		const result = await ImagePicker.launchImageLibraryAsync({
		  mediaTypes: ImagePicker.MediaTypeOptions.Images,
		  allowsEditing: true,
		  quality: 1,
		});
	
		if (!result.cancelled) {
		  setImage(result.uri);
		  uploadImage(result.uri);
		}
	  };

	  const uploadImage = async (uri) => {
			const formData = new FormData();
		formData.append('photo', {
		uri,
		type: 'image/jpeg',
		name: 'photo.jpg',
		});
			try {
			  const res = await uploadPhoto(token, formData);
			  console.log('Photo uploaded successfully: ', res);
			  // Handle the response from the server
			 showSuccess('Photo uploaded successfully');
			} catch (error) {
			  console.error('Error uploading photo: ', error);
			  showError('Error uploading photo');
			}
		  
		};
	  


	if(loading) return <ActivityIndicator animating={true} color={MD2Colors.error50} size={50} style={{marginTop: 50}} />

	else if (profile) return (
		buttonPictureLabel = !profile.PhotoUrl || profile.PhotoUrl === '' ? 'Upload Picture' : 'Change Picture',
		<Surface elevation={0} style={styles.container}>
			{
				!profile.PhotoUrl || profile.PhotoUrl === '' ? <Avatar.Text color={MD2Colors.error50} size={100} label={user} /> : 
				<Avatar.Image size={100} source={{ uri: profile.PhotoUrl }} />
			}
			<Button style={styles.editBtn} mode='contained' onPress={handleUploadPhoto} >{buttonPictureLabel}</Button>
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