import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Target, Zap, ChevronDown } from 'lucide-react';

interface DifficultySelectorProps {
  selectedDifficulty: 'easy' | 'medium' | 'hard';
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
  className?: string;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selectedDifficulty,
  onDifficultyChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const difficulties = [
    {
      id: 'easy' as const,
      name: 'Fácil',
      description: 'Tiempo generoso para aprender',
      timeLimit: '5 minutos',
      icon: Clock,
      color: 'text-green-400'
    },
    {
      id: 'medium' as const,
      name: 'Medio',
      description: 'Desafío equilibrado',
      timeLimit: '3 minutos',
      icon: Target,
      color: 'text-yellow-400'
    },
    {
      id: 'hard' as const,
      name: 'Difícil',
      description: 'Para expertos en SQL',
      timeLimit: '2 minutos',
      icon: Zap,
      color: 'text-red-400'
    }
  ];

  const selectedDifficultyData = difficulties.find(d => d.id === selectedDifficulty) || difficulties[0];

  return (
    <div className={`${className}`}>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-100 mb-1">
          Dificultad
        </h2>
        <p className="text-sm text-gray-400">
          El mismo desafío, mayor presión contrarreloj
        </p>
      </div>

      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 flex items-center justify-between hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <selectedDifficultyData.icon className={`w-5 h-5 ${selectedDifficultyData.color}`} />
            <div className="text-left">
              <div className="text-gray-100 font-medium">
                {selectedDifficultyData.name}
              </div>
              <div className="text-sm text-gray-400">
                {selectedDifficultyData.timeLimit}
              </div>
            </div>
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10"
            >
              {difficulties.map((difficulty) => {
                const Icon = difficulty.icon;
                const isSelected = selectedDifficulty === difficulty.id;
                
                return (
                  <motion.button
                    key={difficulty.id}
                    whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
                    onClick={() => {
                      onDifficultyChange(difficulty.id);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors cursor-pointer duration-200 ${
                      isSelected ? 'bg-gray-700' : 'hover:bg-gray-700'
                    } ${difficulty.id === difficulties[0].id ? 'rounded-t-lg' : ''} ${
                      difficulty.id === difficulties[difficulties.length - 1].id ? 'rounded-b-lg' : ''
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${difficulty.color}`} />
                    <div className="flex-1">
                      <div className="text-gray-100 font-medium">
                        {difficulty.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {difficulty.description} • {difficulty.timeLimit}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
