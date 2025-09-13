import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Clock, FileText, Target, LogOut, Trophy } from 'lucide-react';
import type { Level } from '../types/game';
import { DifficultySelector } from '../components/DifficultySelector';
import { useGameState } from '../hooks/useGameState';
import { useAuth } from '../hooks/useAuth';
import { useModalContext } from '../hooks/useModalContext';
import { Leaderboard } from '../components/Leaderboard';
import { authService } from '../services/authService';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { levels, currentLevel, gameProgress, setDifficulty } = useGameState();
  const { logout } = useAuth();
  const { openModal } = useModalContext();

  const handleLevelSelect = (levelId: number) => {
    navigate(`/chapter/${levelId}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleOpenLeaderboard = () => {
    // Get the actual user UUID from localStorage
    const storedUser = authService.getStoredUser();
    console.log('storedUser', storedUser);
    if (!storedUser) {
      console.error('No hay usuario autenticado');
      return;
    }
    
    console.log('Abriendo leaderboard para userId:', storedUser.uuid);
    openModal(
      <Leaderboard userId={storedUser.uuid} />,
      {
        title: 'Clasificaciones Globales',
        maxWidth: 'lg',
        className: "bg-gray-800 text-gray-400 font-mono",
      }
    );
  };

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
        return <Target className="w-6 h-6 text-gray-400" />;
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
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary-500 p-2 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-100 font-mono">
                  CENTRO DE OPERACIONES
                </h1>
                <span className="text-xs text-gray-400 font-mono">SISTEMA DE MISIONES</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOpenLeaderboard}
                className="flex items-center gap-2 text-gray-300 hover:text-gray-100 transition-colors cursor-pointer bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg border border-gray-600"
              >
                <Trophy className="w-4 h-4" />
                <span className="font-mono text-sm">CLASIFICACIONES</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-300 hover:text-gray-100 transition-colors cursor-pointer bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg border border-gray-600"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-mono text-sm">SALIR</span>
              </motion.button>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="sm:hidden">
            {/* Top row - Logo and title */}
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-primary-500 p-1.5 rounded-lg">
                <Target className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-lg font-bold text-gray-100 font-mono">
                  CENTRO DE OPERACIONES
                </h1>
                <span className="text-xs text-gray-400 font-mono">SISTEMA DE MISIONES</span>
              </div>
            </div>

            {/* Bottom row - Action buttons */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOpenLeaderboard}
                className="flex-1 flex items-center justify-center gap-1.5 text-gray-300 hover:text-gray-100 transition-colors cursor-pointer bg-gray-700 hover:bg-gray-600 px-2 py-2 rounded-lg border border-gray-600"
              >
                <Trophy className="w-4 h-4" />
                <span className="font-mono text-xs">CLASIFICACIONES</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-1.5 text-gray-300 hover:text-gray-100 transition-colors cursor-pointer bg-gray-700 hover:bg-gray-600 px-2 py-2 rounded-lg border border-gray-600"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-mono text-xs">SALIR</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen"
      >
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="mb-8">
            <p className="text-gray-400 font-mono">
              Selecciona una misión para comenzar tu investigación. Cada caso requiere habilidades específicas de análisis de datos.
            </p>
          </div>

          <DifficultySelector
            selectedDifficulty={gameProgress.selectedDifficulty}
            onDifficultyChange={setDifficulty}
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
                  onClick={() => isClickable && handleLevelSelect(level.id)}
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
                        {level.storySteps.length > 0 && `${level.storySteps.length} ELEMENTOS`}
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
      </motion.div>
    </div>
  );
};
