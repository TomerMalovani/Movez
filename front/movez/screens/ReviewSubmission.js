import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { TokenContext } from '../tokenContext';
//import { submitReview } from '../utils/review_api_calls';

const ReviewScreen = ({ route, navigation }) => {
    const { token } = useContext(TokenContext);
    const { providerId } = route.params; // passed from previous screen
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = async () => {
        if (rating === 0) {
            Alert.alert("Please provide a rating.");
            return;
        }

        const response = await submitReview(token, providerId, rating, comment);
        if (response.success) {
            Alert.alert("Thank you for your feedback!");
            navigation.goBack();
        } else {
            Alert.alert("Failed to submit review. Please try again.");
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
                label="Leave a comment"
                value={comment}
                onChangeText={setComment}
                multiline
                style={{ marginBottom: 16, height: 100, textAlignVertical: 'top' }}
            />
            <Button mode="contained" onPress={handleSubmit}>
                Submit Review
            </Button>
        </View>
    );
};

export default ReviewScreen;
