
import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { User, Role } from '../types';
import { MOCK_USERS } from '../services/mockApi';

interface AuthContextType {
  user: User | null;
  login: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userId: string) => {
    const userToLogin = MOCK_USERS.find(u => u.id === userId);
    if (userToLogin) {
      setUser(userToLogin);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
