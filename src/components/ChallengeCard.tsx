import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Play, ArrowRight, X } from 'lucide-react';
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
    // Clear any previous error state when checking again
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
    // Don't clear error state automatically - let user see the error message
    // Error will only be cleared when they click "Verificar" again
  }, []);

  const handleTimeUpdate = (elapsedTime: number) => {
    setTimerState(prev => ({ ...prev, elapsedTime }));
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl relative ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-100">{challenge.title}</h2>
       
        </div>
        <Timer
          timerState={timerState}
          onTimeUpdate={handleTimeUpdate}
        />
      </div>

      {/* Description */}
      <p className="text-gray-300 mb-6 leading-relaxed">
        {challenge.description}
      </p>

      {/* SQL Template */}
      <div className="mb-6">
        <SQLTemplate
          challenge={challenge}
          onSolutionChange={handleSolutionChange}
          isCompleted={isCompleted}
          isIncorrect={isIncorrect}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 text-green-400"
            >
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">¡Completado!</span>
            </motion.div>
          )}
          
          {isIncorrect && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 text-red-400"
            >
              <X className="w-5 h-5" />
              <span className="text-sm font-medium">Incorrecto</span>
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
              <Play className="w-4 h-4" />
              Verificar
            </motion.button>
          )}
          
          {isCompleted && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNext}
              className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center gap-2 cursor-pointer border border-gray-600"
            >
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};