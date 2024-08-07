// react native register screen
import React, { useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text} from 'react-native-paper';
import { register } from '../utils/user_api_calls';
import {TokenContext} from '../tokenContext';
import { ToastContext } from '../toastContext';
import ImageAddOrChange from '../components/ImageAddOrChange';
import FullScreenImageModal from '../components/FullScreenImageModal';

const RegisterScreen = ({navigation}) => {
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const { updateToken} = useContext(TokenContext);
	const {showError, showSuccess} = useContext(ToastContext);
    const [image, setImage] = useState(null);
    const [fullScreenImage, setFullScreenImage] = useState(null);
    const [pictureModalVisible, setPictureModalVisible] = useState(false);

    const handleRegister = async () => {
        try{
        if (username && email && password && firstName && phoneNumber) {
            const response = await register(username, email, password, firstName, lastName, phoneNumber, image);
            const data = {username: response.user.username,token:response.user.token, uuid: response.user.uuid}
            await updateToken(data)
            console.log("post reg",response)
			showSuccess("Welcome! " + response.user.username)
            navigation.navigate('Home')  
       		 }
    	}catch(err){
        console.log(err.message)
			showError(err.toString())
    	}
      
    };

    const hideModal = () => {
        setPictureModalVisible(false);
    };

    const handleImagePress = (uri) => {
        setFullScreenImage([{ url: uri }]);
    }

    const handleFullScreenImageClose = () => {
        setFullScreenImage(null);
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
        setPictureModalVisible(false);
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
        setPictureModalVisible(false);
    };

    const removeImage = async () => {
        setPictureModalVisible(false);
        setImage(null);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Register</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    label={<Text>Username<Text style={styles.asterisk}> *</Text></Text>}
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    label={<Text>Email<Text style={styles.asterisk}> *</Text></Text>}
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    label={<Text>Password<Text style={styles.asterisk}> *</Text></Text>}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TextInput
                    style={styles.input}
                    label={<Text>First Name<Text style={styles.asterisk}> *</Text></Text>}
                    value={firstName}
                    onChangeText={setFirstName}
                />
                <TextInput
                    style={styles.input}
                    label="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                />
                <TextInput
                    style={styles.input}
                    label={<Text>Phone Number<Text style={styles.asterisk}> *</Text></Text>}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                />
                <ImageAddOrChange
                image={image}
                handleImagePress={handleImagePress}
                pictureModalVisible={pictureModalVisible}
                hideModal={hideModal}
                pickImageFromCamera={pickImageFromCamera}
                pickImageFromGallery={pickImageFromGallery}
                removeImage={removeImage}
                />
                <FullScreenImageModal 
                    visible={!!fullScreenImage} 
                    imageUrls={fullScreenImage} 
                    onClose={handleFullScreenImageClose} 
                />
            </View>
            <Button mode='contained' onPress={handleRegister}>Register</Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    header: {
        fontSize: 30,
        marginBottom: 20,
    },
    inputContainer: {
        width: '100%',
    },
    input: {
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    asterisk: {
        color: 'red',
    },
});
export default RegisterScreen;