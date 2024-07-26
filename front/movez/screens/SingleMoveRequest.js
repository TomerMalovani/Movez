import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, DataTable, Surface, Text, TextInput, ActivityIndicator } from 'react-native-paper';
import { TokenContext } from '../tokenContext';
import { showSingleMoveRequestItems } from '../utils/moveRequest_api_calls';
import { Marker } from 'react-native-maps';
import CustomMapView from '../Components/CustomMapView';
import { google_maps_api_key } from '../config/config';
import MapViewDirections from 'react-native-maps-directions';
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { clientAgreePriceProposal, createPriceProposal, getPriceProposalsByRequest, getPriceProposalsByRequestAndMover, moverAgreePriceProposal } from '../utils/api_price_proposals';

const SingleMoveRequest = ({ route, navigation }) => {
	const { moveRequest } = route.params;
	const { token, myUuid } = useContext(TokenContext);
	const sheetRef = useRef(null);
	const [items, setItems] = useState([]);
	const [moveRequestInfo, setMoveRequestInfo] = useState([]);
	const [isLoaded, setIsLoaded] = useState(false);
	const [price, setPrice] = useState('');
	const [isItMine, setIsItMine] = useState(myUuid === moveRequest.UserID);
	const [myProposal, setMyProposal] = useState(null);
	const [proposals, setProposals] = useState([]);
	const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

	const tableInputs = [
		{ title: 'Item', value: 'ItemDescription' },
		{ title: 'Depth', value: 'Depth' },
		{ title: 'Height', value: 'Height' },
		{ title: 'Width', value: 'Width' },
		{ title: 'Weight', value: 'Weight' }
	];

	useEffect(() => {
		fetchItems();
		const moveRequestInfoObj = [
			{ icon: 'clock-time-nine', title: 'Move Date', info: formatDate(moveRequest.moveDate) },
			{ icon: 'map-marker-distance', title: 'Distance', info: `${parseFloat(moveRequest.distance).toFixed(2)} KM` }
		];
		setMoveRequestInfo(moveRequestInfoObj);
	}, []);

	const handleClientAgree = async (proposalUuid) => {
		// Handle client agree
		const res = await clientAgreePriceProposal(token, proposalUuid);
		const thisPropsal = proposals.find(proposal => proposal.uuid === proposalUuid);
		const updatedProposals = proposals.map(proposal => proposal.uuid === proposalUuid ? { ...proposal, PriceStatus: newStatus } : proposal);
		setProposals(updatedProposals);


	};


	const handleMoverAgree = async (proposalUuid) => {
		const res = await moverAgreePriceProposal(token, proposalUuid);
		const thisPropsal = myProposal;
		setMyProposal({ ...thisPropsal, PriceStatus: res.newStatus });

		
		// Handle client agree
	};


	const fetchItems = async () => {
		try {
			setIsLoaded(true);
			const data = await showSingleMoveRequestItems(token, moveRequest.uuid);
			setItems(data);
			if (isItMine) {
				const proposalsData = await getPriceProposalsByRequest(token, moveRequest.uuid);
				console.log("my proposals", proposalsData[0].provider)
				setProposals(proposalsData);
			} else {
				const proposal = await getPriceProposalsByRequestAndMover(token, moveRequest.uuid, myUuid);
				setMyProposal(proposal);
			}
			setIsLoaded(false);
		} catch (error) {
			console.log(error);
			setIsLoaded(false);
		}
	};

	const handleOfferPrice = async () => {
		const body = {
			RequestID: moveRequest.uuid,
			MoverID: myUuid,
			MovingID: moveRequest.UserID,
			EstimatedCost: price,
			PriceStatus: "Pending"
		};
		const res = await createPriceProposal(token, body);
		// Handle response or state update if needed
	};

	const formatDate = (dateString) => {
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	const ItemsTable = () => {
		return (
			<DataTable>
				<DataTable.Header>
					{tableInputs.map((header, index) => (
						<DataTable.Title key={index}>{header.title}</DataTable.Title>
					))}
				</DataTable.Header>
				{items.map((item, index) => (
					<View key={index}>
						<DataTable.Row>
							{tableInputs.map((header, i) => (
								<DataTable.Cell key={i}>{item[header.value]}</DataTable.Cell>
							))}
						</DataTable.Row>
						{item.PhotoUrl ? (
							<Image source={{ uri: item.PhotoUrl }} style={{ width: 50, height: 50 }} />
						) : null}
					</View>
				))}
			</DataTable>
		);
	}

	return (
		<Surface style={{ flex: 1 }}>
			<Text variant="bodyMedium" style={styles.text}>{`From: ${moveRequest.fromAddress}`}</Text>
			<Text variant="bodyMedium" style={styles.text}>{`To: ${moveRequest.toAddress}`}</Text>
			<View style={{ flex: 1 }}>
				<CustomMapView region={{
					latitude: moveRequest.moveFromCoor.coordinates[1],
					longitude: moveRequest.moveFromCoor.coordinates[0],
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421
				}}>
					<Marker coordinate={{ latitude: moveRequest.moveFromCoor.coordinates[1], longitude: moveRequest.moveFromCoor.coordinates[0] }} title="From" />
					<Marker coordinate={{ latitude: moveRequest.moveToCoor.coordinates[1], longitude: moveRequest.moveToCoor.coordinates[0] }} title="To" />
					<MapViewDirections
						origin={{ latitude: moveRequest.moveFromCoor.coordinates[1], longitude: moveRequest.moveFromCoor.coordinates[0] }}
						destination={{ latitude: moveRequest.moveToCoor.coordinates[1], longitude: moveRequest.moveToCoor.coordinates[0] }}
						apikey={google_maps_api_key}
						strokeWidth={3}
						strokeColor='red'
					/>
				</CustomMapView>
			</View>
			<BottomSheet ref={sheetRef} index={1} snapPoints={snapPoints}>
				<BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
					{isItMine ? (
						<>
							<ItemsTable/>
							<ScrollView>
							{proposals.map((proposal, index) => (
								<Card key={index}>
									<Card.Title title={proposal.provider.username} />
								
									<Card.Content>
										<Text>Current price offer: {proposal.EstimatedCost}</Text>
										<Text>Status: {proposal.PriceStatus}</Text>
									</Card.Content>
									<Card.Actions>
										<Button onPress={() => handleClientAgree(proposal.uuid)} >Accept</Button>
										<Button>Decline</Button>
										<Button>Negotiate</Button>
									</Card.Actions>
								</Card>
								
							))}
							</ScrollView>
						</>
					) : (
						<>
							{!myProposal ? (
								<>
										<ItemsTable/>
									<Text>Offer a price?</Text>
									<TextInput
										keyboardType="numeric"
										label="Price"
										value={price}
										onChangeText={text => setPrice(text)}
									/>
									<Button mode="contained" onPress={handleOfferPrice}>Offer</Button>
								</>
							) : (
								<>
											<ItemsTable/>
									<Text>Your proposal</Text>
									<Card>
										<Card.Actions>
													<Button onPress={() => moverAgreePriceProposal(myProposal.uuid)}>Agree</Button>
											<Button>Negotiate</Button>
										</Card.Actions>
										<Card.Content>
											<Text>{myProposal.EstimatedCost}</Text>
											<Text>{myProposal.PriceStatus}</Text>
										</Card.Content>
									</Card>
								</>
							)}
						</>
					)}
				</BottomSheetScrollView>
			</BottomSheet>
		</Surface>
	);
};

const styles = StyleSheet.create({
	text: {
		textAlign: "center",
		borderWidth: 1,
	},
	contentContainer: {
		backgroundColor: "white",
	},
});

export default SingleMoveRequest;
