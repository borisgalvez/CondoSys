import { createContext } from 'react';
//import { User } from '../types/user';

interface AuthContextType {
  user: string | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<string>;
  isAuthenticated: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>(null!);
