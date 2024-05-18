// react native register screen

import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet,Text } from 'react-native';
import { register } from '../utils/user_api_calls';
const RegisterScreen = () => {
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const handleRegister = async () => {
        if (username && email && password) {
            const response = await register(username, email, password   );
            console.log(response);
        }
        
      
    };

    return (
        <View style={styles.container}>
        {/* header for form */}
            <Text style={{fontSize: 30, marginBottom: 20}}>Register</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Register" onPress={handleRegister} />
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
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
});

export default RegisterScreen;