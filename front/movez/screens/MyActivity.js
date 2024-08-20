import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';

const MyActivity = ({ navigation }) => {
    return (
            <View style={styles.container}>
                <Text style={styles.title}>My Activity</Text>
                <View style={styles.buttonContainer}>
                    <Button
                        mode="contained"
                        onPress={() => navigation.navigate('MovesRequested')}
                        style={styles.button}
                    >
                        Moves Requested
                    </Button>
                    <Button
                        mode="contained"
                        onPress={() => navigation.navigate('ReviewSubmission')}
                        style={styles.button}
                    >
                        submit review
                    </Button>
                </View>
          
            </View>
     
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
        marginBottom: 20,
    },
    buttonContainer: {
        width: '80%',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    button: {
        marginVertical: 8,
    },
});

export default MyActivity;
