import React, { useState,useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import {Button,TextInput,Text } from 'react-native-paper';
import {login,getProfile } from '../utils/user_api_calls';
import {TokenContext} from '../tokenContext';
import { ToastContext } from '../toastContext';
const LoginScreen = ({navigation}) => {
    // use TokenContext
    const { token, updateToken,setUser,user } = useContext(TokenContext);
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
	const { showError, showSuccess } = useContext(ToastContext)

    const handleLogin = async () => {
        try{
            if (username && password) {
                const res = await login(username, password)
				
                const data = {username: res.user.username,token:res.user.token}
                await updateToken(data)
				console.log("res!!", res)
				showSuccess("Welcome back! " + res.user.username  )
                navigation.navigate('Home')
            
            
             }
        }
        catch(err){
			console.log("test", err)
			showError(err.toString())
        }   
        
    };

    return (
        <View style={styles.container}>
        {/* header for form */}
            <Text style={{fontSize: 30, marginBottom: 20}}>Login</Text>


            <TextInput
                style={styles.input}
                label="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                label="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button mode='text' style={{fontSize: 20, marginBottom: 20}} onPress={() => navigation.navigate('Register')}
 >new here?</Button>
            <Button mode="contained" onPress={handleLogin} >Login</Button>
          
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
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
});

export default LoginScreen;