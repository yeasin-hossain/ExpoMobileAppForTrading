import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppWrapper } from '../components/AppWrapper';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppWrapper>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="login" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="chart" />
                <Stack.Screen name="trade" />
              </Stack>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </AppWrapper>
      </AuthProvider>
    </ThemeProvider>
  );
}
