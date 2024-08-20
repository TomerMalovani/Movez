import React from 'react';
import MoveProvidingList from '../components/MoveProvidingList';

const MovesProvided = ({ navigation, route }) => {
    const selectedVehicle = route.params?.selectedVehicle;
    console.log("Selected vehicle in MovesProvided:", selectedVehicle);

    return (
        <MoveProvidingList 
            navigation={navigation} 
            filterStatus={['Pending']} 
        />
    );
};

export default MovesProvided;
