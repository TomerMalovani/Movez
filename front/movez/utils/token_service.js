import {AsyncStorage} from 'react-native';


export const _storeToken = async (token) => {
    try {
      await AsyncStorage.setItem(
        'token',
        token,
      );
    } catch (error) {
      console.log(error)
    }
  };

export const  _retrieveToken = async () => {
    try {
      const value = await AsyncStorage.getItem('TASKS');
      if (value !== null) {
        // We have data!!
        console.log(value);
      }
    } catch (error) {
      // Error retrieving data
    }
  };