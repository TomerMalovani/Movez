import React from 'react';
import MoveProvidingList from '../components/MoveProvidingList';
import { Appbar } from 'react-native-paper';

const MovesProvided = ({ navigation, route }) => {
    const selectedVehicle = route.params?.selectedVehicle;
    console.log("Selected vehicle in MovesProvided:", selectedVehicle);

    return (
		<>
		<Appbar.BackAction onPress={() => { navigation.navigate('Home') }} />

	
        <MoveProvidingList 
            navigation={navigation} 
            filterStatus={['Pending']} 
        />
		</>
    );
};

export default MovesProvided;
