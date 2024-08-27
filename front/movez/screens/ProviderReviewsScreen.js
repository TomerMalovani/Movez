import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { TokenContext } from '../tokenContext';
import { getProviderReviews } from '../utils/review_api_calls';
import StarRating from '../components/StarRating';

const ProviderReviewsScreen = ({ route }) => {
    const { token } = useContext(TokenContext);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const { providerId } = route.params;

    useEffect(() => {
        const fetchReviews = async () => {
            if (!providerId) {
                console.error("Provider ID is undefined. Cannot fetch reviews.");
                return;
            }

            if (!token) {
                return;
            }
            try {
                console.log("front: Fetching reviews for provider ID:", providerId);
                const response = await getProviderReviews(token, providerId);
                console.log("response: ", response);
    
                if (response.message === "success") {
                    console.log("reviews in front: ", response);
                    setReviews(response.reviews);
                    setAverageRating(response.averageRating);  // Ensure averageRating is a number
                } else {
                    console.error("Failed to fetch reviews: ", response.message);
                }
            } catch (error) {
                console.error("Error fetching provider reviews:", error.message || error);
            }
        };
    
        fetchReviews();
    }, [providerId, token]);
    
    if (!token) {
        return <Text>Please log in to view reviews.</Text>; // Handle the case where token is missing
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Provider Reviews</Text>
            <View style={styles.averageRatingContainer}>
                <Text style={styles.averageRatingText}>Average Rating: </Text>
                <StarRating rating={averageRating} />
            </View>
            <FlatList
                data={reviews}
                keyExtractor={(item) => item.uuid}
                renderItem={({ item }) => (
                    <View style={styles.reviewItem}>
                        <View style={styles.ratingContainer}>
                            <Text style={styles.ratingText}>Rating: </Text>
                            <StarRating rating={item.rating} />
                        </View>
                        <Text style={styles.comment}>{item.comment}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    averageRating: {
        fontSize: 18,
        marginBottom: 16,
    },
    reviewItem: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    rating: {
        fontSize: 14,
        marginBottom: 4,
    },
    comment: {
        fontSize: 14,
        color: '#555',
    },
    averageRatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    averageRatingText: {
        fontSize: 18,
        marginRight: 8,
    },
    averageRatingNumber: {
        fontSize: 18,
        marginLeft: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingText: {
        fontSize: 14,
        marginRight: 4,
    },
});

export default ProviderReviewsScreen;
