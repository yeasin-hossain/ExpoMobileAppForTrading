import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ExploreHeader from '../../components/explore/ExploreHeader';
import { FeatureData } from '../../components/explore/FeatureCard';
import FeatureGrid from '../../components/explore/FeatureGrid';
import GalleryBottomSheet from '../../components/explore/GalleryBottomSheet';
import ImagePreviewModal from '../../components/explore/ImagePreviewModal';
import { useTheme } from '../../contexts/ThemeContext';

export default function ExploreTab() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  // Bottom sheet ref
  const bottomSheetRef = useRef<any>(null);
  
  // Image preview modal state
  const [selectedImage, setSelectedImage] = useState<{ uri: any; title: string; id: number } | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
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
    if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(1); // Open to middle snap point
    }
  }, []);

  // Navigate to trade page
  const openTrade = useCallback(() => {
    router.push('/trade');
  }, [router]);
  
  // Open image preview
  const openImagePreview = useCallback((photo: { uri: any; title: string; id: number }) => {
    setSelectedImage(photo);
    setIsModalVisible(true);
  }, []);
  
  // Close image preview
  const closeImagePreview = useCallback(() => {
    setSelectedImage(null);
    setIsModalVisible(false);
  }, []);

  // Close gallery bottom sheet
  const closeGallery = useCallback(() => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  }, []);

  const features: FeatureData[] = [
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
      onPress: openGallery
    },
    { 
      icon: "trending-up", 
      title: "Trading Charts", 
      description: "View real-time market data",
      onPress: () => router.push('/chart'),
      isHighlighted: true,
      showBadge: true,
      badgeText: "NEW"
    },
    { 
      icon: "wallet", 
      title: "Trade", 
      description: "Buy and sell cryptocurrencies",
      onPress: openTrade,
      isHighlighted: false,
      showBadge: true,
      badgeText: "HOT"
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
        <ExploreHeader 
          title="Explore Features"
          subtitle="Discover what you can do"
          showTestButton={true}
          onTestButtonPress={openGallery}
        />
        
        <FeatureGrid features={features} />
      </ScrollView>

      <GalleryBottomSheet
        ref={bottomSheetRef}
        photos={galleryPhotos}
        onClose={closeGallery}
        onPhotoPress={openImagePreview}
      />

      <ImagePreviewModal
        photo={selectedImage}
        visible={isModalVisible}
        onClose={closeImagePreview}
      />
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
});
