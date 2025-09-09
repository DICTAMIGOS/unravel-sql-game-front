export interface SQLChallenge {
  id: string;
  title: string;
  description: string;
  level: number;
  template: string;
  solution: string;
}

export interface Level {
  id: number;
  name: string;
  description: string;
  challenges: SQLChallenge[];
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
