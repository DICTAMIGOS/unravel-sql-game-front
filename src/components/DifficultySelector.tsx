import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, ChevronDown, Shield, AlertTriangle, Lock } from 'lucide-react';

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
      name: 'NIVEL 1',
      description: 'Tiempo generoso para análisis',
      timeLimit: '3 minutos',
      icon: Shield,
      color: 'text-green-400',
      securityLevel: 'SEGURIDAD BÁSICA'
    },
    {
      id: 'medium' as const,
      name: 'NIVEL 2',
      description: 'Presión moderada de tiempo',
      timeLimit: '2 minutos',
      icon: Target,
      color: 'text-yellow-400',
      securityLevel: 'SEGURIDAD MEDIA'
    },
    {
      id: 'hard' as const,
      name: 'NIVEL 3',
      description: 'Máxima presión temporal',
      timeLimit: '1 minuto',
      icon: Lock,
      color: 'text-red-400',
      securityLevel: 'SEGURIDAD MÁXIMA'
    }
  ];

  const selectedDifficultyData = difficulties.find(d => d.id === selectedDifficulty) || difficulties[0];

  return (
    <div className={`${className}`}>
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          <h2 className="text-xl font-bold text-gray-100 font-mono">
            NIVEL DE SEGURIDAD
          </h2>
        </div>
        <p className="text-sm text-gray-400 font-mono">
          Selecciona el nivel de presión temporal para la misión
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
              <div className="text-gray-100 font-medium font-mono">
                {selectedDifficultyData.name}
              </div>
              <div className="text-sm text-gray-400 font-mono">
                {selectedDifficultyData.securityLevel}
              </div>
              <div className="text-xs text-gray-500">
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
                      <div className="text-gray-100 font-medium font-mono">
                        {difficulty.name}
                      </div>
                      <div className="text-sm text-gray-400 font-mono">
                        {difficulty.securityLevel}
                      </div>
                      <div className="text-xs text-gray-500">
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
