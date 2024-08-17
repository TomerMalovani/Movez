import React from 'react';
import MoveProvidingList from '../components/MoveProvidingList';

const ProvidingsHistory = ({ navigation }) => {
    return (
        <MoveProvidingList navigation={navigation} filterStatus={['Canceled', 'Done']} />
    );
};

export default ProvidingsHistory;
