import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Text, Card, Title, Paragraph, TouchableRipple, IconButton, Button, Portal, Dialog } from 'react-native-paper';
import { showRequestedMoves, deleteMoveRequest } from '../utils/moveRequest_api_calls';
import { TokenContext } from '../tokenContext';

const MoveRequestsList = ({ navigation, filterStatus }) => {
    const [moveRequests, setMoveRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [deleteRequestUuid, setDeleteRequestUuid] = useState(null);
    const { token } = useContext(TokenContext);

    const fetchMoveRequests = async () => {
        try {
            const data = await showRequestedMoves(token);
            console.log("Move requests data:", data); // Log API response for debugging
            if (data && Array.isArray(data)) {
                const filteredData = data.filter(request => filterStatus.includes(request.moveStatus));
                setMoveRequests(filteredData);
            } else {
                console.log("No move requests found");
            }
        } catch (error) {
            console.error("Error fetching move requests:", error); // Log error for debugging
        } finally {
            setLoading(false); // Ensure loading is set to false after request completes
        }
    };

    const handleMoveRequestClick = (item) => {
        navigation.navigate('SingleMoveRequest', { moveRequest: item });
    };

    const handleDeleteRequest = (uuid) => {
        setDeleteRequestUuid(uuid);
        setDeleteConfirmationVisible(true);
    };

    const confirmDeleteRequest = async () => {
        try {
            await deleteMoveRequest(token, deleteRequestUuid);
            setMoveRequests((prevRequests) => prevRequests.filter((request) => request.uuid !== deleteRequestUuid));
        } catch (error) {
            console.error("Error deleting move request:", error); // Log error for debugging
        } finally {
            setDeleteConfirmationVisible(false);
            setDeleteRequestUuid(null);
        }
    };

    useEffect(() => {
        fetchMoveRequests();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableRipple onPress={() => handleMoveRequestClick(item)}>
            <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                    <View style={styles.cardText}>
                        <Title>{item.moveStatus}</Title>
                        <Paragraph>{`Move Date: ${item.moveDate}`}</Paragraph>
                        <Paragraph>{`From: ${item.fromAddress}`}</Paragraph>
                        <Paragraph>{`To: ${item.toAddress}`}</Paragraph>
                    </View>
                    {item.moveStatus === 'Pending' && (
                        <IconButton
                            icon="delete"
                            color="red"
                            size={20}
                            onPress={() => handleDeleteRequest(item.uuid)}
                            style={styles.iconButton}
                        />
                    )}
                </Card.Content>
            </Card>
        </TouchableRipple>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
            ) : moveRequests.length === 0 ? (
                <Text style={styles.emptyMessage}>No move requests found.</Text>
            ) : (
                <>
                    <FlatList
                        data={moveRequests}
                        renderItem={renderItem}
                        keyExtractor={item => item.uuid}
                        contentContainerStyle={styles.list}
                    />
                    <Portal>
                        <Dialog
                            visible={deleteConfirmationVisible}
                            onDismiss={() => setDeleteConfirmationVisible(false)}
                        >
                            <Dialog.Title>Confirm Deletion</Dialog.Title>
                            <Dialog.Content>
                                <Paragraph>Are you sure you want to delete this move request?</Paragraph>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => setDeleteConfirmationVisible(false)}>Cancel</Button>
                                <Button onPress={confirmDeleteRequest} color="red">Delete</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </>
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
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardText: {
        flex: 1,
    },
    iconButton: {
        marginLeft: 10,
    },
    loadingIndicator: {
        flex: 1,
    },
    emptyMessage: {
        flex: 1,
        textAlign: 'center',
        paddingTop: 20,
        fontSize: 16,
        color: '#888',
    },
});

export default MoveRequestsList;
