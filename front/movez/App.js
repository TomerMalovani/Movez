import react , {useContext,useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import HomePage from './screens/Home';
import ProfilePage from './screens/Profile';
import MyActivity from './screens/MyActivity';
import MovesRequested from './screens/MovesRequested';
import MovesProvided from './screens/MovesProvided';
import  {  TokenProvider,TokenContext } from './tokenContext';
import { createDrawerNavigator } from '@react-navigation/drawer';
import NewMovingRequestScreen from './screens/NewMovingRequestScreen';
import { MD3LightTheme as DefaultTheme,PaperProvider } from 'react-native-paper';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';



  
const Drawer = createDrawerNavigator();
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
  
  useEffect(() => {

    if(!user){
      props.navigation.navigate('Login');
    }
  }
  ,[user]);

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
          <DrawerItem label="My Activity" onPress={() => props.navigation.navigate('MyActivity')} />
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

export default function App() {
  return (
    <TokenProvider>
       <PaperProvider theme={theme}>
      <NavigationContainer>
      <Drawer.Navigator drawerContent={props => <DrawerComponent {...props} />}>
        <Drawer.Screen name="Home" component={HomePage} />
        <Drawer.Screen name="Profile" component={ProfilePage} />
        <Drawer.Screen name="NewMovingRequestScreen" component={NewMovingRequestScreen} />
        <Drawer.Screen name="MyActivity" component={MyActivity} />
        <Drawer.Screen name="Login" component={LoginScreen} />
        <Drawer.Screen name="Register" component={RegisterScreen} />
        <Drawer.Screen name="MovesRequested" component={MovesRequested} />
        <Drawer.Screen name="MovesProvided" component={MovesProvided} />

      </Drawer.Navigator>
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
