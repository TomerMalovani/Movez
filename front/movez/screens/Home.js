import React from 'react';
import { View, Text,Button } from 'react-native';

function HomePage({navigation}) {
    
    return (

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Page</Text>
            <Button
                title="Go to Login"
                onPress={() => navigation.navigate('Login')}
            />
        </View>
    );
}

export default HomePage;