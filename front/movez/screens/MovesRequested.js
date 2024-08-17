import React from 'react';
import MoveRequestsList from '../components/MoveRequestsList';

const MovesRequested = ({ navigation }) => {
    return (
        <MoveRequestsList navigation={navigation} filterStatus={['Pending']} />
    );
};

export default MovesRequested;
