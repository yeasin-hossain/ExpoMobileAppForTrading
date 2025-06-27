import { Ionicons } from '@expo/vector-icons';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { GalleryPhoto } from './GalleryBottomSheet';

interface ImagePreviewModalProps {
  photo: GalleryPhoto | null;
  visible: boolean;
  onClose: () => void;
}

export default function ImagePreviewModal({ photo, visible, onClose }: ImagePreviewModalProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          {photo && (
            <>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={onClose}
              >
                <Ionicons name="close" size={30} color={theme.text} />
              </TouchableOpacity>
              <Image 
                source={photo.uri} 
                style={styles.modalImage} 
                resizeMode="contain"
              />
              <Text style={styles.modalTitle}>{photo.title}</Text>
            </>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  modalImage: {
    width: '100%',
    height: 400,
    borderRadius: 12,
  },
  modalTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});
