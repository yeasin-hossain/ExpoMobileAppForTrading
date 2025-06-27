import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { forwardRef, useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export interface GalleryPhoto {
  id: number;
  uri: any;
  title: string;
}

interface GalleryBottomSheetProps {
  photos: GalleryPhoto[];
  onClose: () => void;
  onPhotoPress: (photo: GalleryPhoto) => void;
  onChange?: (index: number) => void;
}

const GalleryBottomSheet = forwardRef<BottomSheet, GalleryBottomSheetProps>(
  ({ photos, onClose, onPhotoPress, onChange }, ref) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    
    const snapPoints = useMemo(() => ['30%', '60%', '90%'], []);

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        onChange={onChange}
        enablePanDownToClose={true}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetIndicator}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <View style={styles.bottomSheetHeader}>
            <View style={styles.titleContainer}>
              <Ionicons name="images" size={28} color={theme.selectedButton} />
              <Text style={styles.bottomSheetTitle}>Gallery</Text>
              <Text style={styles.imageCount}>({photos.length} photos)</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.galleryScroll}
            contentContainerStyle={styles.galleryContainer}
            showsVerticalScrollIndicator={true}
            scrollIndicatorInsets={{ right: 1 }}
            bounces={true}
            alwaysBounceVertical={true}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Photos</Text>
              <Text style={styles.sectionSubtitle}>Tap any image to view full size</Text>
            </View>
            
            {photos.map((photo) => (
              <TouchableOpacity 
                key={photo.id} 
                style={styles.photoItem}
                onPress={() => onPhotoPress(photo)}
                activeOpacity={0.8}
              >
                <Image source={photo.uri} style={styles.photoImage} resizeMode="cover" />
                <Text style={styles.photoTitle}>{photo.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

GalleryBottomSheet.displayName = 'GalleryBottomSheet';

const createStyles = (theme: any) => StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: theme.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomSheetIndicator: {
    backgroundColor: theme.border,
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bottomSheetTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
  },
  imageCount: {
    fontSize: 14,
    color: theme.secondaryText,
    marginLeft: 5,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: theme.background,
  },
  galleryScroll: {
    flex: 1,
  },
  galleryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 30,
    paddingHorizontal: 5,
    paddingTop: 10,
  },
  sectionHeader: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: theme.secondaryText,
  },
  photoItem: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: theme.background,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  photoImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  photoTitle: {
    padding: 10,
    fontSize: 12,
    fontWeight: '500',
    color: theme.text,
    textAlign: 'center',
    backgroundColor: theme.cardBackground,
  },
});

export default GalleryBottomSheet;
