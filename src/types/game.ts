export interface SQLChallenge {
  id: string;
  title: string;
  description: string;
  level: number;
  template: string;
  solution: string;
}

export interface StoryImage {
  id: string;
  url: string;
  caption?: string;
  order: number;
}

export interface ChallengeSequence {
  id: string;
  title: string;
  description: string;
  challenges: SQLChallenge[];
  order: number;
}

export interface StoryStep {
  type: 'image' | 'sequence';
  order: number;
  data: StoryImage | ChallengeSequence;
}

export interface Level {
  id: number;
  name: string;
  description: string;
  storySteps: StoryStep[];
  unlocked: boolean;
  completed: boolean;
  bestTime?: number;
}

export interface GameProgress {
  currentLevel: number;
  completedLevels: number[];
  totalTime: number;
  levelTimes: { [levelId: number]: number };
  achievements: string[];
  selectedDifficulty: 'easy' | 'medium' | 'hard';
}

export interface TimerState {
  isRunning: boolean;
  startTime: number | null;
  elapsedTime: number;
  timeLimit?: number;
}

export interface User {
  id: string;
  username: string;
  email?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
  email?: string;
}

export interface AuthResponse {
  msg: string;
  user: User;
  access_token: string;
  refresh_token?: string;
}

export interface RefreshResponse {
  msg: string;
  access_token: string;
}
