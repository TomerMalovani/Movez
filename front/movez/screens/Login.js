import React, { useState,useEffect } from 'react';
import { View, TextInput, Button, StyleSheet,Text } from 'react-native';
import {login,getProfile } from '../utils/user_api_calls';
const LoginScreen = ({navigation}) => {
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        console.log("token",token)
    }, [token])

    const handleLogin = async () => {
        if (username && password) {
           const res = await  login(username, password)
            setToken(res.data.user.token)
            }
        
    };

    return (
        <View style={styles.container}>
        {/* header for form */}
            <Text style={{fontSize: 30, marginBottom: 20}}>Login</Text>
            <Text style={{fontSize: 30, marginBottom: 20}}>{token}</Text>

            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Text style={{fontSize: 20, marginBottom: 20}} onPress={() => navigation.navigate('Register')}
 >new here?</Text>
            <Button title="Login" onPress={handleLogin} />
            <Button title = "test jwt" onPress={()=>getProfile(token)}/>
        </View>
    );
};

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

export default LoginScreen;