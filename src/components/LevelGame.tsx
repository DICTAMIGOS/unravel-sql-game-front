import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Home } from 'lucide-react';
import type { Level } from '../types/game';
import { ChallengeCard } from './ChallengeCard';

interface LevelGameProps {
  level: Level;
  selectedDifficulty: 'easy' | 'medium' | 'hard';
  onBack: () => void;
  onLevelComplete: (levelId: number, totalTime: number) => void;
  className?: string;
}

export const LevelGame: React.FC<LevelGameProps> = ({
  level,
  selectedDifficulty,
  onBack,
  onLevelComplete,
  className = ''
}) => {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [challengeTimes, setChallengeTimes] = useState<number[]>([]);
  const [isLevelCompleted, setIsLevelCompleted] = useState(false);
  const [totalLevelTime, setTotalLevelTime] = useState(0);

  const currentChallenge = level.challenges[currentChallengeIndex];

  useEffect(() => {
    // Reset state when level changes
    setCurrentChallengeIndex(0);
    setChallengeTimes([]);
    setIsLevelCompleted(false);
    setTotalLevelTime(0);
  }, [level.id]);

  const handleChallengeComplete = (time: number) => {
    const newChallengeTimes = [...challengeTimes, time];
    setChallengeTimes(newChallengeTimes);

    const newTotalTime = newChallengeTimes.reduce((sum, t) => sum + t, 0);
    setTotalLevelTime(newTotalTime);

    if (currentChallengeIndex === level.challenges.length - 1) {
      setIsLevelCompleted(true);
      onLevelComplete(level.id, newTotalTime);
    }
  };

  const handleNextChallenge = () => {
    if (currentChallengeIndex < level.challenges.length - 1) {
      setCurrentChallengeIndex(prev => prev + 1);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAverageTime = (): number => {
    if (challengeTimes.length === 0) return 0;
    return Math.round(challengeTimes.reduce((sum, time) => sum + time, 0) / challengeTimes.length);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-900/20';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20';
      case 'hard': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Medio';
      case 'hard': return 'Difícil';
      default: return 'Desconocido';
    }
  };

  const getTimeLimitForDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 180; // 3 minutos
      case 'medium': return 120; // 2 minutos
      case 'hard': return 60; // 1 minutos
      default: return 180;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBack}
                className="flex items-center gap-2 text-gray-300 hover:text-gray-100 transition-colors cursor-pointer bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg border border-gray-600"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </motion.button>

            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-100">
                {level.name}:
              </h1>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedDifficulty)}`}>
                {getDifficultyLabel(selectedDifficulty)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {isLevelCompleted ? (
            <motion.div
              key="completion"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl max-w-2xl mx-auto">
                <div className="flex justify-center mb-6">
                  <Trophy className="w-16 h-16 text-yellow-400" />
                </div>

                <h2 className="text-3xl font-bold text-gray-100 mb-4">
                  ¡Capítulo Completado!
                </h2>

                <p className="text-gray-300 mb-6">
                  Has completado todos los desafíos del {level.name}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-primary-400 mb-1">
                      {formatTime(totalLevelTime)}
                    </div>
                    <div className="text-sm text-gray-400">Tiempo Total</div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-accent-400 mb-1">
                      {formatTime(getAverageTime())}
                    </div>
                    <div className="text-sm text-gray-400">Tiempo Promedio</div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
                    </div>
                    <div className="text-sm text-gray-400">Dificultad</div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onBack}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center gap-2 border border-gray-600 cursor-pointer"
                  >
                    <Home className="w-4 h-4" />
                    Volver a Capítulos
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="challenge"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ChallengeCard
                challenge={currentChallenge}
                timeLimit={getTimeLimitForDifficulty(selectedDifficulty)}
                onComplete={handleChallengeComplete}
                onNext={handleNextChallenge}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
