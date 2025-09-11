import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, ChevronRight, Target, AlertTriangle } from 'lucide-react';
import { recordService, type GetRankingResponse } from '../services/recordService';

interface SequenceRankingProps {
  sequenceTitle: string;
  level: number;
  difficulty: 'easy' | 'medium' | 'hard';
  onNext: () => void;
  className?: string;
}

export const SequenceRanking: React.FC<SequenceRankingProps> = ({
  sequenceTitle,
  level,
  difficulty,
  onNext,
  className = ''
}) => {
  const [rankingData, setRankingData] = useState<GetRankingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRanking = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await recordService.getRanking(level, difficulty);
      setRankingData(response);
    } catch (error) {
      console.error('Error fetching ranking:', error);
      setError('Error al cargar el ranking');
      setRankingData(null);
    } finally {
      setIsLoading(false);
    }
  }, [level, difficulty]);

  useEffect(() => {
    fetchRanking();
  }, [fetchRanking]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-300" />;
      case 3: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return <span className="text-gray-400 font-mono text-sm">#{position}</span>;
    }
  };

  const getPositionColor = (position: number, isCurrentUser: boolean) => {
    if (isCurrentUser) {
      return 'bg-primary-900/30 border-primary-600';
    }
    switch (position) {
      case 1: return 'bg-yellow-900/20 border-yellow-600';
      case 2: return 'bg-gray-800/50 border-gray-600';
      case 3: return 'bg-amber-900/20 border-amber-600';
      default: return 'bg-gray-800 border-gray-700';
    }
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen flex items-center justify-center px-6 ${className}`}
    >
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-primary-500 p-3 rounded-xl relative">
                <Trophy className="w-8 h-8 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-3xl font-bold text-white font-mono">
                RANKING DE SECUENCIA
              </h1>
            </div>
            
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-200 mb-2">
                {sequenceTitle}
              </h2>
              <div className="flex items-center justify-center gap-4">
                <span className={`px-3 py-1 rounded-lg text-sm font-medium font-mono border ${getDifficultyColor(difficulty)} flex items-center gap-1`}>
                  <Target className="w-4 h-4" />
                  {getDifficultyLabel(difficulty)}
                </span>
              </div>
            </div>
          </div>

          {/* Ranking List */}
          <div className="mb-8">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                <p className="text-gray-400 font-mono">Cargando ranking...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-400 mb-4">
                  <AlertTriangle className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-red-400 font-mono">{error}</p>
                <button 
                  onClick={fetchRanking}
                  className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  Reintentar
                </button>
              </div>
            ) : rankingData ? (
              <div className="space-y-3">
                {/* Current User Info - Solo si NO está en el top 5 */}
                {rankingData.currentUser && !rankingData.top5.some(player => player.isCurrentUser) && (
                  <div className="mb-6 p-4 bg-primary-900/20 border border-primary-600 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getPositionIcon(rankingData.currentUser.position)}
                          <span className="text-primary-400 font-mono text-sm">
                            {rankingData.currentUser.position}º
                          </span>
                        </div>
                        <div>
                          <h3 className="text-primary-400 font-semibold">
                            {rankingData.currentUser.username}
                          </h3>
                          <span className="text-xs text-primary-400 font-mono">
                            TU POSICIÓN
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-primary-300 font-mono text-sm">
                          {formatTime(rankingData.currentUser.time)}
                        </div>
                        <div className="text-xs text-primary-400">
                          {rankingData.currentUser.errorCount} errores
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Top 5 Ranking */}
                <div className="space-y-3">
                  {rankingData.top5.map((entry, index) => (
                  <motion.div
                    key={entry.position}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${getPositionColor(entry.position, entry.isCurrentUser)}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getPositionIcon(entry.position)}
                        <span className="text-gray-300 font-mono text-sm">
                          {entry.position}º
                        </span>
                      </div>
                      
                      <div>
                        <h3 className={`font-semibold ${entry.isCurrentUser ? 'text-primary-400' : 'text-gray-200'}`}>
                          {entry.username}
                        </h3>
                        {entry.isCurrentUser && (
                          <span className="text-xs text-primary-400 font-mono">
                            TU POSICIÓN
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-gray-300 font-mono text-sm">
                          {formatTime(entry.time)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {entry.errorCount} errores
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  ))}
                </div>

                {/* Total Players Info */}
                <div className="mt-6 text-center">
                  <p className="text-gray-400 text-sm font-mono">
                    Total de jugadores: {rankingData.totalPlayers}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center gap-2 mx-auto"
            >
              <span className="font-mono">CONTINUAR HISTORIA</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};
