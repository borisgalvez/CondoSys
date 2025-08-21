/* import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import api from '../services/api';


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await api.get('/users/me/', {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          console.log(response.data.role);
          
          setUser(response.data.role);
          setToken(storedToken);
        } catch (error: any) {
					console.error(error);
          logout();
        }
      }
      setLoading(false);
    };
    
    initializeAuth();
  }, []);

  const login = async (username: string, password: string) => {
    console.log({ username, password });
    
    const response = await api.post('/auth/login/', { username, password });
    const { access, refresh, role } = response.data;
    
    localStorage.setItem('token', access);
    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('role', role);
    setToken(access);
    setUser(role);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    setToken(null);
    setUser(null);
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh');
      const response = await api.post('/auth/refresh/', { refresh: refreshToken });
      console.log(response.data);
      
      const { access } = response.data;
      
      localStorage.setItem('token', access);
      setToken(access);
      return access;
    } catch (error) {
      logout();
      throw error;
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    refreshToken,
    isAuthenticated: !!token,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
 */
// src/context/AuthProvider.tsx
import { useEffect, useState, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import api, { setLogoutFunction } from '../services/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Función de logout bien definida
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('role');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  }, []);

  // Inyectar la función de logout al api.ts al montar el provider
  useEffect(() => {
    setLogoutFunction(logout);
    
    return () => {
      // Limpiar al desmontar
      setLogoutFunction(() => {});
    };
  }, [logout]);

  const refreshToken = useCallback(async (): Promise<string> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await api.post('/auth/refresh/', { refresh: refreshToken });
      const { access } = response.data;
      
      localStorage.setItem('token', access);
      setToken(access);
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      return access;
    } catch (error) {
      logout();
      throw error;
    }
  }, [logout]);

  const initializeAuth = useCallback(async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/users/me/');
      setUser(response.data.role);
      setToken(storedToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    } catch (error) {
      console.error(error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (username: string, password: string) => {
    const response = await api.post('/auth/login/', { username, password });
    const { access, refresh, role } = response.data;
    
    localStorage.setItem('token', access);
    localStorage.setItem('refresh', refresh);
    localStorage.setItem('role', role);
    setToken(access);
    setUser(role);
    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
  };

  const value = {
    user,
    token,
    login,
    logout,
    refreshToken,
    isAuthenticated: !!token,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}