import React, { useState, useEffect, useContext } from 'react';
import { TokenContext } from '../tokenContext';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import { getProfile } from '../utils/user_api_calls';
import {URL} from '../utils/consts';
import io from 'socket.io-client';

const Chat = (props) => {
    const { navigation } = props;
    const { user, token } = useContext(TokenContext);
    const [profile, setProfile] = useState();
    const [loading, setLoading] = useState(false);

    const [socket, setSocket] = useState(null);
    const [to, setTo] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);



    const getUser = async () => {
        try {
            setLoading(true);
            const profile = await getProfile(token);
            console.log("profile api", profile.email)
            console.log(profile);
            setProfile(profile);
            setLoading(false);

        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    useEffect(() => {
        getUser();



        return () => newSocket.close();

    }, []);
    useEffect(() => {
        if (profile) {
            const newSocket = io(URL, {transports: ['websocket'], query: { username: profile.username } });
            setSocket(newSocket);
            newSocket.on('private message', (message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });
        }
    }, [profile]);
    const sendMessage = () => {
        console.log(message);
        if (socket && message) {
            socket.emit('private message', { content: message, to });
            setMessage('');
            setMessages([...messages, { from: profile.username, content: message }]);
        }
    }

    return (

        <View>
            <Text style={{ fontSize: 30, marginBottom: 20 }}>Chat</Text>
            <View>
                {messages.map((msg, index) => (
                    <View key={index}>
                       <Text> {msg.from}:  {msg.content}</Text>
                    </View>
                ))}
            </View>
            <TextInput

                label="Type a message..."
                value={message}
                onChangeText={setMessage}
            />
            <Button onPress={sendMessage}>Send</Button>
        </View>

    );
}



export default Chat;