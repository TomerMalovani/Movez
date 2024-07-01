import React, { useContext, useEffect,useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Provider as PaperProvider, Card } from 'react-native-paper';
import { getPriceProposalForProvider } from '../utils/api_price_proposals';
import { TokenContext } from '../tokenContext';



const MovesProvided = ({ navigation }) => {
	const { token, myUuid } = useContext(TokenContext);
	const [myProposals, setMyProposals] = useState([]);
	const [loading, setLoading] = useState(true);

	const handleMoveToMove = (proposal) => {
		navigation.navigate('SingleMoveRequest', { moveRequest: proposal })
		// move to the move
	}


	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const res = await getPriceProposalForProvider(token, myUuid)
			console.log("provied", res)
			setMyProposals(res)
			setLoading(false)
		}
		fetchData()
	}, []);

	if (loading) {

		<View style={styles.container}>
			<Text>Loading...</Text>
		</View>
	}

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Text style={styles.title}>Moves i Am Providing</Text>
               {
				   myProposals.map((proposal) => (
					   <Card onPress={()=>handleMoveToMove(proposal.request)}>
						
						<Card.Content>
							   <Text  style={styles.cardContent}>Price: {proposal.EstimatedCost}</Text>
							   <Text  style={styles.cardContent}>distance: {proposal.request.distance}</Text>
							   <Text  style={styles.cardContent}>move date: {proposal.request.moveDate}</Text>
							   <Text  style={styles.cardContent}>from: {proposal.request.fromAddress}</Text>
							   <Text  style={styles.cardContent}>to: {proposal.request.toAddress}</Text>

							{/* should get to the move */}
						</Card.Content>
					</Card>

				   ))
			   }
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
	cardContent: {
		fontSize: 16,
		marginBottom: 8,
		
	},

    container: {
        flex: 1,
        justifyContent: 'start',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default MovesProvided;
