import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export const LoginDemo: React.FC = () => {
  const { theme } = useTheme();
  const { login, register, isLoading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Demo User');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: theme.secondaryText,
      marginBottom: 40,
      textAlign: 'center',
      lineHeight: 22,
    },
    input: {
      backgroundColor: theme.inputBackground,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: theme.text,
      marginBottom: 16,
    },
    button: {
      backgroundColor: theme.selectedButton,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 12,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: theme.selectedButtonText,
      fontSize: 16,
      fontWeight: '600',
    },
    switchButton: {
      alignItems: 'center',
      padding: 12,
    },
    switchText: {
      color: theme.selectedButton,
      fontSize: 14,
    },
    infoText: {
      fontSize: 12,
      color: theme.secondaryText,
      textAlign: 'center',
      marginTop: 20,
      lineHeight: 16,
    },
  });

  const handleLogin = async () => {
    const success = await login(email, password);
    if (success) {
      Alert.alert('Success', 'Login successful! Your session will be remembered.');
    } else {
      Alert.alert('Error', 'Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async () => {
    const success = await register(email, password, name);
    if (success) {
      Alert.alert('Success', 'Registration successful! You are now logged in.');
    } else {
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  if (isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Already Logged In!</Text>
        <Text style={styles.subtitle}>
          You&apos;re already authenticated. Check the Settings Demo to see your user info and logout option.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isRegisterMode ? 'Register' : 'Login'} Demo
      </Text>
      <Text style={styles.subtitle}>
        {isRegisterMode 
          ? 'Create a new account. Your session will be remembered across app restarts.'
          : 'Sign in to test persistent authentication. Use any email/password combination.'
        }
      </Text>

      {isRegisterMode && (
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor={theme.secondaryText}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={theme.secondaryText}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={theme.secondaryText}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={isRegisterMode ? handleRegister : handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Please wait...' : (isRegisterMode ? 'Register' : 'Login')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.switchButton} 
        onPress={() => setIsRegisterMode(!isRegisterMode)}
      >
        <Text style={styles.switchText}>
          {isRegisterMode 
            ? 'Already have an account? Login instead'
            : 'Don&apos;t have an account? Register instead'
          }
        </Text>
      </TouchableOpacity>

      <Text style={styles.infoText}>
        This is a demo with mock authentication. In a real app, this would connect to your backend API.
        The authentication state is persisted locally and will be restored when you reopen the app.
      </Text>
    </View>
  );
};
