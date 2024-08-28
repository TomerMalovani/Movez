import React, { useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, BottomNavigation } from 'react-native-paper';
import { TokenContext } from '../tokenContext';
import { ToastContext } from '../toastContext';
import { useTab } from '../TabContext';

function HomePage({ navigation }) {
	const { user, myUuid } = useContext(TokenContext); // Access myUuid here
	const { showError, showSuccess } = useContext(ToastContext);
  	const { currentTab, setCurrentTab } = useTab()
  	const userType = user?.type; // Assuming 'type' indicates 'provider' or 'requester'
	const routes = [
		{
			key: 'provider', title: 'Provider', focusedIcon: 'account-cog' },
		{
			key: 'requester', title: 'Requester', focusedIcon: 'account-cowboy-hat' },
	];

	const renderScene = BottomNavigation.SceneMap({
		provider: () => <ProviderRoute navigation={navigation} />,
		requester: () => <RequesterRoute navigation={navigation} />,
	});
	const ProviderRoute = ({ navigation }) => (
		<View style={styles.container}>
			<Button style={styles.button} mode='outlined' onPress={() => navigation.navigate('SearchMoves')}>Search Moves Around You</Button>
			<Button style={styles.button} mode='outlined' onPress={() => navigation.navigate('Moves Provided')}>My Providing</Button>
			<Button style={styles.button } mode='outlined' onPress={() => navigation.navigate('Providings History')}>History</Button>
			<Button style={styles.button } mode='outlined' onPress={() => navigation.navigate('My Reviews', { providerId: myUuid })}>Feedback</Button>
		</View>
	);

	const RequesterRoute = ({ navigation }) => (
		<View style={styles.container}>
			<Button style={styles.button} mode='outlined' onPress={() => navigation.navigate('NewMovingRequestScreen')}>Create New Request</Button>
			<Button style={styles.button} mode='outlined' onPress={() => navigation.navigate('Moves Requested')}>See My Requests</Button>
			<Button style={styles.button } mode='outlined' onPress={() => navigation.navigate('Requests History')}>History</Button>
		</View>
	);

	const handleIndexChange = (index) => {
		const newTab = routes[index].key;
		setCurrentTab(newTab);
	};

	const getCurrentIndex = () => {
		return routes.findIndex(route => route.key === currentTab);
	};
  return (
    <>
   
		  <BottomNavigation
			  navigationState={{ index: getCurrentIndex(), routes }}
			  onIndexChange={handleIndexChange}
			  renderScene={renderScene}
		  />
    </>	
  );
}

const styles = StyleSheet.create({
	button:{
		margin: 10,
	},
  container: {
	flex: 1,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
  },
  title: {
	textAlign: 'center',
	fontSize: 24,
	fontWeight: 'bold',
	marginBottom: 16,
  },
	
  
});

export default HomePage;
