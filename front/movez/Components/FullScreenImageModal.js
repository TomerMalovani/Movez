import React from 'react';
import { StyleSheet } from 'react-native';
import { Portal, IconButton } from 'react-native-paper';
import { Modal as RNModal } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

const FullScreenImageModal = ({ visible, imageUrls, onClose }) => {
    return (
        <Portal>
            <RNModal visible={visible} onRequestClose={onClose} transparent={true}>
                <>
                    <IconButton
                        icon="close"
                        size={30}
                        color="white"
                        onPress={onClose}
                        style={styles.closeButton}
                    />
                    <ImageViewer imageUrls={imageUrls} />
                </>
            </RNModal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
    },
});

export default FullScreenImageModal;