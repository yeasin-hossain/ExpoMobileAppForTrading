import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type ThemeType = 'light' | 'dark' | 'moonlight';

export interface ThemeColors {
  name: string;
  background: string;
  headerBackground: string;
  headerBorder: string;
  text: string;
  secondaryText: string;
  border: string;
  buttonBackground: string;
  buttonBorder: string;
  selectedButton: string;
  selectedButtonText: string;
  panelBackground: string;
  indicatorBox: string;
  cardBackground: string;
  inputBackground: string;
  inputBorder: string;
  errorText: string;
  successText: string;
  warningText: string;
  tabBarBackground: string;
  tabBarActiveColor: string;
  tabBarInactiveColor: string;
  tradingViewTheme: 'light' | 'dark';
  tradingViewToolbar: string;
}

const themes: Record<ThemeType, ThemeColors> = {
  light: {
    name: 'Light',
    background: '#fff',
    headerBackground: '#f8f9fa',
    headerBorder: '#e9ecef',
    text: '#333',
    secondaryText: '#666',
    border: '#e9ecef',
    buttonBackground: '#fff',
    buttonBorder: '#ddd',
    selectedButton: '#007AFF',
    selectedButtonText: '#fff',
    panelBackground: '#fff',
    indicatorBox: '#f8f9fa',
    cardBackground: '#fff',
    inputBackground: '#fff',
    inputBorder: '#ddd',
    errorText: '#dc3545',
    successText: '#28a745',
    warningText: '#ffc107',
    tabBarBackground: '#fff',
    tabBarActiveColor: '#007AFF',
    tabBarInactiveColor: '#8e8e93',
    tradingViewTheme: 'light',
    tradingViewToolbar: '#f1f3f6',
  },
  dark: {
    name: 'Dark',
    background: '#1a1a1a',
    headerBackground: '#2d2d2d',
    headerBorder: '#404040',
    text: '#fff',
    secondaryText: '#ccc',
    border: '#404040',
    buttonBackground: '#2d2d2d',
    buttonBorder: '#505050',
    selectedButton: '#0066cc',
    selectedButtonText: '#fff',
    panelBackground: '#2d2d2d',
    indicatorBox: '#333333',
    cardBackground: '#2d2d2d',
    inputBackground: '#333333',
    inputBorder: '#505050',
    errorText: '#ff6b6b',
    successText: '#51cf66',
    warningText: '#ffd43b',
    tabBarBackground: '#2d2d2d',
    tabBarActiveColor: '#0066cc',
    tabBarInactiveColor: '#8e8e93',
    tradingViewTheme: 'dark',
    tradingViewToolbar: '#2d2d2d',
  },
  moonlight: {
    name: 'Moonlight',
    background: '#0f1419',
    headerBackground: '#1e2328',
    headerBorder: '#2e3338',
    text: '#e6e8ea',
    secondaryText: '#9ca3af',
    border: '#2e3338',
    buttonBackground: '#1e2328',
    buttonBorder: '#3e4348',
    selectedButton: '#6366f1',
    selectedButtonText: '#fff',
    panelBackground: '#1e2328',
    indicatorBox: '#252930',
    cardBackground: '#1e2328',
    inputBackground: '#252930',
    inputBorder: '#3e4348',
    errorText: '#f87171',
    successText: '#34d399',
    warningText: '#fbbf24',
    tabBarBackground: '#1e2328',
    tabBarActiveColor: '#6366f1',
    tabBarInactiveColor: '#6b7280',
    tradingViewTheme: 'dark',
    tradingViewToolbar: '#1e2328',
  },
};

interface ThemeContextType {
  currentTheme: ThemeType;
  theme: ThemeColors;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('light');

  // Load theme from storage on app startup
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('app_theme');
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'moonlight')) {
        setCurrentTheme(savedTheme as ThemeType);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const saveTheme = async (theme: ThemeType) => {
    try {
      await AsyncStorage.setItem('app_theme', theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const theme = themes[currentTheme];

  const setTheme = (newTheme: ThemeType) => {
    setCurrentTheme(newTheme);
    saveTheme(newTheme);
  };

  const toggleTheme = () => {
    const themeOrder: ThemeType[] = ['light', 'dark', 'moonlight'];
    const currentIndex = themeOrder.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    const newTheme = themeOrder[nextIndex];
    setCurrentTheme(newTheme);
    saveTheme(newTheme);
  };

  const contextValue = { currentTheme, theme, setTheme, toggleTheme };

  return (
    <ThemeContext.Provider value={contextValue}>
      <StatusBar style={currentTheme === 'light' ? 'dark' : 'light'} />
      {children}
    </ThemeContext.Provider>
  );
};
