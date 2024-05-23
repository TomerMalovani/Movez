import AsyncStorage from '@react-native-async-storage/async-storage';


export const _storeStorage = async (value,key) => {
    try {
      await AsyncStorage.setItem(
        key,
        value,
      );
    } catch (error) {
      console.log(error)
    }
  };

export const  _retrieveStorage = async (key) => {
    try {
  
      const value = await AsyncStorage.getItem(key);
      if (value) {
        // We have data!!
        console.log("retrivetoken",value);
        return value;
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  export const _removeToken = async (key) => {
    try {
  
      const value = await AsyncStorage.removeItem(key);
      console.log("key",key,"removed")
    } catch (error) {
      console.log(error);
      // Error retrieving data
    }
  };