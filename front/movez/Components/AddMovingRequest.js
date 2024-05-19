import React, { useState } from 'react';
import { Button, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PureNativeButton } from 'react-native-gesture-handler';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, {Marker} from 'react-native-maps';

const AddMovingRequest = ({setLocation}) => {
    const { width, height } = Dimensions.get('window');
    const ASPECT_RATIO = width / height;
    const [address, setAddress] = useState('');
    const [coordinates, setCoordinates] = useState({latitude: 37.78825, longitude: -122.4324});
    const [latitude, setLatitude] = useState();
    const [longitude, setLongitude] = useState();
    const [latDelta, setLatDelta] = useState();
    const [lngDelta, setLngDelta] = useState();
    return (
        <View >
  
            <View style={{height:50}} >

        <GooglePlacesAutocomplete
          styles={{
            container: {
                flex: 0,
            },
            listView: {
                maxHeight: 200, // Set a maximum height for the dropdown list
            },
        }}
       autoFillOnNotFound
          placeholder='Search'
          fetchDetails={true}
          onPress={(data, details = null) => {
            console.log(details.geometry);

            setCoordinates({latitude: details.geometry.location.lat, longitude: details.geometry.location.lng });
            setAddress(data.description);
            setLatitude(details.geometry.location.lat);
            setLongitude(details.geometry.location.lng);
            const northeastLat = parseFloat(details.geometry.viewport.northeast.lat);
            const southwestLat = parseFloat(details.geometry.viewport.southwest.lat);
            setLatDelta( northeastLat - southwestLat);
            setLngDelta(  (northeastLat - southwestLat) * ASPECT_RATIO);
          }}
          query={{
            key: 'AIzaSyBffe6fU4K0UYRJG6MFue5VM7lxsKphEnM',
            language: 'en',
          }}
        />
        </View>

       <MapView customMapStyle={mapStyle}
        region={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: latDelta,
            longitudeDelta: lngDelta,
        }}
       
    style={{zIndex:-1, width: Dimensions.get('window').width, height: Dimensions.get('window').height/2}}

       >

        <Marker
          coordinate={coordinates}
          title={"title"}
          description={"description"}
        />


       </MapView>

       <Button title='Continue'
        onPress={() => setLocation({latitude: latitude, longitude: longitude, address: address})}
       style={{marginTop: '20px', color: 'red',borderradius: 10, backgroundColor: 'red'}}
       />
       
        </View>
      );
};

const mapStyle = [
    {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
    {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
    {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{color: '#263c3f'}],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{color: '#6b9a76'}],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{color: '#38414e'}],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{color: '#212a37'}],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{color: '#9ca5b3'}],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{color: '#746855'}],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{color: '#1f2835'}],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{color: '#f3d19c'}],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{color: '#2f3948'}],
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{color: '#17263c'}],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{color: '#515c6d'}],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{color: '#17263c'}],
    },
  ];
  const styles = StyleSheet.create({

    searchBar:
    {
        flex: 1,
        border: '20px solid red',
    },

    mapStyle: {
        width: '100%',
        height: '50%',
        border: '5px solid green',

    },
  });

export default AddMovingRequest;