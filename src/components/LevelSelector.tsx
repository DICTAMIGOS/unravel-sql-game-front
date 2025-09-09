import React from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Clock, FileText, Target } from 'lucide-react';
import type { Level } from '../types/game';
import { DifficultySelector } from './DifficultySelector';

interface LevelSelectorProps {
  levels: Level[];
  currentLevel: number;
  onLevelSelect: (levelId: number) => void;
  selectedDifficulty: 'easy' | 'medium' | 'hard';
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
  className?: string;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  levels,
  currentLevel,
  onLevelSelect,
  selectedDifficulty,
  onDifficultyChange,
  className = ''
}) => {
  const getLevelStatus = (level: Level) => {
    if (level.completed) return 'completed';
    if (level.id === currentLevel) return 'current';
    if (level.unlocked) return 'unlocked';
    return 'locked';
  };

  const getStatusIcon = (level: Level) => {
    const status = getLevelStatus(level);
    
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'current':
        return <Target className="w-6 h-6 text-primary-400" />;
      case 'locked':
        return <Lock className="w-6 h-6 text-gray-500" />;
      default:
        return <FileText className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (level: Level) => {
    const status = getLevelStatus(level);
    
    switch (status) {
      case 'completed':
        return 'border-green-600 bg-green-900/20 hover:bg-green-900/30';
      case 'current':
        return 'border-primary-600 bg-primary-900/20 hover:bg-primary-900/30';
      case 'locked':
        return 'border-gray-600 bg-gray-800/50 cursor-not-allowed opacity-50';
      default:
        return 'border-gray-600 bg-gray-800 hover:bg-gray-700';
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`${className}`}>
      <div className="mb-8">
        <p className="text-gray-400 font-mono ">
          Selecciona una misión para comenzar tu investigación. Cada caso requiere habilidades específicas de análisis de datos.
        </p>
      </div>

      <DifficultySelector
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={onDifficultyChange}
        className="mb-8"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {levels.map((level, index) => {
          const status = getLevelStatus(level);
          const isClickable = status !== 'locked';
          
          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={isClickable ? { scale: 1.02 } : {}}
              whileTap={isClickable ? { scale: 0.98 } : {}}
              className={`bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl cursor-pointer transition-all duration-200 ${getStatusColor(level)}`}
              onClick={() => isClickable && onLevelSelect(level.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {getStatusIcon(level)}
                    {status === 'current' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">
                      MISIÓN {level.id}
                    </h3>
                    <p className="text-sm text-gray-400 font-mono">
                      {level.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-red-400 font-mono">
                        {status === 'current' ? 'ACTIVA' : status === 'completed' ? 'COMPLETADA' : status === 'locked' ? 'BLOQUEADA' : 'DISPONIBLE'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {level.completed && level.bestTime && (
                  <div className="flex items-center gap-1 text-green-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(level.bestTime)}</span>
                  </div>
                )}
              </div>

              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                {level.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-mono">
                    {level.challenges.length > 0 && `${level.challenges.length} OBJETIVOS`}
                  </span>
                  {level.completed && (
                    <span className="text-xs text-green-400 font-medium font-mono">
                      MISIÓN EXITOSA
                    </span>
                  )}
                </div>
                
                {status === 'locked' && (
                  <span className="text-xs text-gray-500 font-mono">
                    [BLOQUEADO]
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
