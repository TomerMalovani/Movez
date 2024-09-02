import React, { useState, useEffect, useContext, useMemo } from 'react';
import { TokenContext } from '../tokenContext';
import { View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { Button, TextInput, Text, Avatar } from 'react-native-paper';
import { getProfile } from '../utils/user_api_calls';
import { getUsersMessage } from '../utils/messages_api_calls';
import { URL } from '../utils/consts';

import io from 'socket.io-client';


const Chat = (props) => {
    const { moveRequest } = props.route.params;
    const { user, token } = useContext(TokenContext);
    const [profile, setProfile] = useState();
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [initialMessagesLoaded, setInitialMessagesLoaded] = useState(false);
    const [userColors, setUserColors] = useState({});
    const [usersChat, setUsersChat] = useState([]);

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

    const getUsersToChat = async () => {
        try {
            setLoading(true);
            const usersIDs = await getUsersMessage(token, moveRequest);
            const users = await Promise.all(usersIDs.map(async (userID) => {
                return await getProfile(token, userID);
            }));
            console.log("users", users);
            setUsersChat(users);
            setLoading(false);
            return users;  // Return users for further use
        } catch (error) {
            setLoading(false);
            console.log(error);
            return [];
        }
    }
    const mergeMessagesWithUsers = (messages, users) => {
        return messages.map((message) => {
            const user = users.find((u) => u.userId === message.from);
            return {
                ...message,
                ...user,  // Merge user details into message object
            };
        });
    };

    useEffect(() => {
        getUser();
        return () => socket?.close();
        
    }, []);

    useEffect(() => {
        if (profile) {
            const newSocket = io(URL, {
                transports: ['websocket'],
                query: {
                    name: `${profile.firstName} ${profile.lastName}`,
                    moveRequest
                }
            });
            setSocket(newSocket);

            // Load old messages once on connection
            getUsersToChat().then(users => {
                // Load old messages once on connection
                newSocket.on('connection', (messages) => {
                    if (!initialMessagesLoaded) {
                        console.log("messages", messages);
                        const mergedMessages = mergeMessagesWithUsers(messages, users);
                        setMessages(mergedMessages);
                        setInitialMessagesLoaded(true);
                    }
                });

                // Listen for new messages
                newSocket.on('private message', (message) => {
                    getUsersToChat().then(updatedUsers => {
                        const mergedMessage = mergeMessagesWithUsers([message], updatedUsers);
                        setMessages((prevMessages) => [...prevMessages, ...mergedMessage]);
                    });
                });
            });
            return () => {
                newSocket.disconnect();
            };
        }
    }, [profile, initialMessagesLoaded]);

    const sendMessage = () => {
        console.log(message);
        if (socket && message) {
            socket.emit('private message', { content: message, from: profile.firstName + " " + profile.lastName });  // Send correct name
            //setMessages((prevMessages) => [...prevMessages, { from: profile.firstName + " " + profile.lastName, content: message }]);  // Add message to chat history
            setMessage('');
        }
    }

    const generateRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        let isReadable = false;
        
        while (!isReadable) {
            color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
    
            // Check if the color is readable
            isReadable = isColorReadable(color);
        }
        
        return color;
    };
    
    const isColorReadable = (color) => {
        // Convert hex color to RGB
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
    
        // Calculate the brightness of the color (using luminance formula)
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
        // Return true if brightness is between readable thresholds
        return brightness > 50 && brightness < 200;
    };

    // Function to assign a color to a user if not already assigned
    const getUserColor = (username) => {
        if (!userColors[username]) {
            const newColor = generateRandomColor();
            setUserColors((prevColors) => ({ ...prevColors, [username]: newColor }));
            return newColor;
        }
        return userColors[username];
    };

    const renderItem = useMemo(() => ({ item, navigation }) => (
        <View style={styles.messageContainer}>
            {console.log("item: ", item)}
            {item.PhotoUrl ? (
                <Avatar.Image size={40} source={{ uri: item.PhotoUrl }} style={styles.profilePicture} />
            ) : (
                <Avatar.Icon size={40} icon="account" style={styles.defaultProfileIcon} />
            )}
            <TouchableOpacity onPress={() => navigation.navigate('Profile', { userId: item.userId })}>
                <Text style={[styles.username, { color: getUserColor(item.from) }]}>{item.from}</Text>
            </TouchableOpacity>
            <Text style={styles.messageContent}>{item.content}</Text>
        </View>
    ), [userColors]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Chat</Text>
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.messagesContainer}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    label="Type a message..."
                    style={styles.textInput}
                    value={message}
                    onChangeText={setMessage}
                />
                <Button onPress={sendMessage} style={styles.sendButton}>Send</Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    header: {
        fontSize: 30,
        marginBottom: 20,
        textAlign: 'center',
    },
    messagesContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    defaultProfileIcon: {
        backgroundColor: 'gray', // or any color you prefer
        marginRight: 10,
    },
    username: {
        fontWeight: 'bold',
        marginRight: 5,
    },
    messageContent: {
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        marginRight: 10,
    },
    sendButton: {
        flexShrink: 0,
    },
});


export default Chat;