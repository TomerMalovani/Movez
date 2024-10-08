import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Text, Card, Title, Paragraph, TouchableRipple, IconButton, Button, Portal, Dialog, Avatar, MD3Colors } from 'react-native-paper';
import { showRequestedMoves, deleteMoveRequest } from '../utils/moveRequest_api_calls';
import { getReviewByRequest } from '../utils/review_api_calls';
import { TokenContext } from '../tokenContext';

const MoveRequestsList = ({ navigation, filterStatus }) => {
    const [moveRequests, setMoveRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [deleteRequestUuid, setDeleteRequestUuid] = useState(null);
    const [reviewStatus, setReviewStatus] = useState({}); // State to store review existence for each request
    const { token } = useContext(TokenContext);

    const fetchMoveRequests = async () => {
        try {
            const data = await showRequestedMoves(token);
            console.log("Move requests data: ", data); // Log API response for debugging
            if (data && Array.isArray(data)) {
                const filteredData = data.filter(request => filterStatus.includes(request.moveStatus));
                setMoveRequests(filteredData);
    
                // Store review data for each move request
                const reviewsByRequest = {};
                for (const request of filteredData) {
                    if (request.moveStatus === 'Done') {
                        try {
                            const reviewResponse = await getReviewByRequest(request.uuid, token);
                            console.log("review response: ", reviewResponse);
        
                            // Store the full review object if it exists
                            reviewsByRequest[request.uuid] = reviewResponse.review || null;
                        } catch (error) {
                            console.error("Error checking for review:", error);
                            reviewsByRequest[request.uuid] = null; // No review or error occurred
                        }
                    } else {
                        // Keep the existing status if the moveStatus is not "Done"
                        reviewsByRequest[request.uuid] = reviewStatus[request.uuid] || null;
                    }    
                }
                console.log("reviewsByRequest: ", reviewsByRequest);
                setReviewStatus(reviewsByRequest);
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
                    <View style={styles.iconContainer}>
                        {item.moveStatus === 'Pending' && (
                            <IconButton
                                icon="trash-can"
                                iconColor={MD3Colors.error50}
                                mode='contained'
                                size={20}
                                onPress={() => handleDeleteRequest(item.uuid)}
                            />
                        )}
                        {item.moveStatus === 'Pending' || item.moveStatus === 'Done' ? (
                            <IconButton
                                icon="chat"
                                mode='contained'
                                size={20}
                                onPress={() => navigation.navigate('Chat', { moveRequest: item.uuid })}
                                style={styles.chatIcon}
                            />
                        ) : null}
                        {item.moveStatus === 'Done' && (
                            <Button
                                mode="contained"
                                onPress={() => navigation.navigate('ReviewScreen', { 
                                    moveRequest: item, 
                                    reviewExists: !!reviewStatus[item.uuid], 
                                    reviewData: reviewStatus[item.uuid],
                                    reviewUuid: reviewStatus[item.uuid]?.uuid
                                })}
                                style={styles.reviewButton}
                            >
                                {reviewStatus[item.uuid] ? 'Edit Review' : 'Submit Review'}
                            </Button>
                        )}
                    </View>
                </Card.Content>
            </Card>
        </TouchableRipple>
    );
    
    
    
    useEffect(() => {
        fetchMoveRequests();
    }, []);

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
        position: 'relative',
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
    },
    cardText: {
        flex: 1,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chatIcon: {
        marginLeft: 10,
    },
    reviewButton: {
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
