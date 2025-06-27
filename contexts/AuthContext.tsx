import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuthState = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('user_data'),
        AsyncStorage.removeItem('auth_token'),
        AsyncStorage.removeItem('last_login')
      ]);
    } catch (error) {
      console.error('Error clearing auth state:', error);
    }
  };

  const loadAuthState = useCallback(async () => {
    try {
      const [savedUser, authToken, lastLogin] = await Promise.all([
        AsyncStorage.getItem('user_data'),
        AsyncStorage.getItem('auth_token'),
        AsyncStorage.getItem('last_login')
      ]);

      if (savedUser && authToken) {
        const userData = JSON.parse(savedUser);
        
        // Check if the session is still valid (e.g., not older than 30 days)
        if (lastLogin) {
          const lastLoginDate = new Date(lastLogin);
          const now = new Date();
          const daysDiff = (now.getTime() - lastLoginDate.getTime()) / (1000 * 3600 * 24);
          
          if (daysDiff > 30) {
            // Session expired, clear auth state
            await clearAuthState();
            return;
          }
        }
        
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
      // Clear potentially corrupted data
      await clearAuthState();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load auth state from storage on app startup
  useEffect(() => {
    loadAuthState();
  }, [loadAuthState]);

  const saveAuthState = async (userData: User, token: string) => {
    try {
      await Promise.all([
        AsyncStorage.setItem('user_data', JSON.stringify(userData)),
        AsyncStorage.setItem('auth_token', token),
        AsyncStorage.setItem('last_login', new Date().toISOString())
      ]);
    } catch (error) {
      console.error('Error saving auth state:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      if (email && password) {
        const userData: User = {
          id: Date.now().toString(),
          email,
          name: email.split('@')[0],
          avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=007AFF&color=fff`
        };
        
        const mockToken = 'mock_jwt_token_' + Date.now();
        
        setUser(userData);
        await saveAuthState(userData, mockToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      if (email && password && name) {
        const userData: User = {
          id: Date.now().toString(),
          email,
          name,
          avatar: `https://ui-avatars.com/api/?name=${name}&background=007AFF&color=fff`
        };
        
        const mockToken = 'mock_jwt_token_' + Date.now();
        
        setUser(userData);
        await saveAuthState(userData, mockToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setUser(null);
      await clearAuthState();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = async (updates: Partial<User>): Promise<void> => {
    if (user) {
      try {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        
        const authToken = await AsyncStorage.getItem('auth_token');
        if (authToken) {
          await saveAuthState(updatedUser, authToken);
        }
      } catch (error) {
        console.error('Update user error:', error);
      }
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        isLoading, 
        login, 
        logout, 
        register, 
        updateUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
