import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Provider as PaperProvider } from 'react-native-paper';

const MovesProvided = () => {
    return (
        <PaperProvider>
            <View style={styles.container}>
                <Text style={styles.title}>Moves Provided</Text>
                {/* Display the list of Moves Provided by the user */}
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default MovesProvided;
