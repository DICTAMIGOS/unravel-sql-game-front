import { useState, useEffect } from 'react';
import type { GameProgress, Level } from '../types/game';
import { challengesData } from '../data/challenges';

export const useGameState = () => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [gameProgress, setGameProgress] = useState<GameProgress>({
    currentLevel: 1,
    completedLevels: [],
    totalTime: 0,
    achievements: [],
    selectedDifficulty: 'easy'
  });

  // Initialize levels from JSON data
  useEffect(() => {
    const initialLevels: Level[] = challengesData.levels.map((levelData) => ({
      id: levelData.id,
      name: levelData.name,
      description: levelData.description,
      storySteps: JSON.parse(JSON.stringify(levelData.storySteps || [])),
      unlocked: true, // All chapters are unlocked
      completed: false,
      bestTime: undefined
    }));

    setLevels(initialLevels);
    setIsLoading(false);
  }, []);

  // Load game progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('unravel-sql-progress');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setGameProgress(parsed);
        
        // Update levels with saved progress (all chapters unlocked)
        setLevels(prevLevels => 
          prevLevels.map(level => ({
            ...level,
            unlocked: true, // All chapters are unlocked
            completed: parsed.completedLevels.includes(level.id),
            bestTime: undefined // No longer tracking individual level times
          }))
        );
      } catch (error) {
        console.error('Error loading game progress:', error);
      }
    }
  }, []);

  // Save game progress to localStorage
  const saveProgress = (newProgress: GameProgress) => {
    setGameProgress(newProgress);
    localStorage.setItem('unravel-sql-progress', JSON.stringify(newProgress));
  };

  const completeLevel = (levelId: number, time: number) => {
    const newProgress: GameProgress = {
      ...gameProgress,
      completedLevels: [...gameProgress.completedLevels, levelId],
      totalTime: gameProgress.totalTime + time
    };

    // All chapters are already unlocked
    // Future: Could implement progressive unlocking if desired

    // Update current level (stay on current level for MVP)
    setCurrentLevel(levelId);
    newProgress.currentLevel = levelId;

    // Mark level as completed
    setLevels(prevLevels =>
      prevLevels.map(level =>
        level.id === levelId
          ? { ...level, completed: true, bestTime: time }
          : level
      )
    );

    saveProgress(newProgress);
  };

  const selectLevel = (levelId: number) => {
    const level = levels.find(l => l.id === levelId);
    if (level && level.unlocked) {
      setCurrentLevel(levelId);
    }
  };

  const resetProgress = () => {
    localStorage.removeItem('unravel-sql-progress');
    setGameProgress({
      currentLevel: 1,
      completedLevels: [],
      totalTime: 0,
      achievements: [],
      selectedDifficulty: 'easy'
    });
    
    setLevels(prevLevels =>
      prevLevels.map((level,) => ({
        ...level,
        // NOTE: All chapters are unlocked
        unlocked: true,
        completed: false,
        bestTime: undefined
      }))
    );
    
    setCurrentLevel(1);
  };

  const setDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    setGameProgress(prev => ({
      ...prev,
      selectedDifficulty: difficulty
    }));
  };

  return {
    levels,
    isLoading,
    currentLevel,
    gameProgress,
    completeLevel,
    selectLevel,
    resetProgress,
    setDifficulty
  };
};
