import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export const LoadingScreen: React.FC = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    logo: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 20,
    },
    subtitle: {
      fontSize: 16,
      color: theme.secondaryText,
      marginBottom: 40,
    },
    spinner: {
      marginBottom: 20,
    },
    loadingText: {
      fontSize: 14,
      color: theme.secondaryText,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>StickerSmash</Text>
      <Text style={styles.subtitle}>Trading App</Text>
      <ActivityIndicator 
        size="large" 
        color={theme.selectedButton} 
        style={styles.spinner}
      />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};
