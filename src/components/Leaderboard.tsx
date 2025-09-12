import React, { useState, useEffect, useCallback } from 'react';
import { Tab, Tabs } from '@heroui/tabs';
import { motion } from 'framer-motion';
import { Trophy, Medal, Target, AlertTriangle, Users, Zap } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api';

interface LeaderboardUser {
  errorCount: number;
  isCurrentUser: boolean;
  position: number;
  time: number;
  username: string;
}

interface LeaderboardData {
  currentUser: LeaderboardUser | null;
  difficulty: 'easy' | 'medium' | 'hard';
  level: null | number;
  top5: LeaderboardUser[];
  totalPlayers: number;
}

type Difficulty = 'easy' | 'medium' | 'hard';

interface LeaderboardProps {
  userId: string;
}

const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const getDifficultyIcon = (difficulty: Difficulty) => {
  switch (difficulty) {
    case 'easy': return <Target className="w-4 h-4 text-green-400" />;
    case 'medium': return <Zap className="w-4 h-4 text-yellow-400" />;
    case 'hard': return <AlertTriangle className="w-4 h-4 text-red-400" />;
  }
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
    return 'bg-gray-700 border-gray-500';
  }
  switch (position) {
    case 1: return 'bg-yellow-900/20 border-yellow-600';
    case 2: return 'bg-gray-800/50 border-gray-600';
    case 3: return 'bg-amber-900/20 border-amber-600';
    default: return 'bg-gray-800 border-gray-700';
  }
};

