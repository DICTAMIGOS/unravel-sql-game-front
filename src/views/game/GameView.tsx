import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Home, Search, Target } from 'lucide-react';
import type { Level, StoryImage, ChallengeSequence } from '../../types/game';
import { StoryImage as StoryImageComponent } from '../../components/StoryImage';
import { ChallengeCard } from '../../components/ChallengeCard';

interface GameViewProps {
  level: Level;
  selectedDifficulty: 'easy' | 'medium' | 'hard';
  onBack: () => void;
  onLevelComplete: (levelId: number, totalTime: number) => void;
  className?: string;
}

export const GameView: React.FC<GameViewProps> = ({
  level,
  selectedDifficulty,
  onBack,
  onLevelComplete,
  className = ''
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [challengeTimes, setChallengeTimes] = useState<number[]>([]);
  const [isLevelCompleted, setIsLevelCompleted] = useState(false);
  const [totalLevelTime, setTotalLevelTime] = useState(0);

  const currentStep = level.storySteps[currentStepIndex];
  const currentSequence = currentStep?.type === 'sequence' ? currentStep.data as ChallengeSequence : null;
  const currentChallenge = currentSequence?.challenges[currentChallengeIndex];

  useEffect(() => {
    setCurrentStepIndex(0);
    setCurrentChallengeIndex(0);
    setChallengeTimes([]);
    setIsLevelCompleted(false);
    setTotalLevelTime(0);
  }, [level.id]);

  const handleChallengeComplete = (time: number) => {
    const newChallengeTimes = [...challengeTimes, time];
    setChallengeTimes(newChallengeTimes);

    const newTotalTime = newChallengeTimes.reduce((sum, t) => sum + t, 0);
    setTotalLevelTime(newTotalTime);

    // Check if we need to move to next challenge in sequence or next step
    if (currentSequence && currentChallengeIndex < currentSequence.challenges.length - 1) {
      // Move to next challenge in current sequence
      setCurrentChallengeIndex(prev => prev + 1);
    } else {
      // Sequence completed, move to next step
      setCurrentChallengeIndex(0);
      setChallengeTimes([]);
      if (currentStepIndex < level.storySteps.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
      } else {
        // Level completed
        setIsLevelCompleted(true);
        onLevelComplete(level.id, newTotalTime);
      }
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < level.storySteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Level completed (no more steps)
      setIsLevelCompleted(true);
      onLevelComplete(level.id, totalLevelTime);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeLimitForDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 180; 
      case 'medium': return 120;
      case 'hard': return 60;
      default: return 180;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-900 ${className}`}>
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              className="flex items-center gap-2 text-gray-300 hover:text-gray-100 transition-colors cursor-pointer bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg border border-gray-600"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </motion.button>
            
            <div className="flex items-center gap-3">
              <div className="bg-primary-500 p-2 rounded-lg">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-100 font-mono">
                  MISIÓN {level.id}
                </h1>
                <span className="text-xs text-primary-400 font-mono">INVESTIGACIÓN ACTIVA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {isLevelCompleted ? (
            <motion.div
              key="completion"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-xl max-w-2xl mx-auto">
                <div className="flex justify-center mb-6">
                  <div className="bg-green-500 p-4 rounded-xl relative">
                    <Trophy className="w-16 h-16 text-white" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-100 mb-2 font-mono">
                    MISIÓN EXITOSA
                  </h2>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Search className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-mono text-sm">INVESTIGACIÓN COMPLETADA</span>
                    <Search className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-gray-300 font-mono">
                    Has resuelto exitosamente todos los objetivos de la {level.name}
                  </p>
                </div>

                <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-primary-400" />
                    <span className="text-xs text-primary-400 font-mono">TIEMPO TOTAL</span>
                  </div>
                  <div className="text-2xl font-bold text-primary-400 font-mono">
                    {formatTime(totalLevelTime)}
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onBack}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center gap-2 border border-gray-600 cursor-pointer"
                  >
                    <Home className="w-4 h-4" />
                    <span className="font-mono">VOLVER AL CENTRO DE OPERACIONES</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : currentStep ? (
            <motion.div
              key={`step-${currentStepIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep.type === 'image' ? (
  <StoryImageComponent
    image={currentStep.data as StoryImage}
    dialogs={(currentStep.data as any).dialogs ?? []} // 👈 aquí pasamos los globos
    onNext={handleNextStep}
  />

              ) : currentSequence && currentChallenge ? (
                <div>
                  {/* Sequence Header */}
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary-500 p-2 rounded-lg">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-100 font-mono">
                          {currentSequence.title}
                        </h2>
                        <p className="text-gray-400 text-sm">
                          {currentSequence.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Progress */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400 font-mono">
                        Challenge {currentChallengeIndex + 1} / {currentSequence.challenges.length}
                      </span>
                      <div className="flex gap-1">
                        {currentSequence.challenges.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              index <= currentChallengeIndex
                                ? 'bg-primary-500'
                                : 'bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Challenge Card */}
                  <ChallengeCard
                    challenge={currentChallenge}
                    timeLimit={getTimeLimitForDifficulty(selectedDifficulty)}
                    onComplete={handleChallengeComplete}
                    onNext={() => {}} // No need for next button, handled automatically
                  />
                </div>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};
