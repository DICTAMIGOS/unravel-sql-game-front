import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle, Target, Zap } from 'lucide-react';
import type { TimerState } from '../types/game';

interface TimerProps {
  timerState: TimerState;
  onTimeUpdate: (elapsedTime: number) => void;
  onTimeLimitExceeded?: (elapsedTime: number) => void; // ⬅️ nuevo
  className?: string;
  showExpiredBanner?: boolean; // ⬅️ opcional UI
  expiredMessage?: string;     // ⬅️ opcional UI
}

export const Timer: React.FC<TimerProps> = ({
  timerState,
  onTimeUpdate,
  onTimeLimitExceeded,
  className = '',
  showExpiredBanner = true,
  expiredMessage = 'Tiempo límite alcanzado',
}) => {
  const [displayTime, setDisplayTime] = useState(0);
  const [firedTimeout, setFiredTimeout] = useState(false); // ⬅️ evita múltiples disparos

  // Resetea la bandera cuando reinicias/arrancas nuevo timer
  useEffect(() => {
    setFiredTimeout(false);
  }, [timerState.startTime, timerState.timeLimit, timerState.isRunning]);

  useEffect(() => {
    let interval: number | undefined;

    if (timerState.isRunning && timerState.startTime) {
      interval = window.setInterval(() => {
        const elapsed = Math.floor((Date.now() - timerState.startTime!) / 1000);
        setDisplayTime(elapsed);
        onTimeUpdate(elapsed);

        // ⏰ dispara error una sola vez al sobrepasar el límite
        if (
          timerState.timeLimit != null &&
          elapsed >= timerState.timeLimit &&
          !firedTimeout
        ) {
          setFiredTimeout(true);
          onTimeLimitExceeded?.(elapsed);
        }
      }, 100);
    } else {
      setDisplayTime(timerState.elapsedTime);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    timerState.isRunning,
    timerState.startTime,
    timerState.elapsedTime,
    timerState.timeLimit,
    onTimeUpdate,
    onTimeLimitExceeded,
    firedTimeout,
  ]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = (): string => {
    if (!timerState.timeLimit) return 'text-primary-400';
    const percentage = (displayTime / timerState.timeLimit) * 100;
    if (percentage >= 100) return 'text-red-400';
    if (percentage >= 90) return 'text-red-400';
    if (percentage >= 75) return 'text-yellow-400';
    return 'text-primary-400';
  };

  const getTimeIcon = () => {
    if (!timerState.timeLimit) return <Clock className="w-5 h-5 text-primary-400" />;
    const percentage = (displayTime / timerState.timeLimit) * 100;
    if (percentage >= 100) return <AlertTriangle className="w-5 h-5 text-red-400" />;
    if (percentage >= 90) return <Zap className="w-5 h-5 text-red-400" />;
    if (percentage >= 75) return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    return <Target className="w-5 h-5 text-primary-400" />;
  };

  const getTimeStatus = (): string => {
    if (!timerState.timeLimit) return 'SISTEMA ACTIVO';
    const percentage = (displayTime / timerState.timeLimit) * 100;
    if (percentage >= 100) return 'TIEMPO AGOTADO';
    if (percentage >= 90) return 'CRÍTICO';
    if (percentage >= 75) return 'ALERTA';
    return 'OPERATIVO';
  };

  const isExpired =
    timerState.timeLimit != null && displayTime >= timerState.timeLimit;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Línea principal del timer */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {getTimeIcon()}
          <span className={`font-mono text-lg font-semibold ${getTimeColor()}`}>
            {formatTime(displayTime)}
          </span>
          {timerState.timeLimit && (
            <span className="text-gray-400 text-sm font-mono">
              / {formatTime(timerState.timeLimit)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full animate-pulse ${
              isExpired
                ? 'bg-red-500'
                : getTimeColor().includes('red')
                ? 'bg-red-500'
                : getTimeColor().includes('yellow')
                ? 'bg-yellow-500'
                : 'bg-primary-500'
            }`}
          ></div>
          <span className={`text-xs font-mono ${getTimeColor()}`}>
            {getTimeStatus()}
          </span>
        </div>
      </div>

      {/* Banda de error opcional */}
      {showExpiredBanner && isExpired && (
        <div className="flex items-center gap-2 rounded-md border border-red-700 bg-red-900/30 px-3 py-2 text-red-200">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-mono">{expiredMessage}</span>
        </div>
      )}
    </div>
  );
};
