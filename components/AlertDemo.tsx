import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useActionSheet } from '../components/ActionSheet';
import { Alert } from '../components/CustomAlert';
import { useToast } from '../components/Toast';
import { useTheme } from '../contexts/ThemeContext';

export default function AlertDemo() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { showToast, ToastComponent } = useToast();
  const { showActionSheet, ActionSheetComponent } = useActionSheet();

  // Custom Alert Examples
  const showTradeConfirmation = () => {
    Alert.alert(
      'Confirm Trade',
      'Buy 0.5 BTC for $25,000?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Buy Now', 
          onPress: () => {
            showToast({
              message: 'Trade executed successfully!',
              type: 'success',
              position: 'top'
            });
          }
        }
      ]
    );
  };

  const showDeleteConfirmation = () => {
    Alert.alert(
      'Delete Portfolio',
      'This will permanently delete all your portfolio data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            showToast({
              message: 'Portfolio deleted',
              type: 'error',
              position: 'bottom'
            });
          }
        }
      ]
    );
  };

  // Toast Examples
  const showSuccessToast = () => {
    showToast({
      message: 'Settings saved successfully!',
      type: 'success',
      duration: 2000,
    });
  };

  const showErrorToast = () => {
    showToast({
      message: 'Failed to connect to server',
      type: 'error',
      duration: 4000,
    });
  };

  const showWarningToast = () => {
    showToast({
      message: 'Low balance warning',
      type: 'warning',
      position: 'bottom',
    });
  };

  // Action Sheet Examples
  const showTradingOptions = () => {
    showActionSheet({
      title: 'Trading Options',
      message: 'Choose your trading action',
      buttons: [
        {
          text: 'Buy Bitcoin',
          onPress: () => {
            showToast({ message: 'Opening buy order...', type: 'info' });
          }
        },
        {
          text: 'Sell Bitcoin',
          onPress: () => {
            showToast({ message: 'Opening sell order...', type: 'info' });
          }
        },
        {
          text: 'View Charts',
          onPress: () => {
            showToast({ message: 'Opening charts...', type: 'info' });
          }
        },
        {
          text: 'Delete All Orders',
          style: 'destructive',
          onPress: () => {
            showToast({ message: 'All orders cancelled', type: 'error' });
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    });
  };

  const showAccountOptions = () => {
    showActionSheet({
      buttons: [
        { text: 'Edit Profile', onPress: () => console.log('Edit profile') },
        { text: 'Security Settings', onPress: () => console.log('Security') },
        { text: 'Export Data', onPress: () => console.log('Export') },
        { text: 'Logout', style: 'destructive', onPress: () => console.log('Logout') },
        { text: 'Cancel', style: 'cancel' }
      ]
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alert Demo</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Custom Alerts</Text>
      
      <TouchableOpacity style={styles.button} onPress={showTradeConfirmation}>
        <Text style={styles.buttonText}>Trade Confirmation</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={showDeleteConfirmation}>
        <Text style={styles.buttonText}>Delete Confirmation</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Toast Notifications</Text>
      
      <TouchableOpacity style={[styles.button, styles.successButton]} onPress={showSuccessToast}>
        <Text style={styles.buttonText}>Success Toast</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.errorButton]} onPress={showErrorToast}>
        <Text style={styles.buttonText}>Error Toast</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.warningButton]} onPress={showWarningToast}>
        <Text style={styles.buttonText}>Warning Toast</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Action Sheets</Text>
      
      <TouchableOpacity style={styles.button} onPress={showTradingOptions}>
        <Text style={styles.buttonText}>Trading Options</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={showAccountOptions}>
        <Text style={styles.buttonText}>Account Options</Text>
      </TouchableOpacity>

      {/* Toast and ActionSheet components */}
      <ToastComponent />
      <ActionSheetComponent />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.cardBackground,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    textAlign: 'center',
  },
  headerRight: {
    width: 40, // Same width as back button for centering
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.text,
    marginTop: 20,
    marginBottom: 12,
  },
  button: {
    backgroundColor: theme.buttonBackground,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  successButton: {
    backgroundColor: '#34C759',
  },
  errorButton: {
    backgroundColor: '#FF3B30',
  },
  warningButton: {
    backgroundColor: '#FF9500',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
