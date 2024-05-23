import React, { useState } from 'react';
import {  Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PureNativeButton } from 'react-native-gesture-handler';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, {Marker} from 'react-native-maps';
import {Button,} from 'react-native-paper';
import { google_maps_api_key } from '../config/config';
import MapViewDirections from 'react-native-maps-directions';
import DateInput from './DateInput';

function calculateDelta(fromCoor, toCoor) {
  const R = 6371; // Radius of the earth in km
  const lat1 = fromCoor.latitude * Math.PI / 180; // Convert degrees to radians
  const lat2 = toCoor.latitude * Math.PI / 180;
  const lng1 = fromCoor.longitude * Math.PI / 180;
  const lng2 = toCoor.longitude * Math.PI / 180;

  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in km

  return {
      latDelta: dLat * (180 / Math.PI), // Convert radians to degrees
      lngDelta: dLng * (180 / Math.PI)
  };
}


const AddMovingRequest = ({dateState,setLocationFrom,setLocationTo}) => {
    const { width, height } = Dimensions.get('window');
    const ASPECT_RATIO = width / height;
    const [fromAddress, setfromAddress] = useState('');
    const [toAddress, settoAddress] = useState('');

    const [coordinatesFrom, setCoordinatesFrom] = useState(undefined);
    const [coordinatesTo, setCoordinatesTo] = useState(undefined);
    const [latitude, setLatitude] = useState();
    const [longitude, setLongitude] = useState();
    const [latDelta, setLatDelta] = useState();
    const [lngDelta, setLngDelta] = useState();

    const onsubmit = () => {
        setLocationFrom({coor:coordinatesFrom, address: fromAddress});
        setLocationTo({coor:coordinatesTo, address: toAddress})
    }

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
          placeholder='From'
          fetchDetails={true}
          onPress={(data, details = null) => {

            setCoordinatesFrom({latitude: details.geometry.location.lat, longitude: details.geometry.location.lng });
            setfromAddress(data.description);
            setLatitude(details.geometry.location.lat);
            setLongitude(details.geometry.location.lng);
            const northeastLat = parseFloat(details.geometry.viewport.northeast.lat);
            const southwestLat = parseFloat(details.geometry.viewport.southwest.lat);
            setLatDelta( northeastLat - southwestLat);
            setLngDelta(  (northeastLat - southwestLat) * ASPECT_RATIO);
          }}
          query={{
            key: google_maps_api_key,
            language: 'en',
          }}
        />

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
          placeholder='To'
          fetchDetails={true}
          onPress={(data, details = null) => {
            setCoordinatesTo({latitude: details.geometry.location.lat, longitude: details.geometry.location.lng });
            settoAddress(data.description);

            const { latDelta, lngDelta } = calculateDelta(coordinatesFrom, coorTo);
            setLatDelta( latDelta);
            setLngDelta(  lngDelta);

          }}
          query={{
            key: google_maps_api_key,
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
       
    style={{ zIndex:-1, width: Dimensions.get('window').width, height: Dimensions.get('window').height/2}}

       >

     {coordinatesFrom!==undefined &&    <Marker
          coordinate={coordinatesFrom}
          title={"title"}
          description={"description"}
        />}

 {coordinatesTo!==undefined &&     <Marker
          coordinate={coordinatesTo}
          title={"title"}
          description={"description"}
        />}

        {
          (coordinatesFrom!==undefined && coordinatesTo!==undefined) &&
          <MapViewDirections
          origin={coordinatesFrom}
          destination={coordinatesTo}
          apikey={google_maps_api_key}
          strokeWidth={3}
          strokeColor='red'
        />
        }


       </MapView>

       <DateInput dateState={dateState}/>

       <Button 
        onPress={() => onsubmit()}
        mode='contained'
       >Continue</Button>
       
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
