import React, { useContext, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert, TouchableOpacity, Dimensions, Modal as RNModal } from 'react-native';
import { TextInput, Button, Modal, Portal, Text, Card, Snackbar, HelperText } from 'react-native-paper';
import { IconButton, MD3Colors } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import { ToastContext } from '../toastContext';
import MyModal from './UploadPictureModal';

const AddItemsForm = ({ itemsState, handleCreateNewRequest }) => {
	const [items, setItems] = itemsState;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [pictureModalVisible, setPictureModalVisible] = useState(false);
	const [newItem, setNewItem] = useState({});
	const [editedItem, setEditedItem] = useState(undefined);
	const { showError, showSuccess } = useContext(ToastContext);
	const [errors, setErrors] = useState({});
	const [image, setImage] = useState(null);
	const [fullScreenImage, setFullScreenImage] = useState(null);

	const inputs = [
		{ name: 'ItemDescription', type: 'default', placeholder: 'Item Description' },
		{ name: 'Height', type: 'numeric', placeholder: 'Height(Cm)' },
		{ name: 'Width', type: 'numeric', placeholder: 'Width(Cm)' },
		{ name: 'Depth', type: 'numeric', placeholder: 'Depth(Cm)' },
		{ name: 'Weight', type: 'numeric', placeholder: 'Weight(Kg)' },
		{ name: 'Quantity', type: 'numeric', placeholder: 'Quantity' },
		{ name: 'SpecialInstructions', checkbox: true, type: 'default', placeholder: 'Special Instructions' }
	];

	const hasErrors = (field) => errors[field];

	const handleSubmit = (item) => setEditedItem(item);

	const handleChange = (e, item) => setNewItem(prev => ({ ...prev, [`${item.name}`]: e }));

	const handleAddItem = async (e) => {
		try {
			if (isNaN(newItem.Quantity)) {
				newItem.Quantity = 1;
			}
			if (newItem.SpecialInstructions === "" || newItem.SpecialInstructions === undefined) {
				newItem.SpecialInstructions = "None";
			}

			inputs.forEach(input => {
				if (!newItem[input.name]) {
					setErrors(prev => ({ ...prev, [input.name]: `${input.placeholder} is required` }));
					throw new Error(`${input.placeholder} is required`);
				} else {
					setErrors(prev => ({ ...prev, [input.name]: null }));
				}
			});

			if (image) {
				newItem.Photo = image;
			} else {
				newItem.Photo = null;
			}

			console.log("New Item: ", newItem);
			setItems([...items, newItem]);
			setIsModalVisible(false);
			setEditedItem(undefined);
			setNewItem({});
			setImage(null);
			showSuccess("Item added successfully");
		} catch (err) {
			console.log("Error: ", err);
		}
	};

	const handleEditItem = (e) => {
		setItems(items.filter((i, ind) => i !== e));
		setNewItem(e);
		Object.keys(e).forEach(
			key => {
				if (typeof e[key] !== 'string' && typeof e[key] !== typeof e.Photo && e[key] !== null) { e[key] = e[key].toString() }
			});
		setImage(e.Photo || null);
		setEditedItem(e);
		setIsModalVisible(true);
	};

	const handleCancel = () => {
		if (editedItem) {
			setItems([...items, editedItem]);
			setEditedItem(undefined);
		} else {
			setNewItem(prev => ({ ...prev, Photo: image }));
		}
		setIsModalVisible(false);
	};

	const handleImage = () => setPictureModalVisible(true);

	const hideModal = () => setPictureModalVisible(false);

	const pickImageFromGallery = async () => {
		try {
			const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (status !== 'granted') {
				Alert.alert('Permission Denied', 'Permission to access media library is required.');
				return;
			}

			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.All,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
			});

			if (!result.canceled) {
				setImage(result.assets[0].uri);
			}
		} catch (error) {
			Alert.alert('Error', 'An error occurred while picking an image from the gallery.');
			console.log('Error: ', error);
		} finally {
			setPictureModalVisible(false);
		}
	};

	const pickImageFromCamera = async () => {
		try {
			const { status } = await ImagePicker.requestCameraPermissionsAsync();
			if (status !== 'granted') {
				Alert.alert('Permission Denied', 'Permission to access camera is required.');
				return;
			}

			const result = await ImagePicker.launchCameraAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				quality: 1,
			});

			if (!result.canceled) {
				setImage(result.assets[0].uri);
			}
		} catch (error) {
			Alert.alert('Error', 'An error occurred while picking an image from the camera.');
			console.log('Error: ', error);
		} finally {
			setPictureModalVisible(false);
		}
	};

	const removeImage = () => {
		setPictureModalVisible(false);
		setImage(null);
	};

	const handleImagePress = (uri) => {
		setFullScreenImage([{ url: uri }]);
	}

	const handleFullScreenImageClose = () => {
		setFullScreenImage(null);
	};

	return (
		<View style={{ justifyContent: "space-between", height: '90%', padding: 10 }}>
			{items.length === 0 ? <Text style={styles.text}>No items added yet</Text>
				:
				<ScrollView style={{ marginBottom: 20 }}>
					{items.map((item, index) => (
						<Card mode='outlined' key={index}>
							<Card.Actions key={"actions-" + index}>
								<IconButton
									icon="trash-can"
									iconColor={MD3Colors.error50}
									mode='contained'
									key={"trash-can-" + index}
									size={20}
									onPress={() => setItems(items.filter((i, ind) => ind !== index))}
								/>
								<IconButton
									mode='contained'
									icon="pencil"
									key={"pencil-" + index}
									iconColor={MD3Colors.error50}
									size={20}
									onPress={() => handleEditItem(item)}
								/>
							</Card.Actions>
							<Card.Content key={"content-" + index}>
								<Text key={"desc-" + index} variant="titleLarge">{item.ItemDescription}</Text>
								<Text key={"height-" + index} variant="bodyMedium">Height {item.Height}</Text>
								<Text key={"width-" + index} variant="bodyMedium">Width {item.Width}</Text>
								<Text key={"depth-" + index} variant="bodyMedium">Depth {item.Depth}</Text>
								<Text key={"weight-" + index} variant="bodyMedium">Weight {item.Weight}</Text>
								<Text key={"quantity-" + index} variant="bodyMedium">Quantity {item.Quantity}</Text>
								<Text key={"instructions-" + index} variant="bodyMedium">Special Instructions {item.SpecialInstructions}</Text>
								<View key={"image-view-" + index}>
									<TouchableOpacity key={"image-touch-" + index} onPress={() => handleImagePress(item.Photo)}>
										<Image key={"image-" + index} source={{ uri: item.Photo }} style={{ width: 60, height: 60 }} />
									</TouchableOpacity>
								</View>
							</Card.Content>
						</Card>
					))}
				</ScrollView>
			}

			<Portal>
				<Modal style={styles.modal} onDismiss={handleCancel} visible={isModalVisible}>
					<Text style={{ textAlign: 'center', fontSize: 20, marginBottom: 10 }}>Add Item</Text>
					{inputs.map((input, index) => (
						<React.Fragment key={input.name + index}>
							<TextInput
								label={input.placeholder}
								keyboardType={input.type}
								value={newItem[input.name] || ''}
								onChangeText={(e) => handleChange(e, input)}
								key={"input-" + input.name + "-" + index}
								mode="flat"
							/>
							<HelperText key={"helper-" + input.name + "-" + index} type="error" visible={hasErrors(input.name)}>
								{errors[input.name]}
							</HelperText>
						</React.Fragment>
					))}
					<View key="image-view">
						{!image ? (<Button key="add-image" onPress={handleImage} mode="contained">Add Image</Button>) :
							(<>
								<TouchableOpacity key="image-touch" onPress={() => handleImagePress(image)}>
									<Image key="image" source={{ uri: image }} style={{ width: 60, height: 60 }} />
								</TouchableOpacity>
								<Button key="change-image" onPress={handleImage} mode="contained" style={{ marginTop: 10 }}>Change Image</Button>
							</>)
						}
						<Portal key="image-modal-portal">
							<MyModal
								visible={pictureModalVisible}
								hideModal={hideModal}
								pickImageFromCamera={pickImageFromCamera}
								pickImageFromGallery={pickImageFromGallery}
								removeImage={removeImage}
								key="my-modal"
							/>
						</Portal>
					</View>
					<View key="modal-buttons" style={{ justifyContent: 'space-evenly', marginTop: 20, flexDirection: 'row' }}>
						<Button key="add-button" buttonColor='green' mode="contained" onPress={handleAddItem}>Add</Button>
						<Button key="cancel-button" buttonColor='red' mode="contained" onPress={handleCancel}>Cancel</Button>
					</View>
				</Modal>
			</Portal>

			<View key="add-item-button" style={{ justifyContent: 'center', alignItems: 'center' }}>
				<Button key="open-modal-button" onPress={() => setIsModalVisible(true)} mode='contained'>Add Item</Button>
				{items.length > 0 &&
					<Button key="create-request-button" onPress={handleCreateNewRequest} mode='contained'>That's all</Button>
				}
			</View>
			<Portal key="full-screen-portal">
				<RNModal key="full-screen-modal" visible={!!fullScreenImage} onRequestClose={handleFullScreenImageClose} transparent={true}>
					<>
						<IconButton
							key="close-button"
							icon="close"
							size={30}
							color="white"
							onPress={handleFullScreenImageClose}
							style={styles.closeButton}
						/>
						<ImageViewer key="image-viewer" imageUrls={fullScreenImage} />
					</>
				</RNModal>
			</Portal>
		</View>
	);
};

const styles = StyleSheet.create({
	text: {
		textAlign: 'center',
		fontSize: 10,
	},
	modal: {
		backgroundColor: 'white',
		margin: 20,
		padding: 20,
		overflow: 'scroll',
		height: '100%',
	},
	button: {
		margin: 10,
	},
	buttons: {
		flexDirection: 'row',
		justifyContent: 'center',
	},
	fullScreenImageContainer: {
		flex: 1,
		backgroundColor: 'black',
		justifyContent: 'center',
		alignItems: 'center',
	},
	closeButton: {
		position: 'absolute',
		top: 40,
		right: 20,
		zIndex: 1,
	},
});

export default AddItemsForm;
