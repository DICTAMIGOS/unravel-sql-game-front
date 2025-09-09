import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
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

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Clock className="w-5 h-5 text-primary-400" />
      <span className={`font-mono text-lg font-semibold ${getTimeColor()}`}>
        {formatTime(displayTime)}
      </span>
      {timerState.timeLimit && (
        <span className="text-gray-400 text-sm">
          / {formatTime(timerState.timeLimit)}
        </span>
      )}
    </div>
  );
};
