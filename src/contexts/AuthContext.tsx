import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, UserType } from '@/types';
import {
  clearStoredTokens,
  clearStoredUser,
  currentUserRequest,
  getStoredTokens,
  getStoredUser,
  loginRequest,
  logoutRequest,
  mapApiUser,
  registerRequest,
  setStoredTokens,
  setStoredUser,
} from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (email: string, password: string, userType: UserType) => Promise<boolean>;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const tokens = getStoredTokens();
    if (!tokens?.access) {
      setIsAuthLoading(false);
      return;
    }

    let isMounted = true;

    const syncCurrentUser = async () => {
      try {
        const apiUser = await currentUserRequest();
        if (!isMounted) return;

        const mappedUser = mapApiUser(apiUser);
        setUser(mappedUser);
        setStoredUser(mappedUser);
      } catch {
        if (!isMounted) return;
        setUser(null);
        clearStoredTokens();
        clearStoredUser();
      } finally {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      }
    };

    syncCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string, userType: UserType): Promise<boolean> => {
    const response = await loginRequest(email, password);
    const mappedUser = mapApiUser(response.user);

    if (mappedUser.userType !== userType) {
      return false;
    }

    setStoredTokens(response.tokens);
    setStoredUser(mappedUser);
    setUser(mappedUser);
    return true;
  };

  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    const response = await registerRequest({
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      password: userData.password,
      password_confirm: userData.password,
      user_type: userData.userType || 'public',
      // Some DRF serializers require these keys to be present even when blank.
      badge_number: userData.badgeNumber ?? '',
      fire_station: userData.fireStation ?? '',
    });

    const mappedUser = mapApiUser(response.user);
    setStoredTokens(response.tokens);
    setStoredUser(mappedUser);
    setUser(mappedUser);

    return true;
  };

  const logout = async () => {
    const tokens = getStoredTokens();

    try {
      if (tokens?.refresh && user) {
        await logoutRequest(tokens.refresh);
      }
    } catch {
      // Ignore logout API failures and clear local session regardless.
    } finally {
      clearStoredTokens();
      clearStoredUser();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
