import React, { useState, useContext, useEffect } from 'react';
import { View, Text } from 'react-native';
import { ActivityIndicator, Button, MD2Colors, Modal, Portal } from 'react-native-paper';
import ProfileVehicleCard from '../components/profileVehicleCard';
import { deleteVehicle, getAllVehicles } from '../utils/vehicle_api_calls';
import { TokenContext } from '../tokenContext';
import AddOrEditVehicle from './AddOrEditVehicle';

const UserVehicles = (props) => {
    const { token } = useContext(TokenContext);

    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleDelete = async (id) => {
        try {
            await deleteVehicle(token, id);
            setVehicles((prev) => prev.filter((vehicle) => vehicle.uuid !== id));
        } catch (err) {
            console.log(err);
        }
    };

    const handleEditVehicle = (vehicle) => {
        setVehicles((prev) => prev.map((v) => (v.uuid === vehicle.uuid ? vehicle : v)));
        setIsEditOpen(false);
    };

    const handleSelectedVehicle = (vehicle) => {
        setSelectedVehicle(vehicle);
    };

    const handleAddVehicle = (vehicle) => {
        setVehicles((prev) => [...prev, vehicle]);
        setIsOpen(false);
    };

    const handleModalToggle = () => {
        setIsOpen((prev) => !prev);
    };

    const handleSecondModalToggle = () => {
        setIsEditOpen((prev) => !prev);
    };

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
    };

    useEffect(() => {
        getVehicles();
    }, []);

    if (loading)
        return <ActivityIndicator animating={true} color={MD2Colors.error50} size={50} style={{ marginTop: 50 }} />;

    return (
        <View>
            <Portal>
                <Modal
                    visible={isOpen}
                    dismissable={true}
                    onDismiss={handleModalToggle}
                    contentContainerStyle={{ backgroundColor: 'white', padding: 20 }}
                >
                    <AddOrEditVehicle handleAddVehicle={handleAddVehicle} />
                </Modal>
                <Modal
                    visible={isEditOpen}
                    dismissable={true}
                    onDismiss={handleSecondModalToggle}
                    contentContainerStyle={{ backgroundColor: 'white', padding: 20 }}
                >
                    <AddOrEditVehicle handleEditVehicle={handleEditVehicle} userVehicle={selectedVehicle} />
                </Modal>
            </Portal>
            <ProfileVehicleCard
                handleModalOpen={handleModalToggle}
                handleEditModalOpen={handleSecondModalToggle}
                handleDelete={handleDelete}
                vehicles={vehicles}
                setVehicle={handleSelectedVehicle}
                {...props}
            />
        </View>
    );
};

export default UserVehicles;
