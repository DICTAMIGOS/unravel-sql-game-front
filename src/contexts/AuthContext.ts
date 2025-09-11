import { createContext } from 'react';
import type { AuthState, LoginCredentials, RegisterCredentials } from '../types/game';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null as AuthContextType | null);
