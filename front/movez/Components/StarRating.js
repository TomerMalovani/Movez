import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const StarRating = ({ rating }) => {
    console.log("rating in StarRating is: ", rating);

    const numericRating = Number(rating);

    // Handle cases where rating might be null, undefined, or not a number
    if (isNaN(numericRating)) {
        return (
            <View style={styles.container}>
                <Text style={styles.ratingText}>N/A</Text>
            </View>
        );
    }

    // Determine the number of full stars, half stars, and empty stars
    const fullStars = Math.floor(numericRating);
    const halfStars = numericRating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    return (
        <View style={styles.container}>
            <Text style={styles.ratingText}>{numericRating.toFixed(1)}</Text>
            <View style={styles.starsContainer}>
                {Array(fullStars).fill().map((_, index) => (
                    <Icon key={`full-${index}`} name="star" size={20} color="#FFD700" />
                ))}
                {halfStars === 1 && <Icon name="star-half" size={20} color="#FFD700" />}
                {Array(emptyStars).fill().map((_, index) => (
                    <Icon key={`empty-${index}`} name="star-border" size={20} color="#FFD700" />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
    starsContainer: {
        flexDirection: 'row',
    },
});

export default StarRating;
