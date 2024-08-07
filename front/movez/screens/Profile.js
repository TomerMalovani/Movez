import React,{useState,useEffect,useContext} from 'react';
import { View, StyleSheet,Image } from 'react-native';
import { TokenContext } from '../tokenContext';
import { ToastContext } from '../toastContext';
import { getAllVehicles } from '../utils/vehicle_api_calls';
import ProfileVehicleCard from '../components/profileVehicleCard';
import { Avatar, MD2Colors, Surface, Text,Button, ActivityIndicator, Provider } from 'react-native-paper';
import { getProfile, uploadPhoto, deleteProfilePhoto } from '../utils/user_api_calls';
import * as ImagePicker from 'expo-image-picker';
import MyModal from '../components/UploadPictureModal';

const ProfilePage = (props) => {
	const { navigation } = props;
	const { user, token } = useContext(TokenContext);
	const [profile, setProfile] = useState();
	const [loading, setLoading] = useState(false);
	const [image, setImage] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const { showError, showSuccess } = useContext(ToastContext)

	const getUser = async () => {
		try {
			setLoading(true);
			const profile = await getProfile(token);
			console.log("profile api", profile.email)
			console.log(profile);
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
		setModalVisible(true);
	};

	const hideModal = () => {
		setModalVisible(false);
	}

	const pickImageFromGallery = async () => {
		// Ask for permission to access media library 
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== 'granted') {
		  Alert.alert('Permission Denied', 'Permission to access media library is required.');
		  return;
		}
	
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		console.log(result);
		if (!result.canceled) {
			uploadSuccess = await uploadImage(result.assets[0].uri);
			uploadSuccess ? await setImage(result.assets[0].uri) : setImage(null);
		}
		setModalVisible(false);
	  };

	  const pickImageFromCamera = async () => {
		const { status } = await ImagePicker.requestCameraPermissionsAsync();
		if (status !== 'granted') {
		  Alert.alert('Permission Denied', 'Permission to access camera is required.');
		  return;
		}
		
		const result = await ImagePicker.launchCameraAsync({
		  mediaTypes: ImagePicker.MediaTypeOptions.Images,
		  allowsEditing: true,
		  quality: 1,
		});
	
		console.log(result);
		if (!result.canceled) {
		 uploadSuccess = await uploadImage(result.assets[0].uri);
		 uploadSuccess ? await setImage(result.assets[0].uri) : setImage(null);
		}
		setModalVisible(false);
	  };

	  const uploadImage = async (uri) => {
		let uploadSuccess = false;
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
			 buttonPictureLabel = 'Change Picture';
			 console.log(`PhotoUrl: ${res.user.PhotoUrl}`);
			 setProfile({ ...profile, PhotoUrl: res.user.PhotoUrl });
			 uploadSuccess = true;
			} catch (error) {
			  console.error('Error uploading photo: ', error);
			  SetImage(null);
			  SetModalVisible(false);
			  showError('Error uploading photo');
			}
			finally {
				return uploadSuccess;
			}
		};

		const removeImage = async () => {
			setModalVisible(false);
			setImage(null);
			console.log('Removing image:', profile.PhotoUrl);
			try {
			  await deleteProfilePhoto(token);
			  showSuccess('Photo removed successfully from the server');
			  // Log the profile before updating it to see its structure
			  console.log('Profile before update:', profile);
			  setProfile(prevProfile => {
				console.log('Updating profile:', { ...prevProfile, PhotoUrl: null });
				return { ...prevProfile, PhotoUrl: null };
			  });
			} catch (error) {
			  console.error('Error removing photo:', error);
			  showError('Error removing photo from the server');
			}
		  };
	
		 

	if (loading) {
		return <ActivityIndicator animating={true} color={MD2Colors.error50} size={50} style={{ marginTop: 50 }} />;
		}
		
	else if (profile) {
		let buttonPictureLabel;
		let photoUrlExist = false;
		if(profile.PhotoUrl === null || profile.PhotoUrl === '' || profile.PhotoUrl === undefined){
			buttonPictureLabel = 'Upload Picture';
		}
		else{
			buttonPictureLabel = 'Change Picture';
			photoUrlExist = true;
		}
		console.log(`PhotoUrl: ${profile.PhotoUrl}`);
		return (
		<Provider>
			<Surface elevation={0} style={styles.container}>
				{!image ? (
				!photoUrlExist ? (
						<Avatar.Text color={MD2Colors.error50} size={100} label={user.charAt(0)} />
				) : (
					<Avatar.Image size={100} source={{ uri: profile.PhotoUrl }} />
					//<Image  style={{ width: 100, height: 100, borderRadius: 10 }} source={{ uri: profile.PhotoUrl }} />
				)
				) : (
				<Avatar.Image size={100} source={{ uri: image }} />
				)}
				<Button style={styles.editBtn} mode='contained' onPress={handleUploadPhoto}>
				{buttonPictureLabel}
				</Button>
				<Text variant="headlineSmall">{user}</Text>
				<Text variant="titleMedium">{profile.email}</Text>
				{Object.keys(profile).map((key) => (
				<Text key={key} variant="bodyMedium">{`${key}: ${profile[key]}`}</Text>
				))}
				<Button style={styles.editBtn} mode='contained'>
					Edit user information
				</Button>
				<Surface style={styles.butttonsCon}>
					<Button onPress={() => navigation.navigate('My Vehicles')} icon="car" mode='text'>
						My Vehicles
					</Button>
				</Surface>
			</Surface>
			<MyModal
				visible={modalVisible}
				hideModal={hideModal}
				pickImageFromCamera={pickImageFromCamera}
				pickImageFromGallery={pickImageFromGallery}
				removeImage={removeImage}
			  />
		</Provider>
	);
}
}

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