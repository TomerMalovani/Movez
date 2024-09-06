import React, { useState, useEffect, useContext, useMemo, useRef, useCallback } from 'react';
import { TokenContext } from '../tokenContext';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert} from 'react-native';
import { Button, TextInput, Text, Avatar } from 'react-native-paper';
import { getProfile, getProfileByID } from '../utils/user_api_calls';
import { getUsersMessage } from '../utils/messages_api_calls';
import { URL } from '../utils/consts';

import io from 'socket.io-client';


const Chat = (props) => {
    const { moveRequest } = props.route.params;
    const { user, token } = useContext(TokenContext);
    const [profile, setProfile] = useState();
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState(null);
    //const [message, setMessage] = useState('');
    const messageRef = useRef('');
    const [messages, setMessages] = useState([]);
    const [initialMessagesLoaded, setInitialMessagesLoaded] = useState(false);
    const [userColors, setUserColors] = useState({});
    const [usersChat, setUsersChat] = useState([]);
    const messageInputRef = useRef(null);

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
            console.log("Fetched users IDs:", usersIDs);
    
            if (usersIDs && Array.isArray(usersIDs.usersUUID)) {
                const users = await Promise.all(usersIDs.usersUUID.map(async (userID) => {
                    try {
                        const userProfile = await getProfileByID(token, userID);
                        console.log("Fetched user profile:", userProfile);
                        return userProfile;
                    } catch (error) {
                        console.error("Error fetching user profile for userID:", userID, error);
                        return null;
                    }
                }));
                const filteredUsers = users.filter(user => user); // Filter out any nulls from failed fetches
                setUsersChat(filteredUsers);
                console.log("Filtered users loaded:", filteredUsers);
                return filteredUsers;
            } else {
                console.warn("No valid usersUUID found or not an array:", usersIDs);
                return [];
            }
    
        } catch (error) {
            console.error("Failed to get users to chat:", error);
            return [];
        } finally {
            setLoading(false);
        }
    };
    
    const mergeMessagesWithUsers = (messages, users = []) => {
        console.log("Merging messages:", messages);
        console.log("With users:", users);
    
        return messages.map((message) => {
            // Adjust how users are found in case of different identifiers (username or UUID)
            const user = users.find((u) => (u.firstName + " " + u.lastName) === message.from); // Example if messages have 'from' field as name
            // const user = users.find((u) => u.uuid === message.userUUID); // Example if messages have 'userUUID' field
    
            console.log("User found for message:", user);
            console.log("Message from:", message.from);
            return {
                ...message,
                userName: user ? `${user.firstName} ${user.lastName}` : message.from,  // Default to message 'from' if no user found
                userPhoto: user ? user.PhotoUrl : null, // Include user's photo URL if available
                userId: user ? user.uuid : null, // Include user's UUID if available
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
    
            // Load old messages and then users
            newSocket.on('connection', async (messages) => {
                if (!initialMessagesLoaded) {
                    console.log("Initial messages loaded:", messages);
                    setMessages(messages);  // Set messages without merging initially
    
                    try {
                        const users = await getUsersToChat();  // Fetch users
                        if (users.length > 0) {
                            const mergedMessages = mergeMessagesWithUsers(messages, users);  // Merge messages with fetched users
                            setMessages(mergedMessages);
                        } else {
                            console.warn("No users to merge with messages.");
                        }
                        setInitialMessagesLoaded(true);
                    } catch (error) {
                        console.error("Error during messages merge:", error);
                    }
                }
            });
    
            // Listen for new messages
            newSocket.on('private message', async (message) => {
                console.log("New private message received:", message);
                try {
                    const users = await getUsersToChat();  // Fetch users
                    if (users.length > 0) {
                        const mergedMessage = mergeMessagesWithUsers([message], users);  // Merge new message with users
                        setMessages((prevMessages) => [...prevMessages, ...mergedMessage]);
                    } else {
                        console.warn("No users to merge with new message.");
                        setMessages((prevMessages) => [...prevMessages, message]);  // Append message without merge
                    }
                } catch (error) {
                    console.error("Error processing new message:", error);
                    setMessages((prevMessages) => [...prevMessages, message]);  // Append message without merge on error
                }
            });
    
            return () => {
                newSocket.disconnect();
            };
        }
    }, [profile, initialMessagesLoaded]);
    
    const sendMessage = () => {
        const message = messageRef.current;
        console.log(message);
        if (socket && message) {
            socket.emit('private message', { content: message, from: profile.firstName + " " + profile.lastName });  // Send correct name
            //setMessages((prevMessages) => [...prevMessages, { from: profile.firstName + " " + profile.lastName, content: message }]);  // Add message to chat history
            //setMessage('');
            messageRef.current = '';  // Clear input field

            if (messageInputRef.current) {
                messageInputRef.current.clear();  // Clear the input field using the TextInput ref
            }
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

            isReadable = isColorReadable(color);
        }

        return color;
    };

    const isColorReadable = (color) => {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 50 && brightness < 200;
    };

    const getUserColorMemoized = useCallback(
        (username) => {
            if (!userColors[username]) {
                const newColor = generateRandomColor();
                setUserColors((prevColors) => ({ ...prevColors, [username]: newColor }));
                return newColor;
            }
            return userColors[username];
        },
        [userColors]
    );

    const RenderedMessage = useMemo(() => React.memo(({ item, navigation }) => (
        <View style={styles.messageContainer}>
            {item.userPhoto ? (
                <Avatar.Image size={40} source={{ uri: item.userPhoto }} style={styles.profilePicture} />
            ) : (
                <Avatar.Icon size={40} icon="account" style={styles.defaultProfileIcon} />
            )}
            <TouchableOpacity onPress={() => {console.log("item: ", item); item.userId ? navigation.navigate('Profile', { userId: item.userId }) : Alert.alert("Cant access user's profile")}}>
                <Text style={[styles.username, { color: getUserColorMemoized(item.from) }]}>{item.from}</Text>
            </TouchableOpacity>
            <Text style={styles.messageContent}>{item.content}</Text>
        </View>
    )), [getUserColorMemoized]);

    const renderItem = useMemo(() => ({ item, navigation }) => (
        <View style={styles.messageContainer}>
            {console.log("item: ", item)}
            {item.userPhoto ? (
                <Avatar.Image size={40} source={{ uri: item.userPhoto }} style={styles.profilePicture} />
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
                renderItem={({ item }) => <RenderedMessage item={item} navigation={props.navigation} />}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.messagesContainer}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    ref={messageInputRef}
                    label="Type a message..."
                    style={styles.textInput}
                    //value={messageRef.current} // Bind input to the ref
                    onChangeText={(text) => messageRef.current = text} // Update ref on input change
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