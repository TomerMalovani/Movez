import React from 'react';
import { View, Text } from 'react-native';
import { Card, DataTable, IconButton, TouchableRipple } from 'react-native-paper';

const ProfileVehicleCard = ({ vehicles, navigation }) => {
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

	if (vehicles.length > 0) {
		
		return (
			<>
						<DataTable>
					<IconButton
						icon="plus"
						size={30}
						onPress={() => {
							navigation.navigate('AddVehicle');
						}}
					/>
							
						<DataTable.Header>
						{
								columns.map((column, index) => (
									
										<DataTable.Title>{column.name}</DataTable.Title>
									
								))}
						</DataTable.Header>
							
						

							{vehicles.map((vechile) => (
								<TouchableRipple
									onPress={() => console.log('Pressed')}
									rippleColor="rgba(0, 0, 0, .32)"
								>
								<DataTable.Row key={vechile.key}>
									{columns.map((column, index) => (

										<DataTable.Cell key={index}>{vechile[column.selector]}</DataTable.Cell>
									))}
								</DataTable.Row>
								</TouchableRipple>
							))}

							
						</DataTable>
		</>
				
		);
	} else {
		return (
			<View style={{ alignItems: 'center', justifyContent: 'center' }}>
				<IconButton
					icon="plus"
					size={30}
					onPress={() => {
						navigation.navigate('AddVehicle');
					}}
				/>
				<Text>Add Vehicle</Text>
			</View>
		);
	}
};

export default ProfileVehicleCard;