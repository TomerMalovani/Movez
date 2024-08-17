import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, Image, Modal as RNModal, TouchableOpacity } from 'react-native';
import { Button, Card, Chip, DataTable, Surface, Text, TextInput, ActivityIndicator, Portal, IconButton } from 'react-native-paper';
import { TokenContext } from '../tokenContext';
import { showSingleMoveRequestItems } from '../utils/moveRequest_api_calls';
import { Marker } from 'react-native-maps';
import CustomMapView from '../components/CustomMapView';
import { google_maps_api_key } from '../config/config';
import MapViewDirections from 'react-native-maps-directions';
import ImageViewer from 'react-native-image-zoom-viewer';
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { clientAgreePriceProposal, createPriceProposal, getPriceProposalsByRequest, getPriceProposalsByRequestAndMover, moverAgreePriceProposal, removePriceProposal } from '../utils/api_price_proposals';
import { ToastContext } from '../toastContext';

const SingleMoveRequest = ({ route, navigation}) => {
	const { moveRequest, vehicle} = route.params;
	const { token, myUuid } = useContext(TokenContext);
	const { showError } = useContext(ToastContext);
	const sheetRef = useRef(null);
	const [items, setItems] = useState([]);
	const [moveRequestInfo, setMoveRequestInfo] = useState([]);
	const [isLoaded, setIsLoaded] = useState(false);
	const [price, setPrice] = useState('');
	const [isItMine, setIsItMine] = useState(myUuid === moveRequest.UserID);
	const [myProposal, setMyProposal] = useState(null);
	const [proposals, setProposals] = useState([]);
	const [fullScreenImage, setFullScreenImage] = useState(null);
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

	useEffect(() => {
		console.log("proposals", proposals);
		
	}, [proposals]);

	const handleClientAgree = async (proposalUuid) => {
		// Handle client agree
		const res = await clientAgreePriceProposal(token, proposalUuid);
		const thisPropsal = proposals.find(proposal => proposal.uuid === proposalUuid);
		const updatedProposals = proposals.map(proposal => proposal.uuid === proposalUuid ? { ...proposal, PriceStatus: newStatus } : proposal);
		setProposals([...updatedProposals]);
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
		try{
		const body = {
			RequestID: moveRequest.uuid,
			MoverID: myUuid,
			MovingID: moveRequest.UserID,
			VehicleUUID: vehicle.uuid,
			PriceOffer: price,
			PriceStatus: "Pending"
		};
		const res = await createPriceProposal(token, body);

		console.log("prop res",res.data);
		if(res?.data)
			setMyProposal(res.data.priceProposal);
		// Handle response or state update if needed
		}catch(error){
			console.log(error)
			showError("Error offering price");
		}
	};

	const handleImagePress = (uri) => {
        setFullScreenImage([{ url: uri }]);
    }

    const handleFullScreenImageClose = () => {
        setFullScreenImage(null);
    };

	const removePropsal = async (uuid) => {
		const res = await removePriceProposal(token, uuid);
		const updatedProposals = proposals.filter(proposal => proposal.uuid !== uuid);
		console.log("updatedProposals", updatedProposals)
		setProposals([...updatedProposals]);
		setMyProposal(null);
	};


	const formatDate = (dateString) => {
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		return new Date(dateString).toLocaleDateString(undefined, options);
	};


	const handleMoverFinalAceept = async (proposalUuid) => {
		// Handle client agree
		try{
		const res = await moverAgreePriceProposal(token, proposalUuid);
		console.log("res final", res)
		const thisPropsal = myProposal;
		setMyProposal({ ...thisPropsal, PriceStatus: res.newStatus });
		}
		catch(error){
			console.log(error);
			showError("Error accepting price");
		}
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
							<TouchableOpacity onPress={() => handleImagePress(item.PhotoUrl)}>
                                    <Image source={{ uri: item.PhotoUrl }} style={{ width: 60, height: 60 }} />
                            </TouchableOpacity>
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

										<Button onPress={()=>removePropsal(proposal.uuid)}>Remove</Button>
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
									<Text style={{padding: 5}}>Offer a price?</Text>
									<Text style={{padding: 5}}>Vehicle Using: {vehicle.VehicleType}</Text>
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

													{
														myProposal.PriceStatus === "AcceptedByClient" ? (
															<Button onPress={() => handleMoverFinalAceept(myProposal.uuid)}>Agree</Button>

														) : null
													}
													<Button onPress={() => removePropsal(myProposal.uuid)} >remove</Button>
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
			<Portal>
                <RNModal visible={!!fullScreenImage} onRequestClose={handleFullScreenImageClose} transparent={true}>
                    <>
                        <IconButton
                            icon="close"
                            size={30}
                            color="white"
                            onPress={handleFullScreenImageClose}
                            style={styles.closeButton}
                        />
                        <ImageViewer imageUrls={fullScreenImage} />
                        </>
                </RNModal>
            </Portal>
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
	closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
    },
});

export default SingleMoveRequest;
