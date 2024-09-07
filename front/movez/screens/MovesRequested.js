import React from 'react';
import MoveRequestsList from '../components/MoveRequestsList';
import { Appbar } from 'react-native-paper';

const MovesRequested = ({ navigation }) => {
    return (
		<>
			<Appbar.BackAction onPress={() => { navigation.navigate('Home') }} />

        <MoveRequestsList navigation={navigation} filterStatus={['Pending']} />
		</>
    );
};

export default MovesRequested;
