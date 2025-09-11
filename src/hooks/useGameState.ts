import { useState, useEffect } from 'react';
import type { GameProgress, Level } from '../types/game';
import { challengesData } from '../data/challenges';

export const useGameState = () => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [gameProgress, setGameProgress] = useState<GameProgress>({
    currentLevel: 1,
    completedLevels: [],
    totalTime: 0,
    levelTimes: {},
    achievements: [],
    selectedDifficulty: 'easy'
  });

  // Initialize levels from JSON data
  useEffect(() => {
    const initialLevels: Level[] = challengesData.levels.map((levelData, index) => ({
      id: levelData.id,
      name: levelData.name,
      description: levelData.description,
      storySteps: JSON.parse(JSON.stringify(levelData.storySteps || [])),
      unlocked: index === 0, // Only first chapter is unlocked for MVP
      completed: false,
      bestTime: undefined
    }));

    setLevels(initialLevels);
  }, []);

  // Load game progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('unravel-sql-progress');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setGameProgress(parsed);
        
        // Update levels with saved progress (only first chapter unlocked for MVP)
        setLevels(prevLevels => 
          prevLevels.map(level => ({
            ...level,
            unlocked: level.id === 1, // Only first chapter unlocked for MVP
            completed: parsed.completedLevels.includes(level.id),
            bestTime: parsed.levelTimes[level.id]
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
      totalTime: gameProgress.totalTime + time,
      levelTimes: {
        ...gameProgress.levelTimes,
        [levelId]: time
      }
    };

    // For MVP, no additional chapters are unlocked
    // Future: Unlock next level when more chapters are available

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
      levelTimes: {},
      achievements: [],
      selectedDifficulty: 'easy'
    });
    
    setLevels(prevLevels =>
      prevLevels.map((level,) => ({
        ...level,
        // NOTE: Only first chapter unlocked for MVP
        unlocked: level.id === 1,
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
    currentLevel,
    gameProgress,
    completeLevel,
    selectLevel,
    resetProgress,
    setDifficulty
  };
};
