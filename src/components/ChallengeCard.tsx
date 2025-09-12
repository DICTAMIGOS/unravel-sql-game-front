import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, X, Target, Shield, FileText, AlertTriangle } from 'lucide-react';
import type { SQLChallenge } from '../types/game';
import { SQLTemplate } from './SQLTemplate';
import { Timer } from './Timer';
import { gameService } from '../services/validateQueryService';

interface ChallengeCardProps {
  challenge: SQLChallenge;
  timeLimit: number;
  onComplete: (time: number, errorCount: number) => void;
  onNext: () => void;
  onTimeExpired?: () => void; // ⬅️ nuevo
  className?: string;
}

// Mensajes noir cuando expira el tiempo
const NOIR_TIMEOUT_LINES = [
  "El reloj ganó. La pista se enfría y el culpable se escurre entre la lluvia.",
  "Demasiado tarde: el expediente se cierra… por ahora.",
  "Las sirenas callan y las sombras celebran. Vuelve a intentarlo.",
  "Se nos fue la noche y con ella la verdad. Reinicia la investigación.",
  "El caso respira… pero no de nuestro lado. Tiempo agotado.",
  "La ciudad guarda silencio. Tu ventana se cerró.",
  "Las migas de pan desaparecen en la oscuridad. Reagrupa y regresa.",
  "El sospechoso cambió de rostro. Tu oportunidad también.",
  "La verdad se dejó ver… un segundo antes de apagarse.",
  "El reloj selló el informe: inconcluso. Tú decides si reabrirlo.",
];
const pickNoirLine = () => NOIR_TIMEOUT_LINES[Math.floor(Math.random() * NOIR_TIMEOUT_LINES.length)];
const RESTART_DELAY_MS = 1200; // espera breve para mostrar el mensaje

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  timeLimit,
  onComplete,
  onNext,
  onTimeExpired,
  className = ''
}) => {
  const [currentSolution, setCurrentSolution] = useState('');
    const [isValidating, setIsValidating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [expiredCopy, setExpiredCopy] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const [timerState, setTimerState] = useState({
    isRunning: true,
    startTime: Date.now(),
    elapsedTime: 0,
    timeLimit: timeLimit
  });

  // Reset al cambiar de challenge
  useEffect(() => {
    setCurrentSolution('');
    setIsCompleted(false);
    setIsIncorrect(false);
    setIsExpired(false);
    setExpiredCopy('');
    setErrorCount(0);
    setTimerState({
      isRunning: true,
      startTime: Date.now(),
      elapsedTime: 0,
      timeLimit: timeLimit
    });
  }, [challenge.id, timeLimit]);

  const checkSolution = async () => {
    if (isValidating) return;
    
    setIsIncorrect(false);
    setIsValidating(true);

    try {
      const result = await gameService.validateQuery({
        query: currentSolution.trim(),
        decimal: challenge.decimal
      });

      if (result.success) {
        setIsCompleted(true);
        setTimerState(prev => ({ ...prev, isRunning: false }));
        onComplete(timerState.elapsedTime, errorCount);
      } else {
        setIsIncorrect(true);
        setIsCompleted(false);
        setErrorCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error validating solution:', error);
      setIsIncorrect(true);
      setErrorCount(prev => prev + 1);
    } finally {
      setIsValidating(false);
    }
  };
  

  const handleSolutionChange = useCallback((solution: string) => {
    setCurrentSolution(solution);
  }, []);

  const handleTimeUpdate = (elapsedTime: number) => {
    setTimerState(prev => ({ ...prev, elapsedTime }));
  };

  // ⏰ Se agota el tiempo → mensaje noir y reinicio del nivel
  const handleTimeLimitExceeded = (elapsed: number) => {
    setIsExpired(true);
    setIsIncorrect(false);
    setIsCompleted(false);
    setExpiredCopy(pickNoirLine());
    setTimerState(prev => ({ ...prev, isRunning: false, elapsedTime: elapsed }));
    if (onTimeExpired) {
      window.setTimeout(() => onTimeExpired(), RESTART_DELAY_MS);
    }

  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl relative ${className}`}
    >
      {/* Mobile */}
      <div className="block sm:hidden mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-100 font-mono">OBJETIVO {challenge.id}</h2>
          <div className="flex items-center gap-2">
            <span
              className={`font-mono text-sm font-semibold ${
                !timerState.timeLimit
                  ? 'text-primary-400'
                  : (timerState.elapsedTime / (timerState.timeLimit || 1)) * 100 >= 90
                  ? 'text-red-400'
                  : (timerState.elapsedTime / (timerState.timeLimit || 1)) * 100 >= 75
                  ? 'text-yellow-400'
                  : 'text-primary-400'
              }`}
            >
              {formatTime(timerState.elapsedTime)}
            </span>
            {timerState.timeLimit && (
              <span className="text-gray-400 text-xs font-mono">/ {formatTime(timerState.timeLimit)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden sm:flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary-500 p-2 rounded-lg">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-100 font-mono">OBJETIVO {challenge.id}</h2>
            <span className="text-xs text-gray-400 font-mono">ANÁLISIS DE DATOS</span>
          </div>
        </div>
        <Timer
          timerState={timerState}
          onTimeUpdate={handleTimeUpdate}
          onTimeLimitExceeded={handleTimeLimitExceeded}
          showExpiredBanner={false} // mostramos banda aquí abajo
        />
      </div>

      {/* Banda noir de tiempo agotado */}
      {isExpired && (
        <div className="mb-6 flex items-center gap-2 rounded-md border border-red-700 bg-red-900/30 px-3 py-2 text-red-200">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-mono">{expiredCopy}</span>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400 font-mono">INSTRUCCIONES DE LA MISIÓN</span>
        </div>
        <p className="text-gray-300 leading-relaxed font-mono">{challenge.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400 font-mono">CONSULTA DE INVESTIGACIÓN</span>
        </div>

        {/* Bloquea edición cuando expira */}
        <div className={isExpired ? 'pointer-events-none opacity-60' : ''}>
          <SQLTemplate
            challenge={challenge}
            onSolutionChange={handleSolutionChange}
            isCompleted={isCompleted}
            isIncorrect={isIncorrect}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isCompleted && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium font-mono">OBJETIVO COMPLETADO</span>
            </motion.div>
          )}

          {isIncorrect && !isExpired && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-red-400">
              <X className="w-5 h-5" />
              <span className="text-sm font-medium font-mono">ANÁLISIS INCORRECTO</span>
            </motion.div>
          )}
        </div>

        <div className="flex gap-3">
          {!isCompleted && (
            <motion.button
              whileHover={{ scale: isExpired ? 1 : 1.02 }}
              whileTap={{ scale: isExpired ? 1 : 0.98 }}
              onClick={checkSolution}
              className={`bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center gap-2 cursor-pointer border border-gray-600 ${
                isExpired || isValidating ? 'opacity-60 cursor-not-allowed hover:bg-gray-700' : ''
              }`}
              disabled={!currentSolution.trim() || isExpired || isValidating}
            >
              <Target className="w-4 h-4" />
              <span className="font-mono">{isValidating ? 'VALIDANDO...' : isExpired ? 'TIEMPO AGOTADO' : 'ANALIZAR DATOS'}</span>
            </motion.button>
          )}

          {isCompleted && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNext}
              className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center gap-2 cursor-pointer border border-gray-600"
            >
              <span className="font-mono">SIGUIENTE OBJETIVO</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
