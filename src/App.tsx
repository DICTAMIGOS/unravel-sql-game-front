import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameState } from './hooks/useGameState';
import { useAuth } from './hooks/useAuth';
import { AppLayout } from './layouts/AppLayout';
import { AuthView, HomeView, GameView } from './views';

type GameView = 'menu' | 'level' | 'login';

function App() {
  const [currentView, setCurrentView] = useState<GameView>('menu');
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);
  const { levels, currentLevel, completeLevel, gameProgress, setDifficulty } = useGameState();
  const { isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setCurrentView('login');
    }
  }, [isAuthenticated, isLoading]);

  const handleLevelSelect = (levelId: number) => {
    if (!isAuthenticated) {
      setCurrentView('login');
      return;
    }
    setSelectedLevelId(levelId);
    setCurrentView('level');
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
  };

  const handleShowLogin = () => {
    setCurrentView('login');
  };

  const handleBackFromLogin = () => {
    setCurrentView('menu');
  };

  const handleLogout = async () => {
    await logout();
    setCurrentView('login');
  };

  const handleLevelComplete = (levelId: number, totalTime: number) => {
    completeLevel(levelId, totalTime);
  };


  const selectedLevel = levels.find(level => level.id === selectedLevelId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono">Verificando credenciales...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout
      currentView={currentView}
      currentLevel={currentLevel}
      isAuthenticated={isAuthenticated}
      onBack={handleBackFromLogin}
      onLogin={handleShowLogin}
      onLogout={handleLogout}
    >
      <AnimatePresence mode="wait">
        {currentView === 'login' ? (
          <AuthView key="login" onBack={handleBackFromLogin} />
        ) : currentView === 'menu' ? (
          <HomeView
            key="menu"
            levels={levels}
            currentLevel={currentLevel}
            onLevelSelect={handleLevelSelect}
            selectedDifficulty={gameProgress.selectedDifficulty}
            onDifficultyChange={setDifficulty}
          />
        ) : (
          selectedLevel && (
            <GameView
              key="level"
              level={selectedLevel}
              selectedDifficulty={gameProgress.selectedDifficulty}
              onBack={handleBackToMenu}
              onLevelComplete={handleLevelComplete}
            />
          )
        )}
      </AnimatePresence>
    </AppLayout>
  );
}

export default App;
