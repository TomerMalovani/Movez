import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Text, Card, Title, Paragraph } from 'react-native-paper';
import { showRequestedMoves } from '../utils/moveRequest_api_calls';
import { TokenContext } from '../tokenContext';

const MovesRequested = () => {
    const [moveRequests, setMoveRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(TokenContext);

    const fetchMoveRequests = async () => {
        try {
            const data = await showRequestedMoves(token);
            console.log("API Response:", data); // Log API response for debugging
            if (data && Array.isArray(data)) {
                setMoveRequests(data);
            } else {
                console.log("No move requests found");
            }
        } catch (error) {
            console.error("Error fetching move requests:", error); // Log error for debugging
        } finally {
            setLoading(false); // Ensure loading is set to false after request completes
        }
    };

    useEffect(() => {
        fetchMoveRequests();
    }, []);

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : moveRequests.length === 0 ? (
                <Text>No move requests found.</Text>
            ) : (
                <FlatList
                    data={moveRequests}
                    renderItem={({ item }) => (
                        <Card style={styles.card}>
                            <Card.Content>
                                <Title>{item.moveStatus}</Title>
                                <Paragraph>{`Move Date: ${item.moveDate}`}</Paragraph>
                                <Paragraph>{`From: ${item.fromAddress}`}</Paragraph>
                                <Paragraph>{`To: ${item.toAddress}`}</Paragraph>
                            </Card.Content>
                        </Card>
                    )}
                    keyExtractor={item => item.uuid}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    list: {
        flexGrow: 1,
    },
    card: {
        marginBottom: 16,
    },
});

export default MovesRequested;
