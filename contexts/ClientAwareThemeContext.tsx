import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getClientConfig } from '../config/ClientManager';

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
  
  // Client-specific brand colors
  brandPrimary: string;
  brandSecondary: string;
  brandAccent: string;
}

const createClientTheme = (baseTheme: Omit<ThemeColors, 'brandPrimary' | 'brandSecondary' | 'brandAccent'>): ThemeColors => {
  const clientConfig = getClientConfig();
  
  return {
    ...baseTheme,
    brandPrimary: clientConfig.primaryColor,
    brandSecondary: clientConfig.secondaryColor,
    brandAccent: clientConfig.accentColor,
    // Override some base colors with client colors
    selectedButton: clientConfig.primaryColor,
    buttonBackground: clientConfig.primaryColor,
    tabBarActiveColor: clientConfig.primaryColor,
  };
};

const lightThemeBase = {
  name: 'light',
  background: '#FFFFFF',
  headerBackground: '#F8F9FA',
  headerBorder: '#E5E5E7',
  text: '#000000',
  secondaryText: '#6C6C70',
  border: '#E5E5E7',
  buttonBackground: '#007AFF',
  buttonBorder: '#007AFF',
  selectedButton: '#007AFF',
  selectedButtonText: '#FFFFFF',
  panelBackground: '#F8F9FA',
  indicatorBox: '#F0F0F0',
  cardBackground: '#FFFFFF',
  inputBackground: '#F8F9FA',
  inputBorder: '#E5E5E7',
  errorText: '#FF3B30',
  successText: '#34C759',
  warningText: '#FF9500',
  tabBarBackground: '#F8F9FA',
  tabBarActiveColor: '#007AFF',
  tabBarInactiveColor: '#8E8E93',
  tradingViewTheme: 'light' as const,
};

const darkThemeBase = {
  name: 'dark',
  background: '#000000',
  headerBackground: '#1C1C1E',
  headerBorder: '#38383A',
  text: '#FFFFFF',
  secondaryText: '#8E8E93',
  border: '#38383A',
  buttonBackground: '#0A84FF',
  buttonBorder: '#0A84FF',
  selectedButton: '#0A84FF',
  selectedButtonText: '#FFFFFF',
  panelBackground: '#1C1C1E',
  indicatorBox: '#2C2C2E',
  cardBackground: '#1C1C1E',
  inputBackground: '#2C2C2E',
  inputBorder: '#38383A',
  errorText: '#FF453A',
  successText: '#30D158',
  warningText: '#FF9F0A',
  tabBarBackground: '#1C1C1E',
  tabBarActiveColor: '#0A84FF',
  tabBarInactiveColor: '#8E8E93',
  tradingViewTheme: 'dark' as const,
};

const moonlightThemeBase = {
  name: 'moonlight',
  background: '#0F1419',
  headerBackground: '#1A1F2E',
  headerBorder: '#2A2F3E',
  text: '#E6E6E6',
  secondaryText: '#A0A0A0',
  border: '#2A2F3E',
  buttonBackground: '#4A9EFF',
  buttonBorder: '#4A9EFF',
  selectedButton: '#4A9EFF',
  selectedButtonText: '#FFFFFF',
  panelBackground: '#1A1F2E',
  indicatorBox: '#252A39',
  cardBackground: '#1A1F2E',
  inputBackground: '#252A39',
  inputBorder: '#2A2F3E',
  errorText: '#FF6B6B',
  successText: '#51CF66',
  warningText: '#FFD93D',
  tabBarBackground: '#1A1F2E',
  tabBarActiveColor: '#4A9EFF',
  tabBarInactiveColor: '#A0A0A0',
  tradingViewTheme: 'dark' as const,
};

// Create client-aware themes
export const themes: Record<ThemeType, ThemeColors> = {
  light: createClientTheme(lightThemeBase),
  dark: createClientTheme(darkThemeBase),
  moonlight: createClientTheme(moonlightThemeBase),
};

interface ThemeContextType {
  theme: ThemeColors;
  themeType: ThemeType;
  setTheme: (theme: ThemeType) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = '@app_theme';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const clientConfig = getClientConfig();
  const defaultTheme = clientConfig.theme.darkMode ? 'dark' : 'light';
  
  const [themeType, setThemeType] = useState<ThemeType>(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && (savedTheme as ThemeType) in themes) {
          setThemeType(savedTheme as ThemeType);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  const setTheme = async (newTheme: ThemeType) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setThemeType(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const value: ThemeContextType = {
    theme: themes[themeType],
    themeType,
    setTheme,
    isLoading,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
