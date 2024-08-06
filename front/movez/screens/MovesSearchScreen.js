import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, Alert, Text, ScrollView } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph, Portal, Modal, TouchableRipple, Avatar, RadioButton } from 'react-native-paper';
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
			// "Depth": "10.00", "Height": "15.00", "MoverID": "736bad7e-05c6-4a09-8a56-06e847ea6255", "VehicleType": "cool", "Width": "10.00"}
			name : 'Vehicle Type',
			selector: 'VehicleType',
		}
		,
		{
			name : 'Depth',
			selector: 'Depth',
		},
		{
			name : 'Width',
			selector: 'Width',
		},
		{
			name : 'Height',
			selector: 'Height',
		}
	]


	// useEffect(() => {

	// }, []);
	const handlePhotoClick = (url) => {
		setFullScreenImage(url);
	};

	const handleFullScreenImageClose = () => {
        setFullScreenImage(null);
    };

	const handleVehicleChoose = async () => {
		const userVehicles = await getAllVehicles(token);
		setUserVehicles(userVehicles);
		if(userVehicles.length === 0){
			Alert.alert("You don't have any vehicles, please add one to continue")
		}
		else{
			setIsModalVisible(true);
		}
	};

	const handleVehicleSelected = (vehicle) => {
		setSelectedVehicle(vehicle);
		setIsModalVisible(false);
	};

	const handleSearch = async () => {
		console.log("vehicleUUID: " , selectedVehicle.uuid, " isUsingAlgorithm: ", isUsingAlgorithm)
		const res = await searchMoveRequest(token, location.latitude, location.longitude, radius, selectedVehicle.uuid, isUsingAlgorithm);
		console.log("res",res)
		setResults(res)
	};
//TODO: add vehicle to search
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
			<>
			{selectedVehicle ? (
				<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: 10 }}>
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
						<Text style={{ fontSize: 16, marginLeft: 8 }}>{selectedVehicle.VehicleType}</Text>
					</View>
					<Button mode="contained" onPress={() => setIsModalVisible(true)}>
						Change Vehicle
					</Button>
				</View>
			) : (
				<Button mode="contained" onPress={handleVehicleChoose} style={{ marginBottom: 16 }}>
					Choose Vehicle
				</Button>
			)}
			</>
			<Portal>
				<Modal visible={isModalVisible} onDismiss={() => setIsModalVisible(false)} contentContainerStyle={{padding: 20}}>
					<View>
					{userVehicles.map((vehicle, index) => (
						<TouchableRipple 
							key={index + vehicle.uuid} 
							onPress={() => handleVehicleSelected(vehicle)} 
							style={{marginBottom: 10}}
						>
							<Card>
								<Card.Title title="Vehicle Information" />
								{vehicle.PhotoUrl ? (
									<View style={{ paddingLeft: 16 }}>
										<Avatar.Image 
										size={40} 
										source={{ uri: vehicle.PhotoUrl }}
										onPress={() => handlePhotoClick(vehicle.PhotoUrl)}/>
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
					</View>
				</Modal>
			</Portal>
			<RadioButton.Group onValueChange={value => setIsUsingAlgorithm(value)} value={isUsingAlgorithm}>
				<RadioButton.Item
					label="Use Algorithm"
					value="true"
					style={{ flexDirection: 'row-reverse', alignSelf: 'flex-start' }}
					//status={ isUsingAlgorithm === 'true' ? 'checked' : 'unchecked' }
					//onPress={() => setIsUsingAlgorithm('true')}
				/>
				<RadioButton.Item
					label="Search for any result"
					value="false"
					style={{ flexDirection: 'row-reverse', alignSelf: 'flex-start' }}
					//status={ isUsingAlgorithm === 'false' ? 'checked' : 'unchecked' }
					//onPress={() => setIsUsingAlgorithm('false')}
				/>
			</RadioButton.Group>
			<Button mode="contained" 
			onPress={handleSearch} 
			style={{ marginBottom: 16 }}
			disabled={!selectedVehicle || !location || !radius}
			>
				Search
			</Button>
			<FlatList
				data={results}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item: moveRequest }) => (
					<Card  style={{ marginBottom: 16 }}>
						<Card.Content>
							<Card.Actions>
								<Button onPress={() => navigation.navigate('SingleMoveRequest', { moveRequest: moveRequest, vehicle: selectedVehicle})}>View</Button>
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
			<FullScreenImageModal 
                visible={!!fullScreenImage} 
                imageUrls={fullScreenImage} 
                onClose={handleFullScreenImageClose} 
            />
		</View>
	);
};


export default MovesSearchScreen;
