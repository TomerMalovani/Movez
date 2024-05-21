import react , {useContext} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import HomePage from './screens/Home';
import ProfilePage from './screens/Profile';
import  {  TokenProvider,TokenContext } from './tokenContext';
import { createDrawerNavigator } from '@react-navigation/drawer';
import NewMovingRequestScreen from './screens/NewMovingRequestScreen';
import { MD3LightTheme as DefaultTheme,PaperProvider } from 'react-native-paper';
const Drawer = createDrawerNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    secondary: 'yellow',
  },
};

function DrawerComponent() {
  const {user } = useContext(TokenContext);

  if(user){
    return (
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomePage} />
        <Drawer.Screen name="Profile" component={ProfilePage} />
        <Drawer.Screen name="NewMovingRequestScreen" component={NewMovingRequestScreen} />
        {/* other screens */}
      </Drawer.Navigator>
    );
  }
  else{
    return (
      <Drawer.Navigator initialRouteName="Login">
        <Drawer.Screen name="Login" component={LoginScreen} />
        <Drawer.Screen name="Register" component={RegisterScreen} />
        {/* other screens */}
      </Drawer.Navigator>
    );
  }
}

export default function App() {
  return (
    <TokenProvider>
       <PaperProvider theme={theme}>
      <NavigationContainer>
      <DrawerComponent/>
      </NavigationContainer>
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
