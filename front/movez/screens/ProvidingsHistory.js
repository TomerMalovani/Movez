import React from 'react';
import MoveProvidingList from '../components/MoveProvidingList';

const ProvidingsHistory = ({ navigation }) => {
    return (
        <MoveProvidingList navigation={navigation} filterStatus={['Cancelled', 'Done']} />
    );
};

export default ProvidingsHistory;
