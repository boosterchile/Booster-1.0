

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { UserProfile, AuthContextType, MockUserCredentials } from '../types';
import { apiService } from '../services/apiService';
import { localStorageService } from '../services/localStorageService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPersistedSession = async () => {
      setIsLoading(true);
      const authData = localStorageService.getAuthData();
      if (authData && authData.token) {
        try {
          const validationResponse = await apiService.validateToken(authData.token, authData.user.id);
          if (validationResponse.success) {
              setCurrentUser(validationResponse.data!);
              setToken(authData.token);
          } else {
            localStorageService.removeAuthData();
          }
        } catch (error) {
          console.error("Session validation failed:", error);
          localStorageService.removeAuthData();
        }
      }
      setIsLoading(false);
    };
    checkPersistedSession();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await apiService.login(username, password);
      if (response.success && response.data) {
        setCurrentUser(response.data.user);
        setToken(response.data.token);
        localStorageService.setAuthData(response.data.token, response.data.user);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: MockUserCredentials): Promise<{success: boolean; message?: string}> => {
     setIsLoading(true);
    try {
      const response = await apiService.register(userData);
       if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }
      // Log in automatically only if user is Active (e.g., Shippers)
      if (response.data?.status === 'Active') {
        await login(userData.username, userData.password!);
      }
      return { success: true };
    } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'Unknown registration error' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorageService.removeAuthData();
  };

  const value = {
    currentUser,
    token,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
