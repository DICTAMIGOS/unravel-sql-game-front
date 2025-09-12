import React, { useState, useEffect, useCallback } from 'react';
import { Tab, Tabs } from '@heroui/tabs';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api';

interface LeaderboardUser {
  errorCount: number;
  isCurrentUser: boolean;
  position: number;
  time: number;
  username: string;
}

interface LeaderboardData {
  currentUser: LeaderboardUser;
  difficulty: 'easy' | 'medium' | 'hard';
  level: null | number;
  top3: LeaderboardUser[];
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

const getDifficultyIcon = (difficulty: Difficulty): string => {
  switch (difficulty) {
    case 'easy': return '🟢';
    case 'medium': return '🟡';
    case 'hard': return '🔴';
  }
};

const getDifficultyColor = (difficulty: Difficulty): string => {
  switch (difficulty) {
    case 'easy': return 'text-green-400';
    case 'medium': return 'text-yellow-400';
    case 'hard': return 'text-red-400';
  }
};

const getMedalIcon = (position: number): string => {
  switch (position) {
    case 1: return '🥇';
    case 2: return '🥈';
    case 3: return '🥉';
    default: return '📍';
  }
};

const getMedalColor = (position: number): string => {
  switch (position) {
    case 1: return 'text-yellow-400';
    case 2: return 'text-gray-300';
    case 3: return 'text-orange-400';
    default: return 'text-gray-400';
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
      <div className="mt-6 flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        <span className="ml-2 text-gray-400">Cargando rankings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 text-center p-6">
        <div className="text-red-400 mb-2">❌ Error al cargar los datos</div>
        <p className="text-gray-400 text-sm">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mt-6 text-center p-6">
        <div className="text-gray-400">No hay datos disponibles</div>
      </div>
    );
  }

  const difficultyNames = {
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil'
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-100">
        🏆 Clasificación - Nivel {difficultyNames[difficulty]}
      </h3>
      
      {/* Top 3 */}
      <div className="space-y-3 mb-6">
        {data.top3.map((user) => (
          <div 
            key={`${user.username}-${user.position}`}
            className={`
              flex justify-between items-center p-4 rounded-lg border transition-colors
              ${user.isCurrentUser 
                ? 'bg-primary-900/30 border-primary-600 ring-1 ring-primary-500' 
                : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700/70'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <span className={`text-lg ${getMedalColor(user.position)}`}>
                {getMedalIcon(user.position)}
              </span>
              <div>
                <span className={`font-medium ${user.isCurrentUser ? 'text-primary-300' : 'text-gray-200'}`}>
                  {user.username}
                  {user.isCurrentUser && <span className="ml-2 text-xs text-primary-400">(Tú)</span>}
                </span>
                {user.errorCount > 0 && (
                  <div className="text-xs text-red-400 mt-1">
                    {user.errorCount} error{user.errorCount !== 1 ? 'es' : ''}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className={`font-bold ${getMedalColor(user.position)}`}>
                Pos. {user.position}
              </div>
              <div className="text-gray-400 text-sm">
                Tiempo: {formatTime(user.time)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Usuario actual si no está en el top 3 */}
      {data.currentUser && data.currentUser.position > 3 && (
        <div className="border-t border-gray-600 pt-4">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Tu posición:</h4>
          <div className="flex justify-between items-center p-4 bg-primary-900/30 rounded-lg border border-primary-600 ring-1 ring-primary-500">
            <div className="flex items-center space-x-3">
              <span className="text-lg text-primary-400">📍</span>
              <div>
                <span className="font-medium text-primary-300">
                  {data.currentUser.username}
                  <span className="ml-2 text-xs text-primary-400">(Tú)</span>
                </span>
                {data.currentUser.errorCount > 0 && (
                  <div className="text-xs text-red-400 mt-1">
                    {data.currentUser.errorCount} error{data.currentUser.errorCount !== 1 ? 'es' : ''}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-primary-400">
                Pos. {data.currentUser.position}
              </div>
              <div className="text-gray-400 text-sm">
                Tiempo: {formatTime(data.currentUser.time)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
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
          tabList: "gap-6 w-full relative rounded-none p-0 border-b border-gray-700 bg-transparent",
          cursor: "w-full bg-primary-500",
          tab: "max-w-fit px-4 py-3 h-12",
          tabContent: "group-data-[selected=true]:text-primary-400 text-gray-400 font-medium transition-colors duration-200"
        }}
        color="primary"
      >
        {(['easy', 'medium', 'hard'] as Difficulty[]).map((difficulty) => (
          <Tab
            key={difficulty}
            title={
              <div className="flex items-center space-x-2">
                <span className={getDifficultyColor(difficulty)}>
                  {getDifficultyIcon(difficulty)}
                </span>
                <span className="capitalize">
                  {difficulty === 'easy' ? 'Fácil' : difficulty === 'medium' ? 'Medio' : 'Difícil'}
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
