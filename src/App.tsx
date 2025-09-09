import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, LogIn, ArrowLeft } from 'lucide-react';
import { useGameState } from './hooks/useGameState';
import { LevelSelector } from './components/LevelSelector';
import { LevelGame } from './components/LevelGame';
import { Login } from './components/Login';

type GameView = 'menu' | 'level' | 'login';

function App() {
  const [currentView, setCurrentView] = useState<GameView>('menu');
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);
  const { levels, currentLevel, completeLevel, gameProgress, setDifficulty } = useGameState();

  const handleLevelSelect = (levelId: number) => {
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

  const handleLevelComplete = (levelId: number, totalTime: number) => {
    completeLevel(levelId, totalTime);
  };


  const selectedLevel = levels.find(level => level.id === selectedLevelId);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(14, 165, 233, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(217, 70, 239, 0.1) 0%, transparent 50%)`
        }} />
      </div>

      <header className="relative z-10 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-600 rounded-lg">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-100">Unravel: The data detective</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {currentView === 'login' ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBackFromLogin}
                  className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center gap-2 border border-gray-600 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShowLogin}
                  className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center gap-2 border border-gray-600 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  Iniciar Sesión
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {currentView === 'login' ? (
            <Login key="login" onBack={handleBackFromLogin} />
          ) : currentView === 'menu' ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen"
            >
              <div className="max-w-6xl mx-auto px-6 py-8">
                <LevelSelector
                  levels={levels}
                  currentLevel={currentLevel}
                  onLevelSelect={handleLevelSelect}
                  selectedDifficulty={gameProgress.selectedDifficulty}
                  onDifficultyChange={setDifficulty}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="level"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {selectedLevel && (
                <LevelGame
                  level={selectedLevel}
                  selectedDifficulty={gameProgress.selectedDifficulty}
                  onBack={handleBackToMenu}
                  onLevelComplete={handleLevelComplete}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 bg-gray-800/80 backdrop-blur-sm border-t border-gray-700 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="text-center text-gray-400 text-sm">
            <p>Unravel: The data detective</p>
            <p className="mt-2 text-xs text-gray-500">
              Made with 💙 by <a href="https://www.dictamigos.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-300">Dictamigos</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
