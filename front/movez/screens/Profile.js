import React from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';

const ProfilePage = () => {
    return (
        <View style={styles.container}>
            {/* profile image */}
            <View style={styles.image}>
                <Image
                    style={{ width: 100, height: 100, borderRadius: 50 }}
                 
                />            
            </View>
            <Text style={styles.title}>Profile Page</Text>
            {/* Add your profile content here */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});

export default ProfilePage;