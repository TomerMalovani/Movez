import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Text, Card, Title, Paragraph, TouchableRipple } from 'react-native-paper';
import { getPriceProposalForProvider } from '../utils/api_price_proposals';
import { getVehicleByVehicleUUID } from '../utils/vehicle_api_calls';
import { TokenContext } from '../tokenContext';
import { ToastContext } from '../toastContext';

const MoveProvidingList = ({ navigation, filterStatus, selectedVehicle }) => {
    console.log("Props received in MoveProvidingList.js:", { navigation, filterStatus, selectedVehicle }); // Add this line
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
	const {showError, showSuccess} = useContext(ToastContext);
    const { token, myUuid } = useContext(TokenContext);

    const fetchProposals = async () => {
        try {
            console.log("MOve Providing List- try fetching price proposals for provider");
            const data = await getPriceProposalForProvider(token, myUuid);//requests that the current provider gave offer on
            console.log("MoveProvidingList- Provided moves data:", data); // Log API response for debugging
            if (data && Array.isArray(data)) {
                const filteredData = data.filter(proposal => proposal.request && filterStatus.includes(proposal.request.moveStatus));
                setProposals(filteredData);
            } else {
                console.log("No proposals found");
            }
        } catch (error) {
			showError(error.message); // Show error message to user
             // Log error for debugging
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
                        <Paragraph>{`Price: ${item.PriceOffer}`}</Paragraph>
                        <Paragraph>{`Distance: ${item.request.distance}`}</Paragraph>
                        <Paragraph>{`Move Date: ${item.request.moveDate}`}</Paragraph>
                        <Paragraph>{`From: ${item.request.fromAddress}`}</Paragraph>
                        <Paragraph>{`To: ${item.request.toAddress}`}</Paragraph>
                    </View>
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
                <FlatList
                    data={proposals}
                    renderItem={renderItem}
                    keyExtractor={item => item.uuid}
                    contentContainerStyle={styles.list}
                />
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
