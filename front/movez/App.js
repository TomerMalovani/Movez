import React, { useContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { BottomNavigation, MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import HomePage from './screens/Home';
import ProfilePage from './screens/Profile';
import MyActivity from './screens/MyActivity';
import MovesRequested from './screens/MovesRequested';
import RequestsHistory from './screens/RequestsHistory';
import MovesProvided from './screens/MovesProvided';
import ProvidingsHistory from './screens/ProvidingsHistory';
import NewMovingRequestScreen from './screens/NewMovingRequestScreen';
import UserVehicles from './screens/UserVehicles';
import SingleMoveRequest from './screens/SingleMoveRequest';

import { TokenProvider, TokenContext } from './tokenContext';
import { TabProvider, useTab } from './TabContext';
import { ToastProvider } from './toastContext';
import MovesSearchScreen from './screens/MovesSearchScreen';


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: '#1f2835',
		secondary: 'yellow',
	},
};

const DrawerComponent = (props) => {
	const { user, removeToken } = useContext(TokenContext);

	return (
		<DrawerContentScrollView>
			{user ? (
				<>
					<DrawerItem
						label="Logout"
						onPress={async () => {
							await removeToken();
						}}
					/>
					<DrawerItem label="Home" onPress={() => props.navigation.navigate('Home')} />
					<DrawerItem label="Profile" onPress={() => props.navigation.navigate('Profile')} />
					<DrawerItem label="New Moving Request" onPress={() => props.navigation.navigate('NewMovingRequestScreen')} />
					<DrawerItem label="My Activity" onPress={() => props.navigation.navigate('MyActivity')} />
					<DrawerItem label="My Vehicles" onPress={() => props.navigation.navigate('UserVehicles')} />
					
					<DrawerItem label="Search Moves" onPress={() => props.navigation.navigate('SearchMoves')} />

				</>
			) : (
				<>
					<DrawerItem label="Login" onPress={() => props.navigation.navigate('Login')} />
					<DrawerItem label="Register" onPress={() => props.navigation.navigate('Register')} />
				</>
			)}
		</DrawerContentScrollView>
	);
};

const LoggedInRoutes = () => (
	<Drawer.Navigator drawerContent={(props) => <DrawerComponent {...props} />}>
		<Drawer.Screen name="Home" component={HomePage} />
		<Drawer.Screen name="Profile" component={ProfilePage} />
		<Drawer.Screen name="NewMovingRequestScreen" component={NewMovingRequestScreen} />
		<Drawer.Screen name="MyActivity" component={MyActivity} />
		<Drawer.Screen name="My Vehicles" component={UserVehicles} />

		
		<Drawer.Screen name="UserVehicles" component={UserVehicles} />
		<Drawer.Screen name="Moves Requested" component={MovesRequested} />
		<Drawer.Screen name="Requests History" component={RequestsHistory} />
		<Drawer.Screen name="Moves Provided" component={MovesProvided} />
		<Drawer.Screen name="Providings History" component={ProvidingsHistory} />
		<Drawer.Screen name="SingleMoveRequest" component={SingleMoveRequest} />
		<Drawer.Screen name="SearchMoves" component={MovesSearchScreen} />
	</Drawer.Navigator>
);

const NotLoggedInRoutes = () => (
	<Drawer.Navigator drawerContent={(props) => <DrawerComponent {...props} />}>
		<Drawer.Screen name="Login" component={LoginScreen} />
		<Drawer.Screen name="Register" component={RegisterScreen} />
	</Drawer.Navigator>
);

const AuthRoutes = () => {
	const { user } = useContext(TokenContext);

	return (
		<NavigationContainer>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				{user ? (
					<Stack.Screen name="LoggedInRoutes" component={LoggedInRoutes} />
				) : (
					<Stack.Screen name="NotLoggedInRoutes" component={NotLoggedInRoutes} />
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
};

const ProviderStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomePage} />
    <Stack.Screen name="Profile" component={ProfilePage} />
    <Stack.Screen name="My Vehicles" component={UserVehicles} />
    <Stack.Screen name="Moves Provided" component={MovesProvided} />
    <Stack.Screen name="SingleMoveRequest" component={SingleMoveRequest} />
  </Stack.Navigator>
);

const RequesterStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomePage} />
    <Stack.Screen name="Profile" component={ProfilePage} />
    <Stack.Screen name="NewMovingRequestScreen" component={NewMovingRequestScreen} />
    <Stack.Screen name="MyActivity" component={MyActivity} />
    <Stack.Screen name="Moves Requested" component={MovesRequested} />
    <Stack.Screen name="SingleMoveRequest" component={SingleMoveRequest} />
  </Stack.Navigator>
);


export default function App() {
	



	return (
		<TokenProvider>
			<PaperProvider theme={theme}>
				<ToastProvider>
					<TabProvider>
						<AuthRoutes />
					</TabProvider>
				</ToastProvider>
			</PaperProvider>
		</TokenProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
