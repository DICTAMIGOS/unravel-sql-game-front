import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Home, Shield, Search, AlertTriangle, Target, FileText } from 'lucide-react';
import type { Level } from '../../types/game';
import { ChallengeCard } from '../../components/ChallengeCard';

interface GameViewProps {
  level: Level;
  selectedDifficulty: 'easy' | 'medium' | 'hard';
  onBack: () => void;
  onLevelComplete: (levelId: number, totalTime: number) => void;
  className?: string;
}

export const GameView: React.FC<GameViewProps> = ({
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
      case 'easy': return 'text-green-400 bg-green-900/20 border-green-600';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-600';
      case 'hard': return 'text-red-400 bg-red-900/20 border-red-600';
      default: return 'text-gray-400 bg-gray-800 border-gray-600';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'NIVEL 1';
      case 'medium': return 'NIVEL 2';
      case 'hard': return 'NIVEL 3';
      default: return 'DESCONOCIDO';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <Shield className="w-4 h-4" />;
      case 'medium': return <Target className="w-4 h-4" />;
      case 'hard': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTimeLimitForDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 180; 
      case 'medium': return 120;
      case 'hard': return 60;
      default: return 180;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-900 ${className}`}>
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          {/* Mobile Layout */}
          <div className="block sm:hidden">
            <div className="flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBack}
                className="flex items-center gap-1 text-gray-300 hover:text-gray-100 transition-colors cursor-pointer bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded-lg border border-gray-600 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden xs:inline">Volver</span>
              </motion.button>
              
              <div className="flex items-center gap-2">
                <div className="bg-primary-500 p-1.5 rounded-lg">
                  <Search className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-100 font-mono">
                    MISIÓN {level.id}
                  </h1>
                </div>
              </div>
              
              <span className={`px-2 py-1 rounded text-xs font-medium font-mono border ${getDifficultyColor(selectedDifficulty)} flex items-center gap-1`}>
                {getDifficultyIcon(selectedDifficulty)}
                {getDifficultyLabel(selectedDifficulty)}
              </span>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              className="flex items-center gap-2 text-gray-300 hover:text-gray-100 transition-colors cursor-pointer bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg border border-gray-600"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </motion.button>
            
            <div className="flex items-center gap-3">
              <div className="bg-primary-500 p-2 rounded-lg">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-100 font-mono">
                  MISIÓN {level.id}
                </h1>
                <span className="text-xs text-primary-400 font-mono">INVESTIGACIÓN ACTIVA</span>
              </div>
            </div>
            
            <span className={`px-3 py-1 rounded-lg text-xs font-medium font-mono border ${getDifficultyColor(selectedDifficulty)} flex items-center gap-1`}>
              {getDifficultyIcon(selectedDifficulty)}
              {getDifficultyLabel(selectedDifficulty)}
            </span>
          </div>
        </div>
      </div>

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
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-xl max-w-2xl mx-auto">
                <div className="flex justify-center mb-6">
                  <div className="bg-green-500 p-4 rounded-xl relative">
                    <Trophy className="w-16 h-16 text-white" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-100 mb-2 font-mono">
                    MISIÓN EXITOSA
                  </h2>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Search className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-mono text-sm">INVESTIGACIÓN COMPLETADA</span>
                    <Search className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-gray-300 font-mono">
                    Has resuelto exitosamente todos los objetivos de la {level.name}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-primary-400" />
                      <span className="text-xs text-primary-400 font-mono">TIEMPO TOTAL</span>
                    </div>
                    <div className="text-2xl font-bold text-primary-400 font-mono">
                      {formatTime(totalLevelTime)}
                    </div>
                  </div>

                  <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs text-yellow-400 font-mono">PROMEDIO</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-400 font-mono">
                      {formatTime(getAverageTime())}
                    </div>
                  </div>

                  <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {getDifficultyIcon(selectedDifficulty)}
                      <span className="text-xs text-green-400 font-mono">SEGURIDAD</span>
                    </div>
                    <div className="text-2xl font-bold text-green-400 font-mono">
                      {getDifficultyLabel(selectedDifficulty)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onBack}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center gap-2 border border-gray-600 cursor-pointer"
                  >
                    <Home className="w-4 h-4" />
                    <span className="font-mono">VOLVER AL CENTRO DE OPERACIONES</span>
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
