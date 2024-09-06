import React,{useState,useEffect,useContext, useRef} from 'react';
import { View, StyleSheet, TextInput, Alert} from 'react-native';
import { TokenContext } from '../tokenContext';
import { ToastContext } from '../toastContext';
import { getAllVehicles } from '../utils/vehicle_api_calls';
import ProfileVehicleCard from '../components/profileVehicleCard';
import { Avatar, MD2Colors, Surface, Text,Button, ActivityIndicator, Provider, Portal, Modal } from 'react-native-paper';
import { getProfile, uploadPhoto, deleteProfilePhoto, updateProfile, getProfileByID} from '../utils/user_api_calls';
import * as ImagePicker from 'expo-image-picker';
import MyModal from '../components/UploadPictureModal';

const ProfilePage = (props) => {
	const { navigation, route } = props;
	const { userId } = route.params;
	const { user, token, myUuid } = useContext(TokenContext);
	const [isItMine, setIsItMine] = useState(myUuid === userId);
	const [profile, setProfile] = useState();
	const [loading, setLoading] = useState(false);
	const [image, setImage] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const { showError, showSuccess } = useContext(ToastContext)
	const [editModalVisible, setEditModalVisible] = useState(false);

	const firstNameRef = useRef('');
	const lastNameRef = useRef('');
	const phoneNumberRef = useRef('');
	const emailRef = useRef('');

	const getUser = async () => {
		try {
			setLoading(true);
			const profile = await getProfileByID(token, userId);
			console.log("profile api", profile.email)
			console.log(profile);
			setProfile(profile);
			setLoading(false);
			firstNameRef.current = profile.firstName || '';
			lastNameRef.current = profile.lastName || '';
			phoneNumberRef.current = profile.phoneNumber || '';
			emailRef.current = profile.email || '';
		} catch (error) {
			setLoading(false);
			console.log(error);
		}
	}

	useEffect(() => {
		getUser();
		setIsItMine(myUuid === userId);
	}, [userId]);
	
	const handleUploadPhoto = async () => {
		setModalVisible(true);
	};

	const hideModal = () => {
		setModalVisible(false);
	}

	const handleEditProfile = () => {
		setEditModalVisible(true);
	  };
	
	  const handleSaveProfile = async () => {
		try {
		  const updatedProfile = {
			firstName: firstNameRef.current || profile.firstName,
			lastName: lastNameRef.current || profile.lastName,
			phoneNumber: phoneNumberRef.current || profile.phoneNumber,
			email: emailRef.current || profile.email,
		  };
		  
		  const hasChanges = 
		  updatedProfile.firstName !== profile.firstName ||
		  updatedProfile.lastName !== profile.lastName ||
		  updatedProfile.phoneNumber !== profile.phoneNumber ||
		  updatedProfile.email !== profile.email;
	  
		if (!hasChanges) {
		  console.log("im here");
		  Alert.alert('No Changes', 'Please provide some changes to update');
		  return; // Exit the function if no changes were made
		}

		  const response = await updateProfile(token, user, updatedProfile.email, updatedProfile.firstName, updatedProfile.lastName, updatedProfile.phoneNumber);
		  setProfile(response);
		  showSuccess('Profile updated successfully');
		  setEditModalVisible(false);
		} catch (error) {
		  console.error('Error updating profile: ', error);
		  showError('Error updating profile');
		}
	  };
	
	  const hideEditModal = () => {
		setEditModalVisible(false);
	  };

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
	
		  const formatKey = (key) => {
			return key.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
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
				{profile.PhotoUrl || image ? (
					<Avatar.Image size={100} source={{ uri: profile.PhotoUrl || image }} />
					) : (
					<Avatar.Icon size={100} icon="account" />
				)}
				{isItMine &&(
					<Button style={styles.editBtn} mode='contained' onPress={handleUploadPhoto}>
					{buttonPictureLabel}
					</Button>
				)}
				<Text variant="headlineSmall">{profile.username}</Text>
				<Text variant="titleMedium">{profile.email}</Text>
				{Object.keys(profile).map((key) => (
					key != 'PhotoUrl' && key != 'createdAt' && key != 'updatedAt' && key != 'uuid' &&
				 	key != 'email' && key != 'username' && profile[key] != null && (
				<Text key={key} variant="bodyMedium">{`${formatKey(key)}: ${profile[key]}`}</Text>)
				))}
				{isItMine && (<Button style={styles.editBtn} mode="contained" onPress={handleEditProfile}>
					Edit User Information
				</Button>)}

				<Surface style={styles.butttonsCon}>
					<Button onPress={() => navigation.navigate('My Reviews', { providerId: myUuid })} icon="star"  mode= 'text'>
						Reviews
					</Button>
				</Surface>
				{isItMine && (<Surface style={styles.butttonsCon}>
					<Button onPress={() => navigation.navigate('My Vehicles')} icon="car" mode='text'>
						My Vehicles
					</Button>
				</Surface>)}
			</Surface>
			<MyModal
				visible={modalVisible}
				hideModal={hideModal}
				pickImageFromCamera={pickImageFromCamera}
				pickImageFromGallery={pickImageFromGallery}
				removeImage={removeImage}
			  />
			<Portal>
				<Modal visible={editModalVisible} onDismiss={hideEditModal} contentContainerStyle={styles.modalContent}>
					<Text variant="headlineSmall">Edit Profile Information</Text>
					<View style={styles.inputGroup}>
					<Text variant="bodyMedium">First Name:</Text>
					<TextInput
						style={styles.input}
						defaultValue={profile.firstName}
						onChangeText={(value) => (firstNameRef.current = value)}
					/>
					</View>
					<View style={styles.inputGroup}>
					<Text variant="bodyMedium">Last Name:</Text>
					<TextInput
						style={styles.input}
						defaultValue={profile.lastName}
						onChangeText={(value) => (lastNameRef.current = value)}
					/>
					</View>
					<View style={styles.inputGroup}>
					<Text variant="bodyMedium">Phone Number:</Text>
					<TextInput
						style={styles.input}
						defaultValue={profile.phoneNumber}
						onChangeText={(value) => (phoneNumberRef.current = value)}
					/>
					<Text variant="bodyMedium">Email:</Text>
					<TextInput
						style={styles.input}
						defaultValue={profile.email}
						onChangeText={(value) => (emailRef.current = value)}
					/>
					</View>
					{/* Add more fields here */}
					<View style={styles.buttonGroup}>
						<Button mode="contained" onPress={handleSaveProfile} style={styles.saveButton}>
							Save Changes
						</Button>
						<Button mode="contained" onPress={hideEditModal} style={styles.cancelButton}>
							Cancel
						</Button>
					</View>
				</Modal>
			</Portal>
		</Provider>
	);
}
}

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  marginTop: 10,
	  alignItems: 'center',
	},
	butttonsCon: {
	  marginTop: 20,
	  padding: 5,
	  width: "80%",
	},
	editBtn: {
	  marginTop: 20,
	  padding: 10,
	},
	modalContent: {
	  padding: 20,
	  backgroundColor: 'white',
	  marginHorizontal: 20,
	  borderRadius: 10,
	},
	inputGroup: {
	  marginBottom: 20,
	},
	input: {
	  borderWidth: 1,
	  borderColor: '#ccc',
	  padding: 10,
	  borderRadius: 5,
	  marginTop: 5,
	},
	buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    saveButton: {
        flex: 1,
        marginRight: 10,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: 'red',
    },
  });

export default ProfilePage;