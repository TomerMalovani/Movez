import react , {useContext,useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import HomePage from './screens/Home';
import ProfilePage from './screens/Profile';
import  {  TokenProvider,TokenContext } from './tokenContext';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import NewMovingRequestScreen from './screens/NewMovingRequestScreen';
import { MD3LightTheme as DefaultTheme,PaperProvider } from 'react-native-paper';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import  AddVehicle  from './screens/AddVehicle';
import UserVehicles from './screens/UserVehicles';

  
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

function DrawerComponent(props) {
  const {user,removeToken } = useContext(TokenContext);

    return (
      <DrawerContentScrollView>
      {(user !== null) ?
        <>
              <DrawerItem
          label="Logout"
          onPress={async () => {
            // Perform logout operation here
            // Then navigate to the login screen (replace 'Login' with the actual name of your login screen)
            await removeToken()
          
          }}/>
          <DrawerItem label="Home" onPress={() => props.navigation.navigate('Home')} />
          <DrawerItem label="Profile" onPress={() => props.navigation.navigate('Profile')} />
          <DrawerItem label="New Moving Request" onPress={() => props.navigation.navigate('NewMovingRequestScreen')} />
        </>
     
:
<>
<DrawerItem label="Login" onPress={() => props.navigation.navigate('Login')} />
          <DrawerItem label="Register" onPress={() => props.navigation.navigate('Register')} />
</>
}
</DrawerContentScrollView>
    );
 
}

const LoggedInRouths = () => {
	return (
	
			<Drawer.Navigator drawerContent={props => <DrawerComponent {...props} />}>
				<Drawer.Screen name="Home" component={HomePage} />
				<Drawer.Screen name="Profile" component={ProfilePage} />
				<Drawer.Screen name="NewMovingRequestScreen" component={NewMovingRequestScreen} />
			
				<Drawer.Screen name="My Vehicles" component={UserVehicles} />
	


		
			
			</Drawer.Navigator>
	
	)
}

const NotloggedInRouths = () => {
	return (
	
			<Drawer.Navigator drawerContent={props => <DrawerComponent {...props} />}>
				<Drawer.Screen name="Login" component={LoginScreen} />
				<Drawer.Screen name="Register" component={RegisterScreen} />
			</Drawer.Navigator>
		
	)
}

const AuthRouths = () => {
	const { user, removeToken } = useContext(TokenContext);

	return (
		<NavigationContainer >
			<Stack.Navigator screenOptions={{
				headerShown: false
			}}>
{
					user ?
						<Stack.Screen name="loggedin" component={LoggedInRouths} />
						:
						<Stack.Screen name="notloggedin" component={NotloggedInRouths} />
}
			</Stack.Navigator>
		</NavigationContainer>

			
			
		
	)
}

export default function App() {

  return (
    <TokenProvider>
       <PaperProvider theme={theme}>
			  <AuthRouths/>
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
