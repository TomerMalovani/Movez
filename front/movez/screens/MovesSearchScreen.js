import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Card, Paragraph, Portal, Modal, TouchableRipple, Avatar, RadioButton, Surface, Text } from 'react-native-paper';
import { TokenContext } from '../tokenContext';
import { getAllVehicles } from '../utils/vehicle_api_calls';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { google_maps_api_key } from '../config/config';
import { searchMoveRequest } from '../utils/moveRequest_api_calls';
import FullScreenImageModal from '../components/FullScreenImageModal';

const MovesSearchScreen = ({ navigation }) => {
	const [location, setLocation] = useState();
	const [radius, setRadius] = useState('');
	const [userVehicles, setUserVehicles] = useState([]);
	const [selectedVehicle, setSelectedVehicle] = useState(null);
	const [results, setResults] = useState([]);
	const { token } = useContext(TokenContext);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isUsingAlgorithm, setIsUsingAlgorithm] = useState(true);
	const [fullScreenImage, setFullScreenImage] = useState(null);

	const columns = [
		{
			name: 'Vehicle Type',
			selector: 'VehicleType',
		},
		{
			name: 'Vehicle Model',
			selector: 'VehicleModel',
		},
		{
			name: 'Depth',
			selector: 'Depth',
		},
		{
			name: 'Width',
			selector: 'Width',
		},
		{
			name: 'Height',
			selector: 'Height',
		},
	];

	const handlePhotoClick = (url) => {
		setFullScreenImage(url);
	};

	const handleFullScreenImageClose = () => {
		setFullScreenImage(null);
	};

	const handleVehicleChoose = async () => {
		const userVehicles = await getAllVehicles(token);
		setUserVehicles(userVehicles);
		
		if (userVehicles.length === 0) {
		  Alert.alert(
			"No Vehicles Found",
			"You don't have any vehicles, would you like to create one?",
			[
			  {
				text: "No",
				onPress: () => console.log("Stay on the same page"),
				style: "cancel",
			  },
			  {
				text: "Yes",
				onPress: () => {
				  // Replace 'UserVehicles' with your navigation route or logic to go to the create vehicle page
				  navigation.navigate('UserVehicles'); 
				},
			  },
			],
			{ cancelable: false }
		  );
		} else {
		  setIsModalVisible(true);
		}
	  };

	const handleVehicleSelected = (vehicle) => {
		setSelectedVehicle(vehicle);
		setIsModalVisible(false);
	};
	const handleSearch = async () => {
		console.log("vehicleUUID: ", selectedVehicle.uuid, " isUsingAlgorithm: ", isUsingAlgorithm);
		const res = await searchMoveRequest(token, location.latitude, location.longitude, radius, selectedVehicle.uuid, isUsingAlgorithm);
		console.log("res", res);
		setResults(res);
	};

	return (
		<Surface style={{ flex: 1, padding: 16 }}>
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
				placeholder='Location'
				fetchDetails={true}
				onPress={(data, details) => {
					console.log("4747", details);
					setLocation({ latitude: details.geometry.location.lat, longitude: details.geometry.location.lng });
				}}
				query={{
					key: google_maps_api_key,
					language: 'en',
				}}
			/>
			<TextInput
				label="Radius (in meters)"
				value={radius}
				onChangeText={text => setRadius(text)}
				style={{ marginBottom: 16 }}
				mode="outlined"
			/>

			{selectedVehicle ? (
				<Surface style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: 8 }}>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						{selectedVehicle.PhotoUrl ? (
							<Avatar.Image
								size={50}
								source={{ uri: selectedVehicle.PhotoUrl }}
								onPress={() => handlePhotoClick(selectedVehicle.PhotoUrl)}
							/>
						) : (
							<Avatar.Icon
								size={50}
								icon="car"
								onPress={() => setIsModalVisible(true)}
							/>
						)}
						<View style={{ marginLeft: 8 }}>
							<Text variant="bodyLarge">{`Vehicle Type: ${selectedVehicle.VehicleType}`}</Text>
							<Text variant="bodyLarge" style={{ marginTop: 4 }}>{`Vehicle Model: ${selectedVehicle.VehicleModel}`}</Text>
						</View>
					</View>
					<Button mode="contained" onPress={() => setIsModalVisible(true)} style={{ marginLeft: 30 }}>
						Change Vehicle
					</Button>
				</Surface>
			) : (
				<Button mode="contained" onPress={handleVehicleChoose} style={{ marginBottom: 16 }}>
					Choose Vehicle
				</Button>
			)}

			<Portal>
				<Modal visible={isModalVisible} onDismiss={() => setIsModalVisible(false)} contentContainerStyle={{ padding: 20 }}>
					<ScrollView>
						{userVehicles.map((vehicle, index) => (
							<TouchableRipple
								key={index + vehicle.uuid}
								onPress={() => handleVehicleSelected(vehicle)}
								style={{ marginBottom: 10 }}
							>
								<Card>
									<Card.Title title="Vehicle Information" />
									{vehicle.PhotoUrl ? (
										<View style={{ paddingLeft: 16 }}>
											<Avatar.Image
												size={40}
												source={{ uri: vehicle.PhotoUrl }}
												onPress={() => handlePhotoClick(vehicle.PhotoUrl)}
											/>
										</View>
									) : (
										<View style={{ paddingLeft: 16 }}>
											<Avatar.Icon size={40} icon="car" />
										</View>
									)}
									<Card.Content>
										{columns.map((column) => (
											<Paragraph key={index + column.selector}>
												{column.name}: {vehicle[column.selector]}
											</Paragraph>
										))}
									</Card.Content>
								</Card>
							</TouchableRipple>
						))}
					</ScrollView>
				</Modal>
			</Portal>

			<RadioButton.Group onValueChange={value => setIsUsingAlgorithm(value)} value={isUsingAlgorithm}>
				<RadioButton.Item
					label="Use Algorithm"
					value="true"
					style={{ flexDirection: 'row-reverse', alignSelf: 'flex-start' }}
				/>
				<RadioButton.Item
					label="Search for any result"
					value="false"
					style={{ flexDirection: 'row-reverse', alignSelf: 'flex-start' }}
				/>
			</RadioButton.Group>

			<Button
				mode="contained"
				onPress={handleSearch}
				style={{ marginBottom: 16 }}
				disabled={!selectedVehicle || !location || !radius}
			>
				Search
			</Button>

			<FlatList
				data={results}
				keyExtractor={(item, index) => index.toString()}
				contentContainerStyle={{ paddingBottom: 16 }}
				renderItem={({ item: moveRequest }) => (
					<Card style={{ marginBottom: 16 }}>
						<Card.Content>
							<Card.Actions>
								<Button onPress={() => navigation.navigate('SingleMoveRequest', { moveRequest: moveRequest, vehicle: selectedVehicle})}>View</Button>
								<Button onPress={() => navigation.navigate('Chat', {  moveRequest:moveRequest.uuid})}>Chat</Button>
							</Card.Actions>
							<Paragraph>{`Distance: ${moveRequest.distance}`}</Paragraph>
							<Paragraph>{`From: ${moveRequest.fromAddress}`}</Paragraph>
							<Paragraph>{`To: ${moveRequest.toAddress}`}</Paragraph>
							<Paragraph>{`Date: ${moveRequest.moveDate}`}</Paragraph>
						</Card.Content>
					</Card>
				)}
			/>

			<FullScreenImageModal
				visible={!!fullScreenImage}
				imageUrls={fullScreenImage}
				onClose={handleFullScreenImageClose}
			/>
		</Surface>
	);
};

export default MovesSearchScreen;
