import React from 'react';
import { Button, Modal, Portal, Text, Provider } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

const MyModal = ({ visible, hideModal, pickImageFromCamera, pickImageFromGallery, removeImage }) => {
  return (
    <Provider>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalText}>Choose an option</Text>
          <Button icon="camera" mode="contained" onPress={pickImageFromCamera} style={styles.modalButton}>
            Camera
          </Button>
          <Button icon="image" mode="contained" onPress={pickImageFromGallery} style={styles.modalButton}>
            Gallery
          </Button>
          <Button icon="delete" mode="contained" onPress={removeImage} style={styles.modalButton}>
            Remove
          </Button>
        </Modal>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    backgroundColor: 'white',
    margin: 20,
  },
  modalText: {
    marginBottom: 10,
    textAlign: 'center',
  },
  modalButton: {
    marginVertical: 5,
  },
});

export default MyModal;