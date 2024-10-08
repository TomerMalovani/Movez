import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, Image, Modal as RNModal, TouchableOpacity } from 'react-native';
import { Button, Card, Chip, DataTable, Surface, Text, TextInput, ActivityIndicator, Portal, IconButton } from 'react-native-paper';
import { TokenContext } from '../tokenContext';
import { showSingleMoveRequestItems, updateRequestStatus } from '../utils/moveRequest_api_calls';
import { getProfileByID } from '../utils/user_api_calls';
import { Marker } from 'react-native-maps';
import CustomMapView from '../components/CustomMapView';
import { google_maps_api_key } from '../config/config';
import MapViewDirections from 'react-native-maps-directions';
import FullScreenImageModal from '../components/FullScreenImageModal';
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { clientAgreePriceProposal, clientCancelPriceProposal, createPriceProposal, getPriceProposalsByRequest, getPriceProposalsByRequestAndMover, moverAgreePriceProposal, removePriceProposal } from '../utils/api_price_proposals';
import { ToastContext } from '../toastContext';

const SingleMoveRequest = ({ route, navigation}) => {
	const { moveRequest, vehicle} = route.params;
	const { token, myUuid } = useContext(TokenContext);
	const { showError } = useContext(ToastContext);
	const sheetRef = useRef(null);
	const [items, setItems] = useState([]);
	const [moveRequestInfo, setMoveRequestInfo] = useState([]);
	const [requesterName, setRequesterName] = useState('');
	const [isLoaded, setIsLoaded] = useState(false);
	const [price, setPrice] = useState('');
	const [isItMine, setIsItMine] = useState(myUuid === moveRequest.UserID);
	const [myProposal, setMyProposal] = useState(null);//mover
	const [proposals, setProposals] = useState([]);//client
	const [acceptedProposalUuid, setAcceptedProposalUuid] = useState(null);
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
		console.log("fresh",isItMine)
		fetchItems();
		const moveRequestInfoObj = [
			{ icon: 'clock-time-nine', title: 'Move Date', info: formatDate(moveRequest.moveDate) },
			{ icon: 'map-marker-distance', title: 'Distance', info: `${parseFloat(moveRequest.distance).toFixed(2)} KM` }
		];
		setMoveRequestInfo(moveRequestInfoObj);
		fetchRequesterName();
	}, []);


	const handleClientAgree = async (proposalUuid) => {
        try {
            const statusChanged = await clientAgreePriceProposal(token, proposalUuid);
			console.log("status changed: ", statusChanged);
			const updatedProposals = proposals.map(proposal =>
				proposal.uuid === proposalUuid
					? { ...proposal, PriceStatus: 'AcceptedByClient' }
					: { ...proposal, PriceStatus: 'Pending' }
			);
	
			setProposals(updatedProposals);
			setAcceptedProposalUuid(proposalUuid);
        } catch (error) {
            console.log(error);
            showError("Error accepting price");
        }
    };

	const fetchRequesterName = async () => {
        try {
            const userData = await getProfileByID(token, moveRequest.UserID);
			console.log("profile of requester: ", userData);
            setRequesterName(userData.username);
        } catch (error) {
            console.log(error);
            showError("Error fetching requester name");
        }
    };


	const handleClientCancel = async () => {
		try {
			const statusChanged = await clientCancelPriceProposal(token, acceptedProposalUuid);
			console.log("statusChanged", statusChanged);			
			// Update the proposals state
			const updatedProposals = proposals.map(proposal =>
				proposal.uuid === acceptedProposalUuid
					? { ...proposal, PriceStatus: 'Pending' }
					: proposal
			);
	
			setProposals(updatedProposals);
			setAcceptedProposalUuid(null);
		} catch (error) {
			console.log(error);
			showError("Error canceling proposal");
		}
	};
	

	const priceStatusNames = (status) => {
		switch (status) {
			case "Pending":
				return "Pending";
			case "Accepted":
				return "Accepted";
			case "Declined":
				return "Declined";
			case "AcceptedByClient":
				return "Accepted by client";
			default:
				return status;
		}
	}

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
				console.log("my proposals get")
				const proposalsData = await getPriceProposalsByRequest(token, moveRequest.uuid);
				console.log("my proposals", proposalsData[0].provider)
				setProposals(proposalsData);
				  const acceptedProposal = proposalsData.find(proposal => proposal.PriceStatus === 'AcceptedByClient');
				  if (acceptedProposal) {
					  setAcceptedProposalUuid(acceptedProposal.uuid);
				  }
				console.log("check proposals: ", proposalsData);
				console.log("check uuid: ", acceptedProposalUuid);
			} else {
				const proposal = await getPriceProposalsByRequestAndMover(token, moveRequest.uuid, myUuid);
				setMyProposal(proposal);
				console.log("check proposals: ", proposal);
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
		try{
		const res = await moverAgreePriceProposal(token, proposalUuid);
		console.log("res final", res)
		const thisPropsal = myProposal;
		setMyProposal({ ...thisPropsal, PriceStatus: res.newStatus });
		console.log("proposal status after mover agree, ", thisPropsal);
        await updateRequestStatus(token, thisPropsal.RequestID, res.newStatus);
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
                            <ItemsTable />
                            <ScrollView>
								{proposals.map((proposal, index) => (
									<Card 
										key={index} 
										style={{
											backgroundColor: 
												proposal.PriceStatus === "Accepted" || proposal.PriceStatus === "AcceptedByClient" 
												? acceptedProposalUuid === proposal.uuid ? "#00FF00" : "white"
												: "white"
										}}
									>
										<Card.Title
											title={
												<TouchableOpacity onPress={() => navigation.navigate('Profile', { userId: proposal.MoverID })}>
													<Text style={styles.name}>{proposal.provider.username}</Text>
												</TouchableOpacity>
											}
										/>
										<Card.Content>
											<Text>Current price offer: {proposal.PriceOffer}₪</Text>
											<Text>Status: {priceStatusNames(proposal.PriceStatus)}</Text>
										</Card.Content>
										<Card.Actions>
											{proposal.PriceStatus === "Pending" && !acceptedProposalUuid && (
												<Button onPress={() => handleClientAgree(proposal.uuid)}>Accept</Button>
											)}
											{proposal.PriceStatus === "AcceptedByClient" && acceptedProposalUuid === proposal.uuid && (
												<Button onPress={handleClientCancel}>Cancel</Button>
											)}
											{proposal.PriceStatus === "Pending" && (
												<Button onPress={() => removePropsal(proposal.uuid)}>Remove</Button>
											)}
										</Card.Actions>
									</Card>
								))}
							</ScrollView>

                        </>
                    ) : (
                        <>
                            {!myProposal ? (
								<>
									<ItemsTable />
									<View style={styles.offerPriceContainer}>
										<Text style={styles.offerPriceText}>Offer a price to</Text>
										<TouchableOpacity onPress={() => navigation.navigate('Profile', { userId: moveRequest.UserID })}>
											<Text style={styles.name}>{requesterName}</Text>
										</TouchableOpacity>
									</View>
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
                                    <ItemsTable />
                                    <Text>My Proposal</Text>
                                    <Card>
										<Card.Actions>
											{myProposal.PriceStatus === "AcceptedByClient" ? (
												<Button onPress={() => handleMoverFinalAceept(myProposal.uuid)}>Agree</Button>
											) : null}
											{myProposal.PriceStatus !== "Accepted" && (
												<Button onPress={() => removePropsal(myProposal.uuid)}>Remove</Button>
											)}
										</Card.Actions>
                                        <Card.Content>
                                            <Text>Price: {myProposal.PriceOffer}₪</Text>
                                            <Text>Status: {priceStatusNames(myProposal.PriceStatus)}</Text>
                                        </Card.Content>
                                    </Card>
                                </>
                            )}
                        </>
                    )}
                </BottomSheetScrollView>
            </BottomSheet>
			<FullScreenImageModal
				visible={!!fullScreenImage}
				imageUrls={fullScreenImage}
				onClose={handleFullScreenImageClose}
			/>
        </Surface>
    );
};

const styles = StyleSheet.create({
	container: {
        padding: 16,
        // Adjust container styles if necessary
    },
    requesterName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10, // Ensure there's space below the requesterName
    },
    offerButton: {
        backgroundColor: '#007BFF', // Example color for the button
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
	offerPriceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10, // Adjust the vertical margin as needed
    },
    offerPriceText: {
        marginRight: 5, // Adjust the spacing between the text and the user name
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
	name: {
		color: 'blue',
		textDecorationLine: 'underline',
	},
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