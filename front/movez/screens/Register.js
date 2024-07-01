// react native register screen

import React, { useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text} from 'react-native-paper';
import { register } from '../utils/user_api_calls';
import {TokenContext} from '../tokenContext';
import { ToastContext } from '../toastContext';
const RegisterScreen = ({navigation}) => {
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const { updateToken} = useContext(TokenContext);
	const {showError, showSuccess} = useContext(ToastContext)

    const handleRegister = async () => {
        try{
        if (username && email && password) {
            const response = await register(username, email, password   );
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

    return (
        <View style={styles.container}>
        {/* header for form */}
            <Text style={{fontSize: 30, marginBottom: 20}}>Register</Text>
            <TextInput
                style={styles.input}
                label="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                label="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                label="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button mode='contained' onPress={handleRegister} >Register</Button>
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
    input: {
        width: '100%',

        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
});

export default RegisterScreen;