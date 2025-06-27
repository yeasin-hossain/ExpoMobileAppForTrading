import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function ExploreTab() {
  const features = [
    { icon: "camera", title: "Camera", description: "Take amazing photos" },
    { icon: "images", title: "Gallery", description: "Browse your photos" },
    { icon: "color-palette", title: "Edit", description: "Enhance your images" },
    { icon: "share", title: "Share", description: "Share with friends" },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Features</Text>
        <Text style={styles.subtitle}>Discover what you can do</Text>
      </View>
      
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureCard}>
            <Ionicons 
              name={feature.icon as any} 
              size={32} 
              color="#007AFF" 
              style={styles.featureIcon}
            />
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </View>
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
  featureDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