const LeaderboardTab: React.FC<{ 
  difficulty: Difficulty; 
  data: LeaderboardData | null; 
  loading: boolean; 
  error: string | null;
}> = ({ difficulty, data, loading, error }) => {
  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-6 flex flex-col justify-center items-center h-48"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mb-4"></div>
        <div className="text-center">
          <p className="text-gray-400 font-mono text-sm">Cargando clasificaciones...</p>
          <p className="text-gray-500 text-xs mt-1">Analizando registros de agentes</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 text-center p-8"
      >
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-6">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-red-400 font-mono text-lg mb-2">ERROR DE CONEXIÓN</h3>
          <p className="text-gray-400 text-sm font-mono">{error}</p>
          <div className="mt-4 text-xs text-gray-500 font-mono">
            [SISTEMA DE CLASIFICACIONES NO DISPONIBLE]
          </div>
        </div>
      </motion.div>
    );
  }

  if (!data) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 text-center p-8"
      >
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
          <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-gray-300 font-mono text-lg mb-2">SIN DATOS DISPONIBLES</h3>
          <p className="text-gray-400 text-sm font-mono mb-4">
            No hay registros de agentes para esta dificultad
          </p>
          <div className="text-xs text-gray-500 font-mono">
            [CLASIFICACIÓN VACÍA - ESPERANDO PRIMEROS AGENTES]
          </div>
        </div>
      </motion.div>
    );
  }

  // Empty state cuando no hay usuarios en el top 5
  if (!data.top5 || data.top5.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 text-center p-8"
      >
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
          <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-gray-300 font-mono text-lg mb-2">CLASIFICACIÓN VACÍA</h3>
          <p className="text-gray-400 text-sm font-mono mb-4">
            Aún no hay agentes que hayan completado esta dificultad
          </p>
          <div className="text-xs text-gray-500 font-mono">
            [SÉ EL PRIMERO EN COMPLETAR ESTA MISIÓN]
          </div>
        </div>
      </motion.div>
    );
  }

  const difficultyNames = {
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gray-700 p-2 rounded-lg">
          {getDifficultyIcon(difficulty)}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-100 font-mono">
            CLASIFICACIÓN GLOBAL
          </h3>
          <span className="text-xs text-gray-400 font-mono">
            NIVEL {difficultyNames[difficulty].toUpperCase()}
          </span>
        </div>
      </div>
      
      {/* Top 5 Ranking */}
      <div className="space-y-3 mb-6">
        {data.top5.map((user, index) => (
          <motion.div
            key={user.position}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${getPositionColor(user.position, user.isCurrentUser)}`}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {getPositionIcon(user.position)}
                <span className="text-gray-300 font-mono text-sm">
                  {user.position}º
                </span>
              </div>
              
              <div>
                <h3 className={`font-semibold ${user.isCurrentUser ? 'text-white' : 'text-gray-200'}`}>
                  {user.username}
                </h3>
                {user.isCurrentUser && (
                  <span className="text-xs text-gray-300 font-mono">
                    TU POSICIÓN
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-gray-300 font-mono text-sm">
                  {formatTime(user.time)}
                </div>
                <div className="text-xs text-gray-500">
                  {user.errorCount} errores
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Usuario actual si no está en el top 5 */}
      {data.currentUser && !data.top5.some(player => player.isCurrentUser) && (
        <div className="mt-6 p-4 bg-gray-700 border border-gray-500 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {getPositionIcon(data.currentUser.position)}
                <span className="text-gray-300 font-mono text-sm">
                  {data.currentUser.position}º
                </span>
              </div>
              <div>
                <h3 className="text-white font-semibold">
                  {data.currentUser.username}
                </h3>
                <span className="text-xs text-gray-300 font-mono">
                  TU POSICIÓN
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-200 font-mono text-sm">
                {formatTime(data.currentUser.time)}
              </div>
              <div className="text-xs text-gray-400">
                {data.currentUser.errorCount} errores
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Total Players Info */}
      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm font-mono">
          Total de jugadores: {data.totalPlayers}
        </p>
      </div>
    </motion.div>
  );
};

export const Leaderboard: React.FC<LeaderboardProps> = ({ userId }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const [leaderboardData, setLeaderboardData] = useState<Record<Difficulty, LeaderboardData | null>>({
    easy: null,
    medium: null,
    hard: null
  });
  const [loading, setLoading] = useState<Record<Difficulty, boolean>>({
    easy: false,
    medium: false,
    hard: false
  });
  const [errors, setErrors] = useState<Record<Difficulty, string | null>>({
    easy: null,
    medium: null,
    hard: null
  });

  const fetchLeaderboard = useCallback(async (difficulty: Difficulty) => {
    setLoading(prev => ({ ...prev, [difficulty]: true }));
    setErrors(prev => ({ ...prev, [difficulty]: null }));

    try {
      const response = await fetch(`${API_BASE_URL}/record/global-ranking?difficulty=${difficulty}&userId=${userId}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: LeaderboardData = await response.json();
      setLeaderboardData(prev => ({ ...prev, [difficulty]: data }));
    } catch (error) {
      console.error(`Error fetching ${difficulty} leaderboard:`, error);
      setErrors(prev => ({ 
        ...prev, 
        [difficulty]: error instanceof Error ? error.message : 'Error desconocido'
      }));
    } finally {
      setLoading(prev => ({ ...prev, [difficulty]: false }));
    }
  }, [userId]);

  useEffect(() => {
    // Cargar datos de la dificultad seleccionada al montar o cambiar
    fetchLeaderboard(selectedDifficulty);
  }, [selectedDifficulty, userId, fetchLeaderboard]);

  const handleTabChange = (key: React.Key) => {
    const difficulty = key as Difficulty;
    setSelectedDifficulty(difficulty);
    
    // Solo cargar si no tenemos datos para esta dificultad
    if (!leaderboardData[difficulty] && !loading[difficulty]) {
      fetchLeaderboard(difficulty);
    }
  };

  return (
    <div className="w-full">
      <Tabs
        aria-label="Clasificación por dificultad"
        variant="underlined"
        selectedKey={selectedDifficulty}
        onSelectionChange={handleTabChange}
        classNames={{
          tabList: "gap-8 w-full relative rounded-none p-0 border-b border-gray-700 bg-transparent",
          cursor: "w-full bg-gray-500",
          tab: "flex-1 px-4 py-3 h-12 max-w-fit",
          tabContent: "group-data-[selected=true]:text-white text-gray-400 font-medium transition-colors duration-200"
        }}
        color="primary"
      >
        {(['easy', 'medium', 'hard'] as Difficulty[]).map((difficulty) => (
          <Tab
            key={difficulty}
            title={
              <div className="flex items-center space-x-2">
                {getDifficultyIcon(difficulty)}
                <span className="capitalize font-mono text-sm">
                  {difficulty === 'easy' ? 'FÁCIL' : difficulty === 'medium' ? 'MEDIO' : 'DIFÍCIL'}
                </span>
              </div>
            }
          >
            <LeaderboardTab
              difficulty={difficulty}
              data={leaderboardData[difficulty]}
              loading={loading[difficulty]}
              error={errors[difficulty]}
            />
          </Tab>
        ))}
      </Tabs>
    </div>
  );
};
