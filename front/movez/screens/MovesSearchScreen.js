import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph } from 'react-native-paper';
import axios from 'axios';
import { TokenContext } from '../tokenContext';
import { getAllVehicles } from '../utils/vehicle_api_calls';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { google_maps_api_key } from '../config/config';
import { searchMoveRequest } from '../utils/moveRequest_api_calls';

const MovesSearchScreen = ({ navigation }) => {
	const [location, setLocation] = useState();
	const [radius, setRadius] = useState('');
	const [vehicle, setVehicle] = useState([]);
	const [results, setResults] = useState([]);
	const { token } = useContext(TokenContext);



	// useEffect(() => {

	// }, []);

	const handleSearch = async () => {
		const res = await searchMoveRequest(token, location.latitude, location.longitude, radius)
		console.log("res",res)
		setResults(res)
	
	};

	return (
		<View style={{ padding: 16 }}>

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
				onPress={(data, details ) => {
					console.log("4747", details);
					setLocation({ latitude: details.geometry.location.lat, longitude: details.geometry.location.lng })
				}}
				query={{
					key: google_maps_api_key,
					language: 'en',
				}}
			/>
			<TextInput
				label="Radius"
				value={radius}
				onChangeText={text => setRadius(text)}
				style={{ marginBottom: 16 }}
			/>
			{/* <TextInput
				label="Vehicle"
				value={vehicle}
				onChangeText={text => setVehicle(text)}
				style={{ marginBottom: 16 }}
			/> */}
			<Button mode="contained" onPress={handleSearch} style={{ marginBottom: 16 }}>
				Search
			</Button>

			<FlatList
				data={results}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item: moveRequest }) => (
					<Card  style={{ marginBottom: 16 }}>
						<Card.Content>
							<Card.Actions>
								<Button onPress={() => navigation.navigate('SingleMoveRequest', { moveRequest: moveRequest })}>View</Button>
							</Card.Actions>
							{/* <Title>{`req No.${item.reqNo}`}</Title> */}
							<Paragraph>{`distance: ${moveRequest.distance}`}</Paragraph>
							<Paragraph>{`From: ${moveRequest.fromAddress}`}</Paragraph>
							<Paragraph>{`To: ${moveRequest.toAddress}`}</Paragraph>
							<Paragraph>{`Date: ${moveRequest.moveDate}`}</Paragraph>
						</Card.Content>
					</Card>
				)}
			/>
		</View>
	);
};

export default MovesSearchScreen;
