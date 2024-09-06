import React from 'react';
import MoveProvidingList from '../components/MoveProvidingList';
import { Appbar } from 'react-native-paper';

const ProvidingsHistory = ({ navigation }) => {
    return (
       <> 
			<Appbar.BackAction onPress={() => { navigation.navigate('Home') }} />

	   <MoveProvidingList navigation={navigation} filterStatus={['Canceled', 'Done']} />
	   </>
    );
};

export default ProvidingsHistory;
