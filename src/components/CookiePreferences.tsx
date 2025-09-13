import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cookie, Settings, Shield, BarChart3, Target, RotateCcw } from 'lucide-react';
import { useCookieConsent, type CookiePreferences as UseCookiePreferencesType } from '../hooks/useCookieConsent';

interface CookiePreferencesProps {
  className?: string;
}

export const CookiePreferences: React.FC<CookiePreferencesProps> = ({ className = '' }) => {
  const { consent, acceptSelected, resetConsent } = useCookieConsent();
  const [preferences, setPreferences] = useState<UseCookiePreferencesType>(
    consent?.preferences || {
      necessary: true,
      functional: true,
      analytics: false,
      marketing: false,
    }
  );

  const togglePreference = (key: keyof UseCookiePreferencesType) => {
    if (key === 'necessary') return; // No se puede desactivar
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSavePreferences = () => {
    acceptSelected(preferences);
  };

  const handleResetConsent = () => {
    resetConsent();
    setPreferences({
      necessary: true,
      functional: true,
      analytics: false,
      marketing: false,
    });
  };

  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-xl p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary-500 p-2 rounded-lg">
          <Cookie className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-100 font-mono">
            PREFERENCIAS DE COOKIES
          </h2>
          <p className="text-sm text-gray-400 font-mono">
            Gestiona tu consentimiento para el uso de cookies
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {/* Cookies Necesarias */}
        <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-400" />
            <div>
              <h3 className="font-medium text-gray-100 font-mono">Cookies Necesarias</h3>
              <p className="text-sm text-gray-400">
                Autenticación, sesión de usuario y funcionalidad básica del juego
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-green-400">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-sm font-mono">Siempre activas</span>
          </div>
        </div>

        {/* Cookies Funcionales */}
        <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-medium text-gray-100 font-mono">Cookies Funcionales</h3>
              <p className="text-sm text-gray-400">
                Preferencias de dificultad, progreso del juego y configuraciones
              </p>
            </div>
          </div>
          <button
            onClick={() => togglePreference('functional')}
            className={`w-12 h-6 rounded-full transition-colors ${
              preferences.functional ? 'bg-primary-500' : 'bg-gray-600'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
              preferences.functional ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        {/* Cookies Analíticas */}
        <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-yellow-400" />
            <div>
              <h3 className="font-medium text-gray-100 font-mono">Cookies Analíticas</h3>
              <p className="text-sm text-gray-400">
                Estadísticas de uso, tiempo de juego y rendimiento
              </p>
            </div>
          </div>
          <button
            onClick={() => togglePreference('analytics')}
            className={`w-12 h-6 rounded-full transition-colors ${
              preferences.analytics ? 'bg-primary-500' : 'bg-gray-600'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
              preferences.analytics ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        {/* Cookies de Marketing */}
        <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="font-medium text-gray-100 font-mono">Cookies de Marketing</h3>
              <p className="text-sm text-gray-400">
                Publicidad personalizada y seguimiento de campañas
              </p>
            </div>
          </div>
          <button
            onClick={() => togglePreference('marketing')}
            className={`w-12 h-6 rounded-full transition-colors ${
              preferences.marketing ? 'bg-primary-500' : 'bg-gray-600'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
              preferences.marketing ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mb-6 p-4 bg-gray-700/30 rounded-lg">
        <h4 className="font-medium text-gray-100 font-mono mb-2">INFORMACIÓN ADICIONAL</h4>
        <p className="text-sm text-gray-400 leading-relaxed">
          Las cookies necesarias son esenciales para el funcionamiento del juego y no se pueden desactivar. 
          Puedes cambiar tus preferencias en cualquier momento. Los cambios se aplicarán inmediatamente.
        </p>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleResetConsent}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-gray-100 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 transition-colors font-mono"
        >
          <RotateCcw className="w-4 h-4" />
          RESETEAR CONSENTIMIENTO
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSavePreferences}
          className="flex-1 px-4 py-2 text-sm text-white bg-primary-600 hover:bg-primary-700 rounded-lg border border-primary-500 transition-colors font-mono"
        >
          GUARDAR PREFERENCIAS
        </motion.button>
      </div>
    </div>
  );
};

export default CookiePreferences;
