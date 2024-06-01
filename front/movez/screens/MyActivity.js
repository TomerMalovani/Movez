import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Provider as PaperProvider } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MovesRequested from './MovesRequested';
import MovesProvided from './MovesProvided';

const Stack = createNativeStackNavigator();

const MyActivity = ({ navigation }) => {
    return (
        <PaperProvider>
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
                        onPress={() => navigation.navigate('MovesProvided')}
                        style={styles.button}
                    >
                        Moves Provided
                    </Button>
                </View>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="MovesRequested" component={MovesRequested} />
                    <Stack.Screen name="MovesProvided" component={MovesProvided} />
                </Stack.Navigator>
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
