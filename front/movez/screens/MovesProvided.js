import React from 'react';
import MoveProvidingList from '../components/MoveProvidingList';

const MovesProvided = ({ navigation }) => {
    return (
        <MoveProvidingList navigation={navigation} filterStatus={['Pending']} />
    );
};

export default MovesProvided;
