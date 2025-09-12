import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { StoryImage as StoryImageType } from '../types/game';
import ComicDialogPanel from './ComicDialogPanel';
import type { DialogItem } from './ComicDialogPanel';

interface StoryImageProps {
  image: StoryImageType;
  onNext: () => void;
  className?: string;
  dialogs?: DialogItem[];
  hideContinueButton?: boolean;
}

export const StoryImage: React.FC<StoryImageProps> = ({
  image,
  onNext,
  className = '',
  dialogs = [],
  hideContinueButton = false,
}) => {
  const hasDialogs = dialogs.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen flex items-center justify-center px-6 ${className}`}
    >
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-xl"
        >
          {/* Imagen */}
          <div className="mb-6">
            <div className="relative rounded-lg overflow-hidden bg-gray-700">
              <img
                src={image.url}
                alt={image.caption || `Escena ${image.order}`}
                className="w-full h-auto max-h-96 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (
                    !target.src.includes('placehold.co') &&
                    !target.src.includes('via.placeholder')
                  ) {
                    target.src = `https://placehold.co/800x400/1f2937/ffffff/png?text=Imagen+${image.order}`;
                  }
                }}
              />
              {/* 🔕 Se elimina el badge "ESCENA X" */}
            </div>
          </div>

          {/* 👇 Panel de diálogos debajo de la imagen */}
          {hasDialogs && (
            <div className="mb-6">
              <ComicDialogPanel
                dialogs={dialogs}
                intervalMs={10000}
                autoStart
                className="w-full"
                onFinish={onNext}
                // puedes ocultar header/controles si quieres:
                // showHeader={false}
                // showControls={false}
              />
            </div>
          )}

          {/* Botón Continuar (mismo estilo que los otros botones) */}
          {!hideContinueButton && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="text-center"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onNext}
                className="inline-flex items-center gap-2 rounded-md border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-100 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 mx-auto"
              >
                <span>Continuar</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StoryImage;
