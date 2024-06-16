import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View} from 'react-native';
import { Button, Card, Icon, IconButton, DataTable, Surface, Text, MD2Colors, Chip, ActivityIndicator } from 'react-native-paper';
import { TokenContext } from '../tokenContext';
import { showSingleMoveRequestItems } from '../utils/moveRequest_api_calls';
import { Marker } from 'react-native-maps';
import CustomMapView from '../Components/CustomMapView';
import { google_maps_api_key } from '../config/config';
import MapViewDirections from 'react-native-maps-directions';
import AcordionMoreInfo from '../Components/AcordionMoreInfo';
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

const SingleMoveRequest = ({ route, navigation }) => {
    const [items, setItems] = useState([]);
    const [moveRequestInfo, setMoveRequestInfo] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const { moveRequest } = route.params;
    const { token } = useContext(TokenContext);
    const sheetRef = useRef(null);
    const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

    const [showProposals, setShowProposals] = useState(false);

    // Simulated proposals data
    const proposals = [
        { name: 'Proposal 1', price: '$1000' },
        { name: 'Proposal 2', price: '$1200' },
        { name: 'Proposal 3', price: '$800' },
        { name: 'Proposal 4', price: '$1500' },
    ];

    const fetchItems = async () => {
        try {
            setIsLoaded(true);
            const data = await showSingleMoveRequestItems(token, moveRequest.uuid);
            setItems(data);
            setIsLoaded(false);
        } catch (e) {
            console.log(e);
            setIsLoaded(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    useEffect(() => {
        fetchItems();
        const moveRequestInfoObj = [
            { icon: 'clock-time-nine', title: 'Move Date', info: formatDate(moveRequest.moveDate) },
            { icon: 'map-marker-distance', title: 'Distance', info: `${parseFloat(moveRequest.distance).toFixed(2)}KM` }
        ];
        setMoveRequestInfo(moveRequestInfoObj);
    }, []);

    // Define tableInputs here
    const tableInputs = [
        { title: 'Item', value: 'ItemDescription' },
        { title: 'Depth', value: 'Depth' },
        { title: 'Height', value: 'Height' },
        { title: 'Width', value: 'Width' },
        { title: 'Weight', value: 'Weight' }
    ];

    const toggleProposals = () => {
        setShowProposals(!showProposals);
    };

    if (isLoaded) return <ActivityIndicator animating={true} color={MD2Colors.red500} />;
    else if (items.length === 0) return <Text>No items found</Text>;

    return (
        <Surface style={{ height: "100%" }}>
            <Text variant="bodyMedium" style={{ textAlign: "center", borderWidth: 1 }}>From: {moveRequest.fromAddress} </Text>
            <Text variant="bodyMedium" style={{ textAlign: "center", borderWidth: 1 }}>To: {moveRequest.toAddress} </Text>
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
            <BottomSheet
                ref={sheetRef}
                index={1}
                snapPoints={snapPoints}
            >
                <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
                    {!showProposals ? (
                        <>
                            {moveRequestInfo.map((item, index) => (
                                <Chip key={index} mode="outlined" icon={item.icon}>{item.title} : {item.info}</Chip>
                            ))}
                            <DataTable>
                                <DataTable.Header>
                                    {tableInputs.map((header, index) => (
                                        <DataTable.Title key={index}>{header.title}</DataTable.Title>
                                    ))}
                                </DataTable.Header>
                                {items.map((item, index) => (
                                    <DataTable.Row key={index}>
                                        {tableInputs.map((header, i) => (
                                            <DataTable.Cell key={i}>{item[header.value]}</DataTable.Cell>
                                        ))}
                                    </DataTable.Row>
                                ))}
                            </DataTable>
                            <View style={{ alignItems: "center", marginTop: 50 }}>
                                <Button mode="contained" onPress={toggleProposals}>See Proposals</Button>
                            </View>
                        </>
                    ) : (
                        <>
                            {proposals.map((proposal, index) => (
                                <Chip key={index} mode="outlined" style={{ marginBottom: 5 }}>{proposal.name} : {proposal.price}</Chip>
                            ))}
                        </>
                    )}
                </BottomSheetScrollView>
            </BottomSheet>
        </Surface>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        backgroundColor: "white",
    },
});

export default SingleMoveRequest;
