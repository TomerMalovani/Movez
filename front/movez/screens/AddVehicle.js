import React, { useContext, useState, useEffect } from 'react';
import { Text, TextInput, Button, Icon, MD3Colors, Avatar, Portal } from 'react-native-paper';
import { View, StyleSheet, Alert } from 'react-native';
import { createVehicle, editVehicle, deleteVehiclePhoto } from '../utils/vehicle_api_calls';
import { TokenContext } from '../tokenContext';
import MyModal from '../Components/UploadPictureModal';
import * as ImagePicker from 'expo-image-picker';

const AddVehicle = ({ handleAddVehicle, handleEditVehicle, userVehicle }) => {
    const { token } = useContext(TokenContext);
    const [image, setImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [removedImage, setRemovedImage] = useState(false);
    const [changedPhoto, setChangedPhoto] = useState(false);

    const [vehicle, setVehicle] = useState({
        VehicleType: '',
        Depth: '',
        Width: '',
        Height: '',
        PhotoUrl: null
    });

    const inputs = [
        { name: 'VehicleType', type: 'text', placeholder: 'Vehicle Type' },
        { name: 'Depth', type: 'number', placeholder: 'Depth' },
        { name: 'Width', type: 'number', placeholder: 'Width' },
        { name: 'Height', type: 'number', placeholder: 'Height' }
    ];

    useEffect(() => {
        if (userVehicle) {
            setVehicle(userVehicle);
            setImage(userVehicle.PhotoUrl || null);
        }
    }, [userVehicle]);

    const handleUploadPhoto = () => {
        setModalVisible(true);
    };

    const hideModal = () => {
        setModalVisible(false);
    };

    const pickImageFromGallery = async () => {
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

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setChangedPhoto(true);
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

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setChangedPhoto(true);
        }
        setModalVisible(false);
    };

    const removeImage = async () => {
        setModalVisible(false);
        setImage(null);
        if (userVehicle && userVehicle.PhotoUrl) {
            setRemovedImage(true);
        }
    };

    const handleChange = (value, input) => {
        setVehicle((prev) => ({ ...prev, [`${input.name}`]: value }));
    };

    const handleSubmit = async () => {
        let editedCar;
        try {
            if (!userVehicle) {
                const newCar = await createVehicle(token, vehicle, image);
                handleAddVehicle(newCar);
            } else {
                const isInputChanged = Object.keys(vehicle).some(key => vehicle[key] !== userVehicle[key]);
                if (!isInputChanged && !changedPhoto && !removedImage) {
                    Alert.alert('No changes', 'Please make some changes to update');
                    console.log('No changes');
                    return;
                    // Code to handle input changes
                }
                
                if(changedPhoto){
                    editedCar = await editVehicle(token, vehicle, image);
                }
                else if(isInputChanged){
                    editedCar = await editVehicle(token, vehicle, null);
                }
                if (removedImage && !image) {
                    editedCar = await deleteVehiclePhoto(token, vehicle.uuid);
                }
                handleEditVehicle(editedCar);
                setRemovedImage(false);
                setChangedPhoto(false);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <View>
            {userVehicle ? (
                <Text style={{ textAlign: 'center', marginBottom: 10 }} variant="headlineMedium">Edit vehicle</Text>
            ) : (
                <Text style={{ textAlign: 'center', marginBottom: 10 }} variant="headlineMedium">Add vehicle</Text>
            )}
            <Icon name="car-estate" size={100} color={MD3Colors.error50} />
            {!image ? (
                <>
                    <Avatar.Icon size={70} icon="car" />
                    <Button style={styles.photobtn} mode="contained" onPress={handleUploadPhoto}>Upload Picture</Button>
                </>
            ) : (
                <>
                    <Avatar.Image size={100} source={{ uri: image }} />
                    <Button mode="contained" onPress={handleUploadPhoto}>Change Picture</Button>
                </>
            )}
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
                <Button style={styles.btn} mode='contained' onPress={handleSubmit}>
                    {userVehicle ? 'Edit Vehicle' : 'Add Vehicle'}
                </Button>
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
    },
    btn: {
        marginTop: 20
    },
    photobtn: {
        width: 200,
        marginTop: 10,
        marginBottom: 10,
    }
});

export default AddVehicle;
