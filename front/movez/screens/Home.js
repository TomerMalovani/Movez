import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { createNativeStackNavigator  } from '@react-navigation/native-stack';
import NewMovingRequestScreen from './NewMovingRequestScreen';


const Stack = createNativeStackNavigator();

function HomePage({navigation}) {

    const HomeScreen = ({navigation}) => {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Home</Text>
                <Button
                    title="New Moving Request"
                    onPress={() => navigation.navigate('NewMovingRequestScreen')}
                />
            </View>
        );
    }
    
    return (

        <View style={styles.container}>
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false}}>
                <Stack.Screen name="Start" component={HomeScreen} />
                <Stack.Screen name="NewMovingRequestScreen" component={NewMovingRequestScreen} />

            </Stack.Navigator>
       
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
     flex: 1,
       display: 'flex',
    //    height: '100%',
    },
    title: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});

export default HomePage;