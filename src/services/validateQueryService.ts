const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api';

export interface ValidateQueryRequest {
  query: string;
  decimal: number;
}

export interface ValidateQueryResponse {
  success: boolean;
  message?: string;
  error?: string;
}

class GameService {
  async validateQuery(request: ValidateQueryRequest): Promise<ValidateQueryResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/game/validate-str`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (response.ok) {
        // 200 = consulta válida
        const data = await response.json().catch(() => ({}));
        return {
          success: true,
          message: data.message || 'Consulta SQL correcta'
        };
      } else {
        // 400 u otros errores = consulta inválida
        const errorData = await response.json().catch(() => ({ 
          error: 'Consulta SQL incorrecta' 
        }));
        return {
          success: false,
          error: errorData.error || errorData.message || 'Consulta SQL incorrecta'
        };
      }
    } catch (error) {
      console.error('Error validating query:', error);
      return {
        success: false,
        error: 'Error de conexión con el servidor'
      };
    }
  }
}

export const gameService = new GameService();