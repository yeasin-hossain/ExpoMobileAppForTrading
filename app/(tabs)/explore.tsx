import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTheme } from '../../contexts/ThemeContext';

export default function ExploreTab() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  // Bottom sheet ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  
  // Bottom sheet snap points
  const snapPoints = useMemo(() => ['30%', '60%', '90%'], []);
  
  // Image preview modal state
  const [selectedImage, setSelectedImage] = useState<{ uri: any; title: string } | null>(null);
  
  // Gallery photos (dummy data) - using only safe file names
  const galleryPhotos = [
    { id: 1, uri: require('../../assets/images/react-logo.png'), title: 'React Logo' },
    { id: 2, uri: require('../../assets/images/partial-react-logo.png'), title: 'Partial React Logo' },
    { id: 3, uri: require('../../assets/images/background-image.png'), title: 'Background' },
    { id: 4, uri: require('../../assets/images/icon.png'), title: 'App Icon' },
    { id: 5, uri: require('../../assets/images/favicon.png'), title: 'Favicon' },
    { id: 6, uri: require('../../assets/images/adaptive-icon.png'), title: 'Adaptive Icon' },
    { id: 7, uri: require('../../assets/images/splash-icon.png'), title: 'Splash Icon' },
    { id: 8, uri: require('../../assets/images/emoji1.png'), title: 'Happy Face' },
    { id: 9, uri: require('../../assets/images/emoji2.png'), title: 'Cool Face' },
    { id: 10, uri: require('../../assets/images/emoji3.png'), title: 'Wink Face' },
    { id: 11, uri: require('../../assets/images/emoji4.png'), title: 'Love Face' },
    { id: 12, uri: require('../../assets/images/emoji5.png'), title: 'Laugh Face' },
    { id: 13, uri: require('../../assets/images/emoji6.png'), title: 'Surprise Face' },
    { id: 14, uri: require('../../assets/images/react-logo.png'), title: 'React Logo Copy' },
    { id: 15, uri: require('../../assets/images/icon.png'), title: 'App Icon Copy' },
    // Add more duplicates to demonstrate scrolling
    { id: 16, uri: require('../../assets/images/emoji1.png'), title: 'Happy Face 2' },
    { id: 17, uri: require('../../assets/images/emoji2.png'), title: 'Cool Face 2' },
    { id: 18, uri: require('../../assets/images/emoji3.png'), title: 'Wink Face 2' },
    { id: 19, uri: require('../../assets/images/emoji4.png'), title: 'Love Face 2' },
    { id: 20, uri: require('../../assets/images/emoji5.png'), title: 'Laugh Face 2' },
    { id: 21, uri: require('../../assets/images/emoji6.png'), title: 'Surprise Face 2' },
    { id: 22, uri: require('../../assets/images/background-image.png'), title: 'Background 2' },
    { id: 23, uri: require('../../assets/images/favicon.png'), title: 'Favicon 2' },
    { id: 24, uri: require('../../assets/images/adaptive-icon.png'), title: 'Adaptive Icon 2' },
    { id: 25, uri: require('../../assets/images/splash-icon.png'), title: 'Splash Icon 2' },
  ];
  
  // Open gallery bottom sheet
  const openGallery = useCallback(() => {
    console.log('Opening gallery bottom sheet'); // Debug log
    console.log('Bottom sheet ref:', bottomSheetRef.current); // Debug log
    if (bottomSheetRef.current) {
      try {
        bottomSheetRef.current.snapToIndex(1); // Open to middle snap point
      } catch (error) {
        console.error('Error opening bottom sheet:', error);
      }
    }
  }, []);
  
  // Close gallery bottom sheet
  const closeGallery = useCallback(() => {
    console.log('Closing gallery bottom sheet'); // Debug log
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  }, []);
  
  // Handle sheet changes
  const handleSheetChanges = useCallback((index: number) => {
    console.log('Bottom sheet index changed to:', index); // Debug log
  }, []);
  
  // Open image preview
  const openImagePreview = useCallback((photo: { uri: any; title: string }) => {
    setSelectedImage(photo);
  }, []);
  
  // Close image preview
  const closeImagePreview = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const features = [
    { 
      icon: "camera", 
      title: "Camera", 
      description: "Take amazing photos",
      onPress: () => console.log('Camera feature')
    },
    { 
      icon: "images", 
      title: "Gallery", 
      description: "Browse your photos",
      onPress: () => {
        console.log('Gallery card pressed');
        openGallery();
      }
    },
    { 
      icon: "trending-up", 
      title: "Trading Charts", 
      description: "View real-time market data",
      onPress: () => router.push('/chart')
    },
    { 
      icon: "color-palette", 
      title: "Edit", 
      description: "Enhance your images",
      onPress: () => console.log('Edit feature')
    },
    { 
      icon: "share", 
      title: "Share", 
      description: "Share with friends",
      onPress: () => console.log('Share feature')
    },
    { 
      icon: "analytics", 
      title: "Analytics", 
      description: "Track your performance",
      onPress: () => console.log('Analytics feature')
    },
  ];

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Explore Features</Text>
          <Text style={styles.subtitle}>Discover what you can do</Text>
          {/* Test button for bottom sheet */}
          <TouchableOpacity 
            style={styles.testButton} 
            onPress={openGallery}
          >
            <Text style={styles.testButtonText}>Test Gallery</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.featureCard,
                feature.title === 'Trading Charts' && styles.highlightCard
              ]}
              onPress={feature.onPress}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={feature.icon as any} 
                size={32} 
                color={feature.title === 'Trading Charts' ? "#fff" : theme.selectedButton}
                style={styles.featureIcon}
              />
              <Text style={[
                styles.featureTitle,
                feature.title === 'Trading Charts' && styles.highlightTitle
              ]}>
                {feature.title}
              </Text>
              <Text style={[
                styles.featureDescription,
                feature.title === 'Trading Charts' && styles.highlightDescription
              ]}>
                {feature.description}
              </Text>
              {feature.title === 'Trading Charts' && (
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>NEW</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Gallery Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetIndicator}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <View style={styles.bottomSheetHeader}>
            <View style={styles.titleContainer}>
              <Ionicons name="images" size={28} color={theme.selectedButton} />
              <Text style={styles.bottomSheetTitle}>Gallery</Text>
              <Text style={styles.imageCount}>({galleryPhotos.length} photos)</Text>
            </View>
            <TouchableOpacity onPress={closeGallery} style={styles.closeButton}>
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
            
            {galleryPhotos.map((photo) => (
              <TouchableOpacity 
                key={photo.id} 
                style={styles.photoItem}
                onPress={() => openImagePreview(photo)}
                activeOpacity={0.8}
              >
                <Image source={photo.uri} style={styles.photoImage} resizeMode="cover" />
                <Text style={styles.photoTitle}>{photo.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>

      {/* Image Preview Modal */}
      <Modal
        visible={selectedImage !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImagePreview}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeImagePreview}
        >
          <View style={styles.modalContent}>
            {selectedImage && (
              <>
                <TouchableOpacity 
                  style={styles.modalCloseButton}
                  onPress={closeImagePreview}
                >
                  <Ionicons name="close" size={30} color={theme.text} />
                </TouchableOpacity>
                <Image 
                  source={selectedImage.uri} 
                  style={styles.modalImage} 
                  resizeMode="contain"
                />
                <Text style={styles.modalTitle}>{selectedImage.title}</Text>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </GestureHandlerRootView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.headerBackground,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: theme.text,
  },
  subtitle: {
    fontSize: 16,
    color: theme.secondaryText,
  },
  testButton: {
    marginTop: 15,
    backgroundColor: theme.selectedButton,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  testButtonText: {
    color: theme.selectedButtonText,
    fontWeight: '600',
    fontSize: 16,
  },
  featuresContainer: {
    padding: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: "48%",
    backgroundColor: theme.cardBackground,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.border,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    position: 'relative',
  },
  highlightCard: {
    backgroundColor: theme.selectedButton,
    borderColor: theme.selectedButton,
  },
  featureIcon: {
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: theme.text,
  },
  highlightTitle: {
    color: theme.selectedButtonText,
  },
  featureDescription: {
    fontSize: 14,
    color: theme.secondaryText,
    textAlign: "center",
  },
  highlightDescription: {
    color: theme.selectedButtonText,
    opacity: 0.8,
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ff3b30',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Bottom Sheet Styles
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
  // Modal Styles
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
