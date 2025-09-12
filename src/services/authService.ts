import type { LoginCredentials, RegisterCredentials, AuthResponse, RefreshResponse, User } from '../types/game';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api';

class AuthService {
  private getStoredToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private setStoredToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  private setStoredUser(user: User): void {
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  private removeStoredToken(): void {
    localStorage.removeItem('access_token');
  }

  private removeStoredUser(): void {
    localStorage.removeItem('user_data');
  }

  getStoredUser(): User | null {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getStoredToken();
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    this.setStoredToken(response.access_token);
    this.setStoredUser(response.user);
    return response;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    this.setStoredToken(response.access_token);
    this.setStoredUser(response.user);
    return response;
  }

  async logout(): Promise<{ msg: string }> {
    const url = `${API_BASE_URL}/auth/logout`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    this.removeStoredToken();
    this.removeStoredUser();
    return result;
  }

  async refreshToken(): Promise<RefreshResponse> {
    const url = `${API_BASE_URL}/auth/refresh`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    this.setStoredToken(result.access_token);
    return result;
  }

  async checkAuth(): Promise<boolean> {
    const token = this.getStoredToken();
    if (!token) {
      return false;
    }

    return true;
  }

  async refreshTokenAndGetUser(): Promise<{ user: User | null; isAuthenticated: boolean }> {
    const token = this.getStoredToken();
    if (!token) {
      return { user: null, isAuthenticated: false };
    }

    try {
      await this.refreshToken();
      return { 
        user: { uuid: 'authenticated', username: 'User' }, 
        isAuthenticated: true 
      };
    } catch {
      this.removeStoredToken();
      return { user: null, isAuthenticated: false };
    }
  }
}

export const authService = new AuthService();
