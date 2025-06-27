import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoadingScreen } from './LoadingScreen';

interface AppWrapperProps {
  children: React.ReactNode;
}

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  const { isLoading: authLoading } = useAuth();
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Wait for auth to finish loading
        if (!authLoading) {
          // Additional app initialization can go here
          await new Promise(resolve => setTimeout(resolve, 500)); // Minimum splash time
          setIsAppReady(true);
        }
      } catch (e) {
        console.warn('Error during app initialization:', e);
        setIsAppReady(true); // Still show app even if there's an error
      }
    }

    prepare();
  }, [authLoading]);

  useEffect(() => {
    if (isAppReady) {
      SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  if (!isAppReady) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};
