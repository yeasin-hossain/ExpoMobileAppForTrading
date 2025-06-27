import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FeatureGate, useFeature } from '../components/FeatureGate';
import { getClientConfig } from '../config/ClientManager';

export default function ExampleClientAwareComponent() {
  const clientConfig = getClientConfig();
  const hasNewsFeature = useFeature('news');
  const hasAnalyticsFeature = useFeature('analytics');

  return (
    <View style={styles.container}>
      {/* Display client-specific app name */}
      <Text style={[styles.title, { color: clientConfig.primaryColor }]}>
        Welcome to {clientConfig.appName}
      </Text>

      {/* Conditionally render features based on client config */}
      <FeatureGate feature="trading">
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trading</Text>
          <Text>Supported assets: {clientConfig.trading.supportedAssets.join(', ')}</Text>
          <Text>Min trade: ${clientConfig.trading.minTradeAmount}</Text>
        </View>
      </FeatureGate>

      <FeatureGate 
        feature="news" 
        fallback={<Text>News feature not available for this client</Text>}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Market News</Text>
          <Text>Latest cryptocurrency news and updates</Text>
        </View>
      </FeatureGate>

      <FeatureGate feature="analytics">
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Analytics</Text>
          <Text>Advanced market analysis tools</Text>
        </View>
      </FeatureGate>

      {/* Use hooks for conditional logic */}
      {hasNewsFeature && hasAnalyticsFeature && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium Features</Text>
          <Text>You have access to both news and analytics!</Text>
        </View>
      )}

      {/* Client-specific contact information */}
      <View style={styles.footer}>
        <Text>Support: {clientConfig.legal.supportEmail}</Text>
        <Text>© {clientConfig.legal.companyName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
  },
});
