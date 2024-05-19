import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet,Text } from 'react-native';
import {login,getProfile } from '../utils/user_api_calls';
import {TokenContext} from '../tokenContext';
const LoginScreen = ({navigation}) => {
    // use TokenContext
    const { token, updateToken,setUser } = React.useContext(TokenContext);
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleLogin = async () => {
        if (username && password) {
           const res = await  login(username, password)
           updateToken(res.data.user.token)
           console.log("username",res.data)

           setUser(res.data.user)
        }
        
    };

    return (
        <View style={styles.container}>
        {/* header for form */}
            <Text style={{fontSize: 30, marginBottom: 20}}>Login</Text>


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