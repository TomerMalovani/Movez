import React from 'react';
import MoveRequestsList from '../components/MoveRequestsList';

const RequestsHistory = ({ navigation }) => {
    return (
        <MoveRequestsList navigation={navigation} filterStatus={['Cancelled', 'Done']} />
    );
};

export default RequestsHistory;
