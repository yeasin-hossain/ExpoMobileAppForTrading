import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export const SettingsDemo: React.FC = () => {
  const { currentTheme, theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            Alert.alert('Success', 'You have been logged out');
          }
        }
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.background,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 30,
    },
    section: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 15,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.cardBackground,
      padding: 16,
      borderRadius: 12,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.border,
    },
    settingLabel: {
      flex: 1,
      fontSize: 16,
      color: theme.text,
      marginLeft: 12,
    },
    settingValue: {
      fontSize: 14,
      color: theme.secondaryText,
    },
    button: {
      backgroundColor: theme.selectedButton,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: theme.selectedButtonText,
      fontSize: 16,
      fontWeight: '600',
    },
    userInfo: {
      backgroundColor: theme.cardBackground,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    userText: {
      fontSize: 16,
      color: theme.text,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 14,
      color: theme.secondaryText,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings Demo</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme Settings</Text>
        <TouchableOpacity style={styles.settingItem} onPress={toggleTheme}>
          <Ionicons name="color-palette" size={24} color={theme.selectedButton} />
          <Text style={styles.settingLabel}>Theme</Text>
          <Text style={styles.settingValue}>{currentTheme}</Text>
        </TouchableOpacity>
        <Text style={[styles.settingValue, { marginTop: 8 }]}>
          Tap to cycle through Light → Dark → Moonlight themes.
          Your selection is automatically saved and will be restored when you reopen the app.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Authentication</Text>
        {isAuthenticated && user ? (
          <View>
            <View style={styles.userInfo}>
              <Text style={styles.userText}>Logged in as:</Text>
              <Text style={styles.userText}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
            <TouchableOpacity style={[styles.button, { marginTop: 12 }]} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.userInfo}>
            <Text style={styles.userText}>Not logged in</Text>
            <Text style={styles.userEmail}>Authentication state is also persisted</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Persistence Info</Text>
        <Text style={[styles.settingValue, { lineHeight: 20 }]}>
          Both theme and authentication state are automatically saved using AsyncStorage. 
          When you close and reopen the app, your preferences will be restored:
          {'\n\n'}• Theme selection is remembered
          {'\n'}• Login state is preserved (with 30-day expiration)
          {'\n'}• User profile data is cached
          {'\n'}• A loading screen shows while state is being restored
        </Text>
      </View>
    </View>
  );
};
