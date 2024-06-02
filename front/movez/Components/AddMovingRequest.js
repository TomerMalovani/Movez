import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PureNativeButton } from 'react-native-gesture-handler';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker } from 'react-native-maps';
import { Button, HelperText } from 'react-native-paper';
import { google_maps_api_key } from '../config/config';
import MapViewDirections from 'react-native-maps-directions';
import DateInput from './DateInput';
import CustomMapView from './CustomMapView';
import { calculateDelta } from '../utils/calculateDelta';


const AddMovingRequest = ({ dateState, setLocationFrom, setLocationTo }) => {
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
		setLocationFrom({ coor: coordinatesFrom, address: fromAddress });
		setLocationTo({ coor: coordinatesTo, address: toAddress })
	}


	return (
		<View style={{ height: '100%' }}>



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

					setCoordinatesFrom({ latitude: details.geometry.location.lat, longitude: details.geometry.location.lng });
					setfromAddress(data.description);
					setLatitude(details.geometry.location.lat);
					setLongitude(details.geometry.location.lng);
					const northeastLat = parseFloat(details.geometry.viewport.northeast.lat);
					const southwestLat = parseFloat(details.geometry.viewport.southwest.lat);
					setLatDelta(northeastLat - southwestLat);
					setLngDelta((northeastLat - southwestLat) * ASPECT_RATIO);
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
					setCoordinatesTo({ latitude: details.geometry.location.lat, longitude: details.geometry.location.lng });
					settoAddress(data.description);
					const coorTo = { latitude: details.geometry.location.lat, longitude: details.geometry.location.lng }
					const { latDelta, lngDelta } = calculateDelta(coordinatesFrom, coorTo);
					setLatDelta(latDelta);
					setLngDelta(lngDelta);

				}}
				query={{
					key: google_maps_api_key,
					language: 'en',
				}}
			/>

			<CustomMapView
				region={{
					latitude: latitude,
					longitude: longitude,
					latitudeDelta: latDelta,
					longitudeDelta: lngDelta,
				}}


			>

				{coordinatesFrom !== undefined && <Marker
					coordinate={coordinatesFrom}
					title={"title"}
					description={"description"}
				/>}

				{coordinatesTo !== undefined && <Marker
					coordinate={coordinatesTo}
					title={"title"}
					description={"description"}
				/>}

				{
					(coordinatesFrom !== undefined && coordinatesTo !== undefined) &&
					<MapViewDirections
						origin={coordinatesFrom}
						destination={coordinatesTo}
						apikey={google_maps_api_key}
						strokeWidth={3}
						strokeColor='red'
					/>
				}


			</CustomMapView>

			<View style={{ height: '40%', borderWidth: 2, marginTop: 0 }}>
				<DateInput dateState={dateState} />

				<Button
					onPress={() => onsubmit()}
					mode='contained'
					disabled={!coordinatesFrom || !coordinatesTo}
				>Continue</Button>
			</View>
		</View>
	);
};


export default AddMovingRequest;
