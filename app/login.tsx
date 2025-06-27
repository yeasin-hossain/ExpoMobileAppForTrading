import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { useTheme } from '../contexts/ThemeContext';

export default function LoginScreen() {
  const { theme, toggleTheme, currentTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setIsBiometricSupported(compatible);
    
    if (compatible) {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setBiometricType('fingerprint');
      } else if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometricType('face');
      } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        setBiometricType('iris');
      }
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with your biometric',
        fallbackLabel: 'Use Password',
        disableDeviceFallback: false,
        cancelLabel: 'Cancel',
      });

      if (biometricAuth.success) {
        setIsLoading(true);
        // Simulate successful authentication
        setTimeout(() => {
          setIsLoading(false);
          router.replace('/(tabs)');
        }, 1000);
      } else {
        Alert.alert('Authentication Failed', 'Biometric authentication was cancelled or failed');
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      Alert.alert('Error', 'An error occurred during biometric authentication');
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to tabs after successful login
      router.replace('/(tabs)');
    }, 1500);
  };

  const handleSignUp = () => {
    Alert.alert('Sign Up', 'Sign up functionality would be implemented here');
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset functionality would be implemented here');
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Theme Toggle Button */}
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          <Ionicons 
            name={currentTheme === 'light' ? 'sunny' : currentTheme === 'dark' ? 'moon' : 'moon-outline'} 
            size={24} 
            color={theme.text} 
          />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="camera" size={60} color={theme.selectedButton} />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>StickerSmash</Text>
          <Text style={[styles.subtitle, { color: theme.secondaryText }]}>Welcome back!</Text>
        </View>

        <View style={styles.form}>
          <View style={[styles.inputContainer, { 
            backgroundColor: theme.inputBackground, 
            borderColor: theme.inputBorder 
          }]}>
            <Ionicons name="mail" size={20} color={theme.secondaryText} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={theme.secondaryText}
            />
          </View>

          <View style={[styles.inputContainer, { 
            backgroundColor: theme.inputBackground, 
            borderColor: theme.inputBorder 
          }]}>
            <Ionicons name="lock-closed" size={20} color={theme.secondaryText} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={theme.secondaryText}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons 
                name={showPassword ? "eye-off" : "eye"} 
                size={20} 
                color={theme.secondaryText} 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
            <Text style={[styles.forgotPasswordText, { color: theme.selectedButton }]}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.loginButton, 
              { backgroundColor: theme.selectedButton },
              isLoading && styles.loginButtonDisabled
            ]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={[styles.loginButtonText, { color: theme.selectedButtonText }]}>Signing In...</Text>
            ) : (
              <Text style={[styles.loginButtonText, { color: theme.selectedButtonText }]}>Sign In</Text>
            )}
          </TouchableOpacity>

          {isBiometricSupported && (
            <TouchableOpacity 
              style={[styles.biometricButton, { borderColor: theme.selectedButton }]} 
              onPress={handleBiometricAuth}
              disabled={isLoading}
            >
              <Ionicons 
                name={biometricType === 'face' ? 'scan' : 'finger-print'} 
                size={24} 
                color={theme.selectedButton} 
              />
              <Text style={[styles.biometricButtonText, { color: theme.selectedButton }]}>
                {biometricType === 'face' ? 'Face ID' : 'Touch ID'}
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            <Text style={[styles.dividerText, { color: theme.secondaryText }]}>OR</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          </View>

          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-google" size={20} color="#fff" />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
            <Ionicons name="logo-facebook" size={20} color="#fff" />
            <Text style={styles.socialButtonText}>Continue with Facebook</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.secondaryText }]}>Don&apos;t have an account? </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={[styles.signUpText, { color: theme.selectedButton }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeToggle: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1000,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: 50,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
  },
  biometricButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dc4e41',
    height: 50,
    borderRadius: 12,
    marginBottom: 12,
  },
  facebookButton: {
    backgroundColor: '#4267B2',
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  signUpText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
