import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, SkipForward, TimerReset, MessageSquare, Clock, User } from "lucide-react";

export type DialogItem =
  | string
  | {
      id?: string | number;
      text: string;
      durationMs?: number; // si no viene, usa intervalMs
    };

interface ComicDialogPanelProps {
  dialogs: DialogItem[];
  intervalMs?: number;
  autoStart?: boolean;
  onIndexChange?: (index: number) => void;
  onFinish?: () => void;
  className?: string;
  showControls?: boolean;
  showHeader?: boolean;
}

export const ComicDialogPanel: React.FC<ComicDialogPanelProps> = ({
  dialogs,
  intervalMs = 3500,
  autoStart = true,
  onIndexChange,
  onFinish,
  className = "",
  showControls = true,
  showHeader = true,
}) => {
  const normalized = useMemo(
    () =>
      dialogs.map((d, i) =>
        typeof d === "string"
          ? { id: i, text: d, durationMs: intervalMs }
          : { id: d.id ?? i, text: d.text, durationMs: d.durationMs ?? intervalMs }
      ),
    [dialogs, intervalMs]
  );

  const [index, setIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [elapsed, setElapsed] = useState(0);
  const tickRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const current = normalized[index];
  const duration = current?.durationMs ?? intervalMs;

  useEffect(() => {
    if (!isRunning || !current) return;

    const loop = (t: number) => {
      if (startRef.current == null) startRef.current = t;
      const dt = t - startRef.current;
      setElapsed(dt);

      if (dt >= duration) {
        startRef.current = null;
        setElapsed(0);
        if (index < normalized.length - 1) {
          const next = index + 1;
          setIndex(next);
          onIndexChange?.(next);
        } else {
          setIsRunning(false);
          onFinish?.();
        }
      } else {
        tickRef.current = requestAnimationFrame(loop);
      }
    };

    tickRef.current = requestAnimationFrame(loop);
    return () => {
      if (tickRef.current) cancelAnimationFrame(tickRef.current);
      tickRef.current = null;
    };
  }, [isRunning, index, duration, normalized.length, onFinish, onIndexChange, current]);

  useEffect(() => {
    setElapsed(0);
    startRef.current = null;
  }, [index]);

  const handlePause = () => setIsRunning(false);
  const handlePlay = () => current && setIsRunning(true);
  const handleSkip = () => {
    if (index < normalized.length - 1) {
      const next = index + 1;
      setIndex(next);
      onIndexChange?.(next);
    } else {
      setIsRunning(false);
      onFinish?.();
    }
  };
  const handleReset = () => {
    setIndex(0);
    setElapsed(0);
    startRef.current = null;
    onIndexChange?.(0);
    setIsRunning(true);
  };

  const progress = current ? Math.min(1, elapsed / duration) : 0;
  if (!current) return null;

  return (
    <div className={["relative", className || "w-full"].join(" ")}>
      {showHeader && (
        <div className="mb-4">
          {/* Header principal */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-primary-500 p-1.5 rounded-lg">
                <MessageSquare className="w-3 h-3 text-white" />
              </div>
              <div className="text-xs font-mono text-gray-300">
                <span className="hidden sm:inline">TRANSMISIÓN {index + 1} / {normalized.length}</span>
                <span className="sm:hidden">TX {index + 1}/{normalized.length}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <Clock className="w-3 h-3" />
              <span className="hidden sm:inline">
                {Math.max(0, Math.ceil((duration - elapsed) / 100) / 10)}s restantes
              </span>
              <span className="sm:hidden">
                {Math.max(0, Math.ceil((duration - elapsed) / 100) / 10)}s
              </span>
            </div>
          </div>
        </div>
      )}

      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden"
      >
        {/* Header del diálogo */}
        <div className="bg-gray-700/50 border-b border-gray-600 px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-pulse"></div>
              <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
            </div>
            <div className="text-xs font-mono text-gray-300">
              <span className="hidden sm:inline">AGENTE EN CAMPO</span>
              <span className="sm:hidden">AGENTE</span>
            </div>
            <div className="flex-1"></div>
            <div className="text-xs font-mono text-gray-500">
              <span className="hidden sm:inline">[CLASIFICADO]</span>
              <span className="sm:hidden">[CLAS]</span>
            </div>
          </div>
        </div>

        {/* Contenido del diálogo */}
        <div className="p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <p className="text-gray-100 leading-relaxed font-mono text-base sm:text-lg">
                {current.text}
              </p>
              
              {/* Efecto de cursor parpadeante */}
              <motion.span
                className="inline-block w-0.5 h-5 bg-primary-400 ml-1"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Barra de progreso mejorada */}
        <div className="h-1 w-full bg-gray-700 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
            initial={{ width: "0%" }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ type: "tween", ease: "linear", duration: 0.05 }}
          />
        </div>
      </motion.div>

      {showControls && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          {/* Controles en grid para mobile, flex para desktop */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
            {/* Botón principal (Play/Pause) - ocupa toda la fila en mobile */}
            <div className="col-span-2 sm:col-span-1">
              {isRunning ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePause}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-xs sm:text-sm text-gray-200 hover:bg-gray-600 hover:border-gray-500 transition-all duration-200 font-mono"
                >
                  <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">PAUSAR</span>
                  <span className="sm:hidden">PAUSA</span>
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePlay}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-primary-600 bg-primary-700 px-3 py-2 text-xs sm:text-sm text-white hover:bg-primary-600 transition-all duration-200 font-mono"
                >
                  <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">REANUDAR</span>
                  <span className="sm:hidden">PLAY</span>
                </motion.button>
              )}
            </div>

            {/* Botones secundarios - 2 por fila en mobile */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSkip}
              className="inline-flex items-center justify-center gap-1 sm:gap-2 rounded-lg border border-gray-600 bg-gray-700 px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-200 hover:bg-gray-600 hover:border-gray-500 transition-all duration-200 font-mono"
            >
              <SkipForward className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">SIGUIENTE</span>
              <span className="sm:hidden">SIG.</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-1 sm:gap-2 rounded-lg border border-gray-600 bg-gray-700 px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-200 hover:bg-gray-600 hover:border-gray-500 transition-all duration-200 font-mono"
            >
              <TimerReset className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">REINICIAR</span>
              <span className="sm:hidden">RESET</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ComicDialogPanel;
