import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import HomePage from './screens/Home';
import ProfilePage from './screens/Profile';
import  {  TokenProvider } from './tokenContext';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator  } from '@react-navigation/native-stack';
import NewMovingRequestScreen from './screens/NewMovingRequestScreen';

const Drawer = createDrawerNavigator();

function DrawerComponent() {
  return (
    <Drawer.Navigator initialRouteName="Start">
      <Drawer.Screen name="Home" component={HomePage} />
      <Drawer.Screen name="Login" component={LoginScreen} />
      <Drawer.Screen name="Register" component={RegisterScreen} />
      <Drawer.Screen name="Profile" component={ProfilePage} />
      {/* other screens */}
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <TokenProvider>
      <NavigationContainer>
      <DrawerComponent/>
      </NavigationContainer>
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
