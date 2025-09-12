import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, SkipForward, TimerReset } from "lucide-react";

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
        <div className="mb-2 flex items-center justify-between">
          <div className="text-xs font-mono text-gray-200">DIÁLOGO {index + 1} / {normalized.length}</div>
          <div className="text-xs font-mono text-gray-200">
            {Math.max(0, Math.ceil((duration - elapsed) / 100) / 10)}s restantes
          </div>
        </div>
      )}

      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="rounded-xl border border-gray-200 bg-white text-gray-900 shadow-lg"
      >
        <div className="p-4 sm:p-5">
          <AnimatePresence mode="wait">
            <motion.p
              key={current.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="text-base sm:text-lg leading-relaxed font-medium"
            >
              {current.text}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="h-1.5 w-full bg-gray-200/70 overflow-hidden rounded-b-xl">
          <motion.div
            className="h-full bg-gray-900"
            initial={{ width: "0%" }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ type: "tween", ease: "linear", duration: 0.05 }}
          />
        </div>
      </motion.div>

      {showControls && (
        <div className="mt-3 flex items-center gap-2">
          {isRunning ? (
            <button
              onClick={handlePause}
              className="inline-flex items-center gap-2 rounded-md border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-100 hover:bg-gray-700"
            >
              <Pause className="h-4 w-4" />
              Pausa
            </button>
          ) : (
            <button
              onClick={handlePlay}
              className="inline-flex items-center gap-2 rounded-md border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-100 hover:bg-gray-700"
            >
              <Play className="h-4 w-4" />
              Reanudar
            </button>
          )}

          <button
            onClick={handleSkip}
            className="inline-flex items-center gap-2 rounded-md border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-100 hover:bg-gray-700"
          >
            <SkipForward className="h-4 w-4" />
            Siguiente
          </button>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-md border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-100 hover:bg-gray-700"
          >
            <TimerReset className="h-4 w-4" />
            Reiniciar
          </button>
        </div>
      )}
    </div>
  );
};

export default ComicDialogPanel;
