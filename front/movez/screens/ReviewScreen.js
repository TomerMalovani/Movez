import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { TokenContext } from '../tokenContext';
import { createReview, updateReview } from '../utils/review_api_calls';
import { getPriceProposalsByRequest } from '../utils/api_price_proposals';
import { Portal, Dialog } from 'react-native-paper';

const ReviewScreen = ({ route, navigation }) => {
    const { token, myUuid } = useContext(TokenContext);
    const { moveRequest } = route.params;
    const [providerId, setProviderId] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [confirmEditVisible, setConfirmEditVisible] = useState(false); // State for confirmation dialog

    useEffect(() => {
        const fetchProviderId = async () => {
            if (!token) {
                return;
            }
            try {
                const priceProposals = await getPriceProposalsByRequest(token, moveRequest.uuid);
                if (priceProposals.length > 0 && priceProposals[0].MoverID) {
                    setProviderId(priceProposals[0].MoverID);
                } else {
                    Alert.alert("Failed to load provider information");
                }
                if (route.params.reviewExists && route.params.reviewData) {
                    setRating(route.params.reviewData.rating);
                    setComment(route.params.reviewData.comment);
                }
            } catch (error) {
                console.error("Error fetching ProviderID:", error);
                Alert.alert("Failed to load provider information.");
            }
        };
        fetchProviderId();
    }, [moveRequest, token]);

    const handleReviewPress = () => {
        if (route.params.reviewExists) {
            setConfirmEditVisible(true); // Show confirmation dialog
        } else {
            handleSubmitReview();
        }
    };

    const handleCommentChange = (text) => {
        if (text.length <= 300) {
            setComment(text);
        }
    };
    
    const handleSubmitReview = async () => {
        const body = {
            rating,
            comment: comment.slice(0, 300),
            RequesterID: myUuid,
            ProviderID: providerId,
            RequestID: moveRequest.uuid
        };

        try {
            let res;
            if (route.params.reviewExists) {
                res = await updateReview(token, route.params.reviewUuid, body);
            } else {
                res = await createReview(token, body);
            }

            if (res?.data) {
                Alert.alert("Thank you for your feedback!");
                navigation.goBack();
            } else {
                Alert.alert("Failed to submit review. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            Alert.alert("Error occurred while submitting review");
        }
    };

    return (
        <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 18, marginBottom: 8 }}>Rate your experience:</Text>
            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <IconButton
                        key={star}
                        icon={star <= rating ? 'star' : 'star-outline'}
                        color={star <= rating ? '#FFD700' : '#000'}
                        size={30}
                        onPress={() => setRating(star)}
                    />
                ))}
            </View>
            <TextInput
                value={comment}
                onChangeText={handleCommentChange}
                multiline
                placeholder="Write your feedback here..."
                style={{ marginBottom: 16, height: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 }}
            />
            <Text style={{ marginBottom: 8 }}>{`${comment.length}/300`}</Text>
            <Button
                mode="contained"
                onPress={handleReviewPress}
            >
                {route.params.reviewExists ? 'Edit Review' : 'Submit Review'}
            </Button>

            {/* Confirmation Dialog */}
            <Portal>
                <Dialog visible={confirmEditVisible} onDismiss={() => setConfirmEditVisible(false)}>
                    <Dialog.Title>Confirm Edit</Dialog.Title>
                    <Dialog.Content>
                        <Text>Are you sure you want to edit your review?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setConfirmEditVisible(false)}>Cancel</Button>
                        <Button onPress={() => {
                            setConfirmEditVisible(false);
                            handleSubmitReview();
                        }}>
                            Confirm
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
};

export default ReviewScreen;