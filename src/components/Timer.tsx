import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle, Target, Zap } from 'lucide-react';
import type { TimerState } from '../types/game';

interface TimerProps {
  timerState: TimerState;
  onTimeUpdate: (elapsedTime: number) => void;
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({ timerState, onTimeUpdate, className = '' }) => {
  const [displayTime, setDisplayTime] = useState(0);

  useEffect(() => {
    let interval: number;

    if (timerState.isRunning && timerState.startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - timerState.startTime!) / 1000);
        setDisplayTime(elapsed);
        onTimeUpdate(elapsed);
      }, 100);
    } else {
      setDisplayTime(timerState.elapsedTime);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState.isRunning, timerState.startTime, timerState.elapsedTime, onTimeUpdate]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = (): string => {
    if (!timerState.timeLimit) return 'text-primary-400';
    
    const percentage = (displayTime / timerState.timeLimit) * 100;
    if (percentage >= 90) return 'text-red-400';
    if (percentage >= 75) return 'text-yellow-400';
    return 'text-primary-400';
  };

  const getTimeIcon = () => {
    if (!timerState.timeLimit) return <Clock className="w-5 h-5 text-primary-400" />;
    
    const percentage = (displayTime / timerState.timeLimit) * 100;
    if (percentage >= 90) return <Zap className="w-5 h-5 text-red-400" />;
    if (percentage >= 75) return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    return <Target className="w-5 h-5 text-primary-400" />;
  };

  const getTimeStatus = (): string => {
    if (!timerState.timeLimit) return 'SISTEMA ACTIVO';
    
    const percentage = (displayTime / timerState.timeLimit) * 100;
    if (percentage >= 90) return 'CRÍTICO';
    if (percentage >= 75) return 'ALERTA';
    return 'OPERATIVO';
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
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
        <div className={`w-2 h-2 rounded-full animate-pulse ${
          getTimeColor().includes('red') ? 'bg-red-500' : 
          getTimeColor().includes('yellow') ? 'bg-yellow-500' : 'bg-primary-500'
        }`}></div>
        <span className={`text-xs font-mono ${getTimeColor()}`}>
          {getTimeStatus()}
        </span>
      </div>
    </div>
  );
};
