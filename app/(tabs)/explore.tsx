import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ExploreTab() {
  const router = useRouter();

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
      onPress: () => console.log('Gallery feature')
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Features</Text>
        <Text style={styles.subtitle}>Discover what you can do</Text>
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
              color={feature.title === 'Trading Charts' ? "#fff" : "#007AFF"}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  featuresContainer: {
    padding: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: "48%",
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
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
    backgroundColor: "#007AFF",
    borderColor: "#0056b3",
  },
  featureIcon: {
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  highlightTitle: {
    color: "#fff",
  },
  featureDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  highlightDescription: {
    color: "#e6f0ff",
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
});
