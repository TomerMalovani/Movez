import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Text, Card, Title, Paragraph, TouchableRipple } from 'react-native-paper';
import { getPriceProposalForProvider } from '../utils/api_price_proposals';
import { TokenContext } from '../tokenContext';

const MoveProvidingList = ({ navigation, filterStatus }) => {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token, myUuid } = useContext(TokenContext);

    const fetchProposals = async () => {
        try {
            const data = await getPriceProposalForProvider(token, myUuid);
            console.log("Provided moves data:", data); // Log API response for debugging
            if (data && Array.isArray(data)) {
                const filteredData = data.filter(proposal => filterStatus.includes(proposal.request.moveStatus));
                setProposals(filteredData);
            } else {
                console.log("No proposals found");
            }
        } catch (error) {
            console.error("Error fetching proposals:", error); // Log error for debugging
        } finally {
            setLoading(false); // Ensure loading is set to false after request completes
        }
    };

    const handleProposalClick = (item) => {
        navigation.navigate('SingleMoveRequest', { moveRequest: item.request });
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
                        <Paragraph>{`Price: ${item.EstimatedCost}`}</Paragraph>
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
