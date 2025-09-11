import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Image as ImageIcon } from 'lucide-react';
import type { StoryImage as StoryImageType } from '../types/game';

interface StoryImageProps {
  image: StoryImageType;
  onNext: () => void;
  className?: string;
}

export const StoryImage: React.FC<StoryImageProps> = ({
  image,
  onNext,
  className = ''
}) => {
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
          {/* Image */}
          <div className="mb-6">
            <div className="relative rounded-lg overflow-hidden bg-gray-700">
              <img
                src={image.url}
                alt={image.caption || `Escena ${image.order}`}
                className="w-full h-auto max-h-96 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  // Evitar ciclo infinito verificando si ya es un fallback
                  if (!target.src.includes('placehold.co') && !target.src.includes('via.placeholder')) {
                    target.src = `https://placehold.co/800x400/1f2937/ffffff/png?text=Imagen+${image.order}`;
                  }
                }}
              />
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary-400" />
                  <span className="text-xs text-primary-400 font-mono">
                    ESCENA {image.order}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Caption */}
          {image.caption && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="text-center mb-8"
            >
              <p className="text-gray-300 text-lg leading-relaxed">
                {image.caption}
              </p>
            </motion.div>
          )}

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center gap-2 mx-auto"
            >
              <span>Continuar</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};
