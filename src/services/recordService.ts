
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api';

export interface CreateRecordRequest {
  time: number;
  level: number;
  difficulty: 'easy' | 'medium' | 'hard';
  errorCount: number;
  idUser: string;
}

export interface CreateRecordResponse {
  success: boolean;
  message: string;
  recordId?: string;
}

export interface RankingEntry {
  position: number;
  username: string;
  time: number;
  errorCount: number;
  isCurrentUser: boolean;
}

export interface CurrentUser {
  position: number;
  username: string;
  time: number;
  errorCount: number;
  isCurrentUser: boolean;
}

export interface GetRankingResponse {
  currentUser: CurrentUser;
  difficulty: string;
  level: number;
  top5: RankingEntry[];
  totalPlayers: number;
}

class RecordService {
  private getStoredToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private getStoredUser(): { uuid: string } | null {
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

  async createRecord(recordData: Omit<CreateRecordRequest, 'idUser'>): Promise<CreateRecordResponse> {
    try {
      const user = this.getStoredUser();
      if (!user) {
        throw new Error('User not found in localStorage');
      }

      const fullRecordData: CreateRecordRequest = {
        ...recordData,
        idUser: user.uuid,
      };

      const data = await this.makeRequest<{ recordId?: string; id?: string }>('/record/create-record', {
        method: 'POST',
        body: JSON.stringify(fullRecordData),
      });

      return {
        success: true,
        message: 'Record created successfully',
        recordId: data.recordId || data.id,
      };
    } catch (error) {
      console.error('Error creating record:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getRanking(level: number, difficulty: 'easy' | 'medium' | 'hard'): Promise<GetRankingResponse> {
    try {
      const user = this.getStoredUser();
      if (!user) {
        throw new Error('User not found in localStorage');
      }

      const data = await this.makeRequest<GetRankingResponse>(`/record/ranking/${difficulty}/${level}/${user.uuid}`);
      return data;
    } catch (error) {
      console.error('Error fetching ranking:', error);
      throw error;
    }
  }
}

export const recordService = new RecordService();
