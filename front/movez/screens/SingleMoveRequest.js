import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View} from 'react-native';
import { Button, Card, Icon, IconButton, Surface, Text, MD2Colors, Chip,ActivityIndicator } from 'react-native-paper';
import { TokenContext } from '../tokenContext';
import { showSingleMoveRequestItems } from '../utils/moveRequest_api_calls';
import MapView, { Marker } from 'react-native-maps';
import CustomMapView from '../Components/CustomMapView';
import { google_maps_api_key } from '../config/config';
import MapViewDirections from 'react-native-maps-directions';
import AcordionMoreInfo from '../Components/AcordionMoreInfo';
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { DataTable } from 'react-native-paper';

const SingleMoveRequest = ({ route, navigation }) => {
	const [items, setItems] = useState([]);
	const [moveRequestInfo, setMoveRequestInfo] = useState({});
	const [isLoaded, setIsLoaded] = useState(false);
	const { moveRequest } = route.params;
	const {token} = useContext(TokenContext)

	const sheetRef = useRef(null);


	const fetchItems = async () => {
		try{

		
		setIsLoaded(true)
		const data = await showSingleMoveRequestItems(token, moveRequest.uuid)

			console.log("Items", data)
		setItems(data)
		setIsLoaded(false)
		}catch(e){
			console.log(e)
			setIsLoaded(false)
		}
	};

	const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);


	const formatDate = (dateString) => {
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		return new Date(dateString).toLocaleDateString(undefined, options);
	}

	const tableInputs = [
		{title:'Item', value: 'ItemDescription'},
		{title: 'Depth', value: 'Depth'},
		{title: 'Height', value: 'Height'},
		{title: 'Width', value: 'Width'},
		{title: 'Weight', value: 'Weight'},


	]

	useEffect(() => {
		fetchItems()
		const moveRequestInfoObj = [
			{ icon: 'clock-time-nine', title: 'Move Date', info: formatDate(moveRequest.moveDate) },
			{ icon: 'map-marker-distance', title:'Distance' ,info: `${parseFloat(moveRequest.distance).toFixed(2)}KM` }
		]
		setMoveRequestInfo(moveRequestInfoObj)
	}, []);

	if (isLoaded) return <ActivityIndicator animating={true} color={MD2Colors.red500} />;

   else if (items.length === 0) {
   return <Text>No items found</Text>
}

	return (
		<Surface style={{height:"100%"}}>
			<Text variant="bodyMedium" style={{textAlign:"center"}}> {moveRequest.fromAddress} </Text>
			<Text variant="bodyMedium" style={{textAlign:"center"}}> {moveRequest.toAddress} </Text>

			<View style={{ height: "50%" }}>
				<CustomMapView region={
					{
						latitude: moveRequest.moveFromCoor.coordinates[1],
						longitude: moveRequest.moveFromCoor.coordinates[0],
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421
					}


				}>
					<Marker coordinate={{ latitude: moveRequest.moveFromCoor.coordinates[1], longitude: moveRequest.moveFromCoor.coordinates[0] }} title="From" />
					<Marker coordinate={{ latitude: moveRequest.moveToCoor.coordinates[1], longitude: moveRequest.moveToCoor.coordinates[0] }} title="From" />


					<MapViewDirections
						origin={{ latitude: moveRequest.moveFromCoor.coordinates[1], longitude: moveRequest.moveFromCoor.coordinates[0] }}
						destination={{ latitude: moveRequest.moveToCoor.coordinates[1], longitude: moveRequest.moveToCoor.coordinates[0] }}
						apikey={google_maps_api_key}
						strokeWidth={3}
						strokeColor='red'
					/>

				</CustomMapView>
			</View>
			<BottomSheet
				ref={sheetRef}
				index={1}
				snapPoints={snapPoints}

			>
				<BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
			
				{
					moveRequestInfo.map((item, index) => (
						<Chip icon={item.icon} onPress={() => console.log('Pressed')}>{item.title} : {item.info}</Chip>

						// <View style={{ width: '100%',justifyContent:"center",padding:'5%', marginBottom: 5 }} key={index} >
						// 	<Card>
						// 		<Card.Title title={item.title} left={(props) => <IconButton icon={item.icon} />} />
						// 		<Card.Content>
						// 			<Text style={{textAlign:"center"}}>{item.info}</Text>
						// 		</Card.Content>
						// 	</Card>
						// </View>
					))
				}
		

					<DataTable >
						<DataTable.Header>

			{
						tableInputs.map((header) => 
							
									<DataTable.Title>{header.title}</DataTable.Title>
)
						}
						</DataTable.Header>
							
								{
									items.map((item, index) => (
										<DataTable.Row key={index}>
											{
												tableInputs.map((header, i) => 
													<DataTable.Cell>{item[header.value]}</DataTable.Cell>
												)
											}
											
										</DataTable.Row>
									))
								}
					</DataTable>
					<View style={{ alignItems:"center",marginTop:50}}>
						<Button mode="contained">see propseals</Button>
					</View>
					
				</BottomSheetScrollView>
			</BottomSheet>
		</Surface>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 200,
	},
	contentContainer: {
		backgroundColor: "white",
	},
	itemContainer: {
		padding: 6,
		margin: 6,
		backgroundColor: "#eee",
	},
});

export default SingleMoveRequest;