import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text, Card, Title, Paragraph, TouchableRipple, IconButton } from 'react-native-paper';
import { getPriceProposalForProvider } from '../utils/api_price_proposals';
import { getVehicleByVehicleUUID } from '../utils/vehicle_api_calls';
import { getProfileByID } from '../utils/user_api_calls';
import { TokenContext } from '../tokenContext';
import { ToastContext } from '../toastContext';

const MoveProvidingList = ({ navigation, filterStatus, selectedVehicle }) => {
    console.log("Props received in MoveProvidingList.js:", { navigation, filterStatus, selectedVehicle }); // Add this line
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
	const {showError, showSuccess} = useContext(ToastContext);
    const { token, myUuid } = useContext(TokenContext);
    const [requesterName, setRequesterName] = useState('');


    const fetchProposals = async () => {
        try {
            console.log("Move Providing List - try fetching price proposals for provider");
            const data = await getPriceProposalForProvider(token, myUuid);
            console.log("MoveProvidingList - Provided moves data:", data); // Log API response for debugging
    
            if (data && Array.isArray(data)) {
                const filteredData = data.filter(proposal => proposal.request && filterStatus.includes(proposal.request.moveStatus));

                const requesterIds = filteredData.map(proposal => proposal.MovingID);
    
                console.log("Requester IDs to fetch:", requesterIds);

                // Fetch requester names in bulk
                const requesterData = await Promise.all(
                    requesterIds.map(id => getProfileByID (token, id))
                );
    
                console.log("Requester data fetched:", requesterData);

                const requesterMap = requesterData.reduce((map, user) => {
                    map[user.uuid] = user.username;
                    return map;
                }, {});
    
                console.log("Requester map:", requesterMap);

                // Add requester names to proposals
                const proposalsWithNames = filteredData.map(proposal => ({
                    ...proposal,
                    requesterName: requesterMap[proposal.MovingID] || 'Unknown',
                }));
    
                console.log("Proposals with names:", proposalsWithNames);

                setProposals(proposalsWithNames);
            } else {
                console.log("No proposals found");
            }
        } catch (error) {
            showError(error.message); // Show error message to user
            console.error("Error fetching proposals:", error);
        } finally {
            setLoading(false); // Ensure loading is set to false after request completes
        }
    };
    

    const handleProposalClick = async (item) => {
        try {
            console.log("Proposal clicked:", item); 
            const selectedVehicleUUID = item.VehicleUUID;
            
            const vehicleInfo = await getVehicleByVehicleUUID(token, selectedVehicleUUID);
            console.log("Fetched vehicle info:", vehicleInfo);
            navigation.navigate('SingleMoveRequest', { 
                moveRequest: item.request, 
                selectedVehicle: vehicleInfo // Pass the full vehicle info
            });
        } catch (error) {
            console.error("Error fetching vehicle info:", error);
            // Handle error (e.g., show an alert or fallback to default behavior)
        }
    };
    

    useEffect(() => {
        fetchProposals();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableRipple onPress={() => handleProposalClick(item)}>
            <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                    <View style={styles.cardText}>
                        <Title>{item.request.moveStatus}</Title>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile', { userId: item.MovingID })}>
                            <Text style={styles.name}>{item.requesterName}</Text>
                        </TouchableOpacity>
                        <Paragraph>{`Price: ${item.PriceOffer}`}</Paragraph>
                        <Paragraph>{`Distance: ${item.request.distance}`}</Paragraph>
                        <Paragraph>{`Move Date: ${item.request.moveDate}`}</Paragraph>
                        <Paragraph>{`From: ${item.request.fromAddress}`}</Paragraph>
                        <Paragraph>{`To: ${item.request.toAddress}`}</Paragraph>
                    </View>
                    <IconButton
                        icon="chat"
                        mode='contained'
                        size={20}
                        onPress={() => navigation.navigate('Chat', { moveRequest: item.request.uuid })}
                        style={styles.chatIcon}
                    />
                </Card.Content>
            </Card>
        </TouchableRipple>
    );
    

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
            ) : proposals.length === 0 ? (
                <Text style={styles.emptyMessage}>No provided moves found.</Text>
            ) : (
                <>
                {console.log("All proposals to be rendered:", JSON.stringify(proposals, null, 2))}
                <FlatList
                    data={proposals}
                    renderItem={renderItem}
                    keyExtractor={item => item.uuid}
                    contentContainerStyle={styles.list}
                />
            </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    list: {
        flexGrow: 1,
    },
    card: {
        marginBottom: 16,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardText: {
        flex: 1,
    },
    name: {
		color: 'blue',
		textDecorationLine: 'underline',
	},
    loadingIndicator: {
        flex: 1,
    },
    emptyMessage: {
        flex: 1,
        textAlign: 'center',
        paddingTop: 20,
        fontSize: 16,
        color: '#888',
    },
});

export default MoveProvidingList;
