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

  private removeStoredProgress(): void {
    localStorage.removeItem('unravel-sql-progress');
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

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: 'Error de conexión con el servidor' 
        }));
        
        // Provide user-friendly error messages based on status codes
        let errorMessage = errorData.error || errorData.msg;
        
        switch (response.status) {
          case 400:
            errorMessage = errorMessage || 'Datos de entrada inválidos';
            break;
          case 401:
            if (endpoint.includes('login')) {
              errorMessage = 'Credenciales incorrectas. Verifica tu ID de agente y código de acceso';
            } else {
              errorMessage = 'No autorizado. Tu sesión ha expirado';
            }
            break;
          case 403:
            errorMessage = 'Acceso denegado. No tienes permisos para realizar esta acción';
            break;
          case 404:
            errorMessage = 'Servicio no encontrado. Contacta al administrador del sistema';
            break;
          case 409:
            if (endpoint.includes('register')) {
              errorMessage = 'Este ID de agente ya está registrado en el sistema';
            } else {
              errorMessage = 'Conflicto de datos. El recurso ya existe';
            }
            break;
          case 422:
            errorMessage = 'Datos de entrada no válidos. Verifica la información proporcionada';
            break;
          case 500:
            errorMessage = 'Error interno del servidor. Intenta nuevamente más tarde';
            break;
          case 503:
            errorMessage = 'Servicio temporalmente no disponible. Intenta más tarde';
            break;
          default:
            if (!errorMessage) {
              errorMessage = `Error del servidor (${response.status}). Intenta nuevamente`;
            }
        }
        
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Error de conexión. Verifica tu conexión a internet y que el servidor esté funcionando');
      }
      throw error;
    }
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
    try {
      const url = `${API_BASE_URL}/auth/logout`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: 'Error de conexión con el servidor' 
        }));
        throw new Error(errorData.error || `Error del servidor (${response.status})`);
      }

      const result = await response.json();
      
      this.removeStoredToken();
      this.removeStoredUser();
      this.removeStoredProgress();
      return result;
    } catch (error) {
      // Even if logout fails on server, clear local storage
      this.removeStoredToken();
      this.removeStoredUser();
      this.removeStoredProgress();
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Error de conexión al cerrar sesión. Los datos locales han sido eliminados');
      }
      throw error;
    }
  }

  async refreshToken(): Promise<RefreshResponse> {
    try {
      const url = `${API_BASE_URL}/auth/refresh`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: 'Error de conexión con el servidor' 
        }));
        throw new Error(errorData.error || `Error del servidor (${response.status})`);
      }

      const result = await response.json();
      
      this.setStoredToken(result.access_token);
      return result;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Error de conexión al renovar sesión');
      }
      throw error;
    }
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
