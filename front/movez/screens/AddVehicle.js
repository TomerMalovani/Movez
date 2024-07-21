import React, { useContext, useState } from 'react';
import { Text, TextInput, Button, Icon, MD3Colors, Avatar, Portal} from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { createVehicle, editVehicle } from '../utils/vehicle_api_calls';
import { TokenContext } from '../tokenContext';
import MyModal from '../Components/UploadPictureModal';
import * as ImagePicker from 'expo-image-picker';

const AddVehicle = ({ handleAddVehicle }, { handleEditVehicle }, userVehicle) => {
	const {token} = useContext(TokenContext)
	const [image, setImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [removedImage, setRemovedImage] = useState(false);

    const [vehicle, setVehicle] = useState({
        VehicleType:'',
        Depth:'',
        Width:'', 
        Height:'',
        PhotoUrl: null
    });

    const inputs = [
        { name: 'VehicleType', type: 'text' , placeholder: 'Vehicle Type'},
        { name: 'Depth', type: 'number' , placeholder: 'Depth'},
		{ name: 'Width', type: 'number' , placeholder: 'Width'},
		{ name: 'Height', type: 'number' , placeholder: 'Height'}
        
    ]

    if (userVehicle) {
        setVehicle(userVehicle);
    }

    const handleUploadPhoto = () => {
        setModalVisible(true);
    }

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
			 await setImage(result.assets[0].uri);
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
		    await setImage(result.assets[0].uri)
		}
		setModalVisible(false);
	  };

      const removeImage = async () => {
        setModalVisible(false);
        setImage(null);
        if(userVehicle.PhotoUrl){
            setRemovedImage(true);
        };
    };

    const handleChange = (e,input) => {
		setVehicle(prev => ({ ...prev, [`${input.name}`]: e }));
    };

    const handleSubmit = async (e) => {
		try{
			// Add your logic here to handle the form submission
            if(!userVehicle){
                console.log(vehicle, token);
                const newCar = await createVehicle(token, vehicle, image)
                console.log("create car response", newCar)
                handleAddVehicle(newCar)
            }
            else{
                console.log(vehicle, token);
                const editedCar = await editVehicle(token, vehicle, image)
                if(removedImage && !image){
                    await deleteVehiclePhoto(token, vehicle.uuid);
                }
                setRemovedImage(false);
                console.log("edit car response", editedCar)
                handleEditVehicle(editedCar)
            }

		}catch(err){
			console.log(err)
		}
  
    };

    return (
        <View >
			
			<Text style={{textAlign:"center",marginBottom:10}} variant="headlineMedium">Add vehicle</Text>
			<Icon name="car-estate" size={100} color={MD3Colors.error50} />
            {!image ? (
				<><Avatar.Icon size={70} icon="car" />
                <Button style={styles.photobtn} mode="contained" onPress={() => handleUploadPhoto()}>Upload Picture</Button></>
            ):  (
				    <><Avatar.Image size={100} source={{image}} />
				    <Button mode="contained" onPress={() => handleUploadPhoto()}>Change Picture</Button></>
			    )
            }
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
            <Portal>
                <MyModal
                    visible={modalVisible}
                    hideModal={hideModal}
                    pickImageFromCamera={pickImageFromCamera}
                    pickImageFromGallery={pickImageFromGallery}
                    removeImage={removeImage}
                />
            </Portal>
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
	},
    photobtn:{
        width: 200,
        marginTop: 10,
        marginBottom: 10,
    }
});
export default AddVehicle;