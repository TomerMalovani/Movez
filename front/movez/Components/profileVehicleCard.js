import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, DataTable, IconButton, Paragraph, TouchableRipple, Avatar, Button } from 'react-native-paper';
import { deateVehicle } from '../utils/vehicle_api_calls';
import { TokenContext } from '../tokenContext';

const ProfileVehicleCard = ({ handleDelete, vehicles, handleModalOpen}) => {
	
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
				<IconButton
					icon="plus"
					size={20}
					onPress={handleModalOpen}
					mode="contained"
				/>
				{vehicles.map((vehicle, index) => (
					<Card key={index + vehicle.uuid} style={styles.card}>
						<Card.Actions style={styles.cardActions}>
							<Button
								onPress={() => {handleModalOpen}}	style={styles.editButton}>
								Edit Car Information
							</Button>
							<View style={styles.spacer} />
							<IconButton
								icon="delete"
								onPress={() => {
									handleDelete(vehicle.uuid);
								}}
							/>
							
						</Card.Actions>
						<Card.Title title="Vehicle Information" />
						{vehicle.PhotoUrl ? (
							<Card.Cover source={{ uri: vehicle.PhotoUrl }} />
						) : (
							<View style={{  paddingLeft: 16}}>
								<Avatar.Icon size={40}  icon="car" />
							</View>
						)}
						<Card.Content>
							{columns.map((column) => (
								<Paragraph key={index + column.selector}>
									{column.name}: {vehicle[column.selector]}
								</Paragraph>
							))}
						</Card.Content>
					</Card>
				))}
			</>
		);
	} else {
		return (
			<View style={{ alignItems: 'center', justifyContent: 'center' }}>
				<IconButton
					icon="plus"
					size={30}
					onPress={handleModalOpen}
				/>
				<Text>Add Vehicle</Text>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	card: {
	  marginBottom: 10, // Adjust this value based on your layout needs
	},
	cardActions: {
	  flexDirection: 'row', // Align items horizontally
	  alignItems: 'center', // Center align items vertically
	},
	editButton: {
	  paddingLeft: 2, // Adjust this value as needed
	},
	spacer: {
	  flexGrow: 1, // Take up remaining space
	},
  });

export default ProfileVehicleCard;