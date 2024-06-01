import React,{useState,useContext,useEffect} from 'react';
import { View, Text } from 'react-native';
import { ActivityIndicator, Button, MD2Colors, Modal, Portal } from 'react-native-paper';
import ProfileVehicleCard from '../Components/profileVehicleCard';
import {  deleteVehicle, getAllVehicles } from '../utils/vehicle_api_calls';
import { TokenContext } from '../tokenContext';
import AddVehicle from './AddVehicle';

const UserVehicles = (props) => {
	const { token } = useContext(TokenContext);

	const [vehicles, setVehicles] = useState([]);
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const handleDelete = async (id) => {
		try{
			const respone = await deleteVehicle(token, id);
			setVehicles(prev => prev.filter(vehicle => vehicle.uuid !== id));
		}	catch(err){
			console.log(err)
		}
	}

	const handleAddVehicle = (vehicle) => {
		setVehicles(prev => [...prev, vehicle]);
		setIsOpen(false);
	}

	const handleModalToogle = () => {
		setIsOpen(prev=>!prev);
	}

	const getVehicles = async () => {
		try {
			setLoading(true);
			const data = await getAllVehicles(token);

			setVehicles(data);
			setLoading(false);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	}

	useEffect(() => {
		getVehicles()
	}, []);	


	if (loading) return <ActivityIndicator animating={true} color={MD2Colors.error50} size={50} style={{marginTop: 50}} />
	
	
	else return (
		<View>
			<Portal>
				<Modal visible={isOpen} dismissable={true} onDismiss={handleModalToogle} contentContainerStyle={{backgroundColor: 'white', padding: 20}}>
					<AddVehicle handleAddVehicle={handleAddVehicle}/>
					</Modal>
			</Portal>
			
			<ProfileVehicleCard handleModalOpen={handleModalToogle}  handleDelete={handleDelete}  vehicles={vehicles} {...props}/>

		</View>
	);
};

export default UserVehicles;