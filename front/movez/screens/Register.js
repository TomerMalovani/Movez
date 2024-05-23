// react native register screen

import React, { useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text} from 'react-native-paper';
import { register } from '../utils/user_api_calls';
import {TokenContext} from '../tokenContext';
const RegisterScreen = ({navigation}) => {
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const { updateToken} = useContext(TokenContext);

    const handleRegister = async () => {
        try{
        if (username && email && password) {
            const response = await register(username, email, password   );
            if(response.status === 201){
                const data = {username: response.data.user.username,token:response.data.user.token}
                await updateToken(data)

                console.log("post reg",response)
                navigation.navigate('Home')
            }else{
                throw new Error()
            }
          

            
        }
    }catch(err){
        console.log(err.message)
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