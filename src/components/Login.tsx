import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Eye, EyeOff, Search, Shield, Fingerprint } from 'lucide-react';

interface LoginProps {
  onBack: () => void;
}

export const Login: React.FC<LoginProps> = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center px-6"
    >
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-xl"
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-primary-500 p-2 rounded-lg relative">
                <Shield className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-2xl font-bold text-white">
                {isRegistering ? 'Solicitud de Acceso' : 'Acceso Seguro'}
              </h1>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Search className="w-5 h-5 text-primary-400" />
              <span className="text-primary-400 font-medium text-sm">
                {isRegistering ? 'SOLICITUD DE CREDENCIALES' : 'SISTEMA DE AUTENTICACIÓN'}
              </span>
              <Search className="w-5 h-5 text-primary-400" />
            </div>
            <p className="text-gray-400">
              {isRegistering 
                ? 'Completa el formulario para solicitar acceso al sistema'
                : 'Identifícate para acceder a los archivos clasificados'
              }
            </p>
            <div className="mt-2 text-xs text-gray-500 font-mono">
              [NIVEL DE SEGURIDAD: MÁXIMO]
            </div>
          </div>

          <form onSubmit={isRegistering ? handleRegister : handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="flex text-sm font-medium text-gray-300 mb-2 items-center gap-2">
                <Fingerprint className="w-4 h-4 text-primary-400" />
                ID de Agente
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-700 border border-gray-600 text-gray-100 rounded-lg px-3 py-3 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-mono"
                  placeholder="AGENT_XXXXX"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="flex text-sm font-medium text-gray-300 mb-2 items-center gap-2">
                <Shield className="w-4 h-4 text-primary-400" />
                Código de Acceso
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700 border border-gray-600 text-gray-100 rounded-lg px-3 py-3 pl-10 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-mono"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-gray-100 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center gap-2 cursor-pointer border border-gray-600"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {isRegistering ? 'Procesando solicitud...' : 'Autenticando...'}
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  {isRegistering ? 'Enviar Solicitud' : 'Acceder al Sistema'}
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            {isRegistering ? (
              <p className="text-gray-400 text-sm">
                ¿Ya tienes credenciales?{' '}
                <button 
                  onClick={() => setIsRegistering(false)}
                  className="cursor-pointer text-primary-400 hover:text-primary-300 font-medium transition-colors duration-200"
                >
                  Iniciar Sesión
                </button>
              </p>
            ) : (
              <p className="text-gray-400 text-sm">
                ¿No eres un agente autorizado?{' '}
                <button 
                  onClick={() => setIsRegistering(true)}
                  className="cursor-pointer text-primary-400 hover:text-primary-300 font-medium transition-colors duration-200"
                >
                  Solicitar Acceso
                </button>
              </p>
            )}
          </div>

          <div className="text-center mt-6 pt-6 border-t border-gray-700">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-gray-500 text-xs font-mono">SISTEMA MONITOREADO</span>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-gray-500 text-xs">
              Acceso restringido a personal autorizado únicamente
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
