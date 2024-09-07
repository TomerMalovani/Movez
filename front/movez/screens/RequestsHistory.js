import React from 'react';
import MoveRequestsList from '../components/MoveRequestsList';
import { Appbar } from 'react-native-paper';

const RequestsHistory = ({ navigation }) => {
    return (
		<>
			<Appbar.BackAction onPress={() => { navigation.navigate('Home') }} />

        <MoveRequestsList navigation={navigation} filterStatus={['Canceled', 'Done']} />
		</>
    );
};

export default RequestsHistory;
