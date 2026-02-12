import React, { createContext, useState, useContext, useEffect } from 'react';
import { storage } from '../utils/localStorage';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: any | null;
  login: (token: string) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const token = storage.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        storage.clear();
      }
    }
  }, []);

  const login = (token: string) => {
    storage.setToken(token);
    const decoded: any = jwtDecode(token);
    setUser(decoded);
  };

  const logout = () => {
    storage.clear();
    setUser(null);
  };

  const isAdmin = () => user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};