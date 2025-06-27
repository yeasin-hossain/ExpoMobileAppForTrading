import { StyleSheet, Text, View } from "react-native";

export default function HomeTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to StickerSmash!</Text>
      <Text style={styles.subtitle}>Home Tab</Text>
      <Text style={styles.description}>
        This is your home page. The test has been finished, finally run iOS!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    color: "#666",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#888",
    lineHeight: 24,
  },
});
