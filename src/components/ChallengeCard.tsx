import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, X, Target, Shield, FileText } from 'lucide-react';
import type { SQLChallenge } from '../types/game';
import { SQLTemplate } from './SQLTemplate';
import { Timer } from './Timer';

interface ChallengeCardProps {
  challenge: SQLChallenge;
  timeLimit: number;
  onComplete: (time: number) => void;
  onNext: () => void;
  className?: string;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  timeLimit,
  onComplete,
  onNext,
  className = ''
}) => {
  const [currentSolution, setCurrentSolution] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [timerState, setTimerState] = useState({
    isRunning: true,
    startTime: Date.now(),
    elapsedTime: 0,
    timeLimit: timeLimit
  });

  // Reset state when challenge changes
  useEffect(() => {
    setCurrentSolution('');
    setIsCompleted(false);
    setIsIncorrect(false);
    setTimerState({
      isRunning: true,
      startTime: Date.now(),
      elapsedTime: 0,
      timeLimit: timeLimit
    });
  }, [challenge.id, timeLimit]);

  const checkSolution = () => {
    setIsIncorrect(false);
    
    const normalizedSolution = currentSolution.trim().toLowerCase();
    const normalizedCorrect = challenge.solution.trim().toLowerCase();
    
    if (normalizedSolution === normalizedCorrect) {
      setIsCompleted(true);
      setTimerState(prev => ({ ...prev, isRunning: false }));
      onComplete(timerState.elapsedTime);
    } else {
      setIsIncorrect(true);
      setIsCompleted(false);
    }
  };

  const handleSolutionChange = useCallback((solution: string) => {
    setCurrentSolution(solution);
  }, []);

  const handleTimeUpdate = (elapsedTime: number) => {
    setTimerState(prev => ({ ...prev, elapsedTime }));
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl relative ${className}`}
    >
      {/* Mobile Layout */}
      <div className="block sm:hidden mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-100 font-mono">OBJETIVO {challenge.id}</h2>
          <div className="flex items-center gap-2">
            <span className={`font-mono text-sm font-semibold ${
              !timerState.timeLimit ? 'text-primary-400' :
              (timerState.elapsedTime / timerState.timeLimit) * 100 >= 90 ? 'text-red-400' :
              (timerState.elapsedTime / timerState.timeLimit) * 100 >= 75 ? 'text-yellow-400' :
              'text-primary-400'
            }`}>
              {formatTime(timerState.elapsedTime)}
            </span>
            {timerState.timeLimit && (
              <span className="text-gray-400 text-xs font-mono">
                / {formatTime(timerState.timeLimit)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary-500 p-2 rounded-lg">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-100 font-mono">OBJETIVO {challenge.id}</h2>
            <span className="text-xs text-primary-400 font-mono">ANÁLISIS DE DATOS</span>
          </div>
        </div>
        <Timer
          timerState={timerState}
          onTimeUpdate={handleTimeUpdate}
        />
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400 font-mono">INSTRUCCIONES DE LA MISIÓN</span>
        </div>
        <p className="text-gray-300 leading-relaxed font-mono">
          {challenge.description}
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400 font-mono">CONSULTA DE INVESTIGACIÓN</span>
        </div>
        <SQLTemplate
          challenge={challenge}
          onSolutionChange={handleSolutionChange}
          isCompleted={isCompleted}
          isIncorrect={isIncorrect}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 text-green-400"
            >
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium font-mono">OBJETIVO COMPLETADO</span>
            </motion.div>
          )}
          
          {isIncorrect && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 text-red-400"
            >
              <X className="w-5 h-5" />
              <span className="text-sm font-medium font-mono">ANÁLISIS INCORRECTO</span>
            </motion.div>
          )}
        </div>
        
        <div className="flex gap-3">
          {!isCompleted && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={checkSolution}
              className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center gap-2 cursor-pointer border border-gray-600"
              disabled={!currentSolution.trim()}
            >
              <Target className="w-4 h-4" />
              <span className="font-mono">ANALIZAR DATOS</span>
            </motion.button>
          )}
          
          {isCompleted && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNext}
              className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center gap-2 cursor-pointer border border-gray-600"
            >
              <span className="font-mono">SIGUIENTE OBJETIVO</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};