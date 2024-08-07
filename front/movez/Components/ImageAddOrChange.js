import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Button, Portal } from 'react-native-paper';
import MyModal from './MyModal'; // Adjust the import according to your project structure

const ImageAddOrChange = ({
  image,
  handleImagePress,
  pictureModalVisible,
  setPictureModalVisible,
  hideModal,
  pickImageFromCamera,
  pickImageFromGallery,
  removeImage
}) => {
  const handleImage = () => setPictureModalVisible(true);

  return (
    <View>
      {!image ? (
        <Button onPress={handleImage} mode="contained">
          Add Image
        </Button>
      ) : (
        <>
          <TouchableOpacity onPress={() => handleImagePress(image)}>
            <Image source={{ uri: image }} style={styles.image} />
          </TouchableOpacity>
          <Button onPress={handleImage} mode="contained" style={styles.changeButton}>
            Change Image
          </Button>
        </>
      )}
      <Portal>
        <MyModal
          visible={pictureModalVisible}
          hideModal={hideModal}
          pickImageFromCamera={pickImageFromCamera}
          pickImageFromGallery={pickImageFromGallery}
          removeImage={removeImage}
        />
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 60,
    height: 60,
  },
  changeButton: {
    marginTop: 10,
  },
});

export default ImageAddOrChange;
