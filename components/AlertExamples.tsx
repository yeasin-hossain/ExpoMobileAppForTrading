import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Alert, useCustomAlert } from '../components/CustomAlert';

export default function AlertExamples() {
  const { showAlert, AlertComponent } = useCustomAlert();

  // Method 1: Using the static Alert (similar to React Native Alert)
  const showSimpleAlert = () => {
    Alert.alert('Hello', 'This is a simple alert!');
  };

  const showConfirmAlert = () => {
    Alert.alert(
      'Confirm Action',
      'Are you sure you want to proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'OK', 
          onPress: () => console.log('User confirmed!') 
        }
      ]
    );
  };

  const showDestructiveAlert = () => {
    Alert.alert(
      'Delete Item',
      'This action cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => console.log('Item deleted!') 
        }
      ]
    );
  };

  // Method 2: Using the hook (more control)
  const showCustomHookAlert = () => {
    showAlert({
      title: 'Custom Hook Alert',
      message: 'This alert is shown using the useCustomAlert hook!',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => console.log('Hook alert confirmed!') }
      ]
    });
  };

  const showTradingAlert = () => {
    Alert.alert(
      'Trade Executed',
      'Your Bitcoin purchase of $1,000 has been completed successfully.',
      [
        { text: 'View Portfolio', onPress: () => console.log('Navigate to portfolio') },
        { text: 'OK' }
      ]
    );
  };

  const showErrorAlert = () => {
    Alert.alert(
      'Connection Error',
      'Unable to connect to the server. Please check your internet connection and try again.',
      [
        { text: 'Retry', onPress: () => console.log('Retrying...') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={showSimpleAlert}>
        <Text style={styles.buttonText}>Simple Alert</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={showConfirmAlert}>
        <Text style={styles.buttonText}>Confirm Alert</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={showDestructiveAlert}>
        <Text style={styles.buttonText}>Destructive Alert</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={showCustomHookAlert}>
        <Text style={styles.buttonText}>Custom Hook Alert</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={showTradingAlert}>
        <Text style={styles.buttonText}>Trading Success</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={showErrorAlert}>
        <Text style={styles.buttonText}>Error Alert</Text>
      </TouchableOpacity>

      {/* This renders the alert when using the hook */}
      <AlertComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    gap: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
