import React,{useContext} from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator  } from '@react-navigation/native-stack';
import NewMovingRequestScreen from './NewMovingRequestScreen';
import { Button,Text } from 'react-native-paper';
import { TokenContext } from '../tokenContext';


const Stack = createNativeStackNavigator();

function HomePage({navigation}) {
    const {user} = useContext(TokenContext)


    const HomeScreen = ({navigation}) => {
        return (
            <View style={styles.container}>
                <Text>hello {user}!</Text>
                <Text style={styles.title}>Home</Text>
                <Button
                icon="camera" mode="contained"
              
                    onPress={() => navigation.navigate('NewMovingRequestScreen')}
                >New Moving Request</Button>
            </View>
        );
    }
    
    return (

        <View style={styles.container}>
            <Stack.Navigator  screenOptions={{ headerShown: false}}>
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