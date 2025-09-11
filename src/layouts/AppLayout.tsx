import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Search, AlertTriangle, LogOut } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  currentView: 'menu' | 'level' | 'login';
  currentLevel: number;
  isAuthenticated: boolean;
  onBack: () => void;
  onLogin: () => void;
  onLogout: () => void;
}

const HeaderButton = ({ isLogin, onBack, onLogin, onLogout, isAuthenticated, isMobile }: {
  isLogin: boolean;
  onBack: () => void;
  onLogin: () => void;
  onLogout: () => void;
  isAuthenticated: boolean;
  isMobile: boolean;
}) => {
  const buttonClass = isMobile 
    ? "bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium py-2 px-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center gap-1 border border-gray-600 cursor-pointer text-sm"
    : "bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center gap-2 border border-gray-600 cursor-pointer";

  if (isLogin) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className={buttonClass}
      >
        <ArrowLeft className="w-4 h-4" />
        <span className={isMobile ? "hidden xs:inline" : ""}>Volver</span>
      </motion.button>
    );
  }

  if (isAuthenticated) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onLogout}
        className={buttonClass}
      >
        <LogOut className="w-4 h-4" />
        <span className={isMobile ? "hidden xs:inline" : ""}>
          {isMobile ? "Salir" : "Cerrar Sesión"}
        </span>
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onLogin}
      className={buttonClass}
    >
      <Shield className="w-4 h-4" />
      <span className={isMobile ? "hidden xs:inline" : ""}>
        {isMobile ? "Acceso" : "Acceso Seguro"}
      </span>
    </motion.button>
  );
};

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  currentView,
  currentLevel,
  isAuthenticated,
  onBack,
  onLogin,
  onLogout
}) => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(14, 165, 233, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(217, 70, 239, 0.1) 0%, transparent 50%)`
        }} />
      </div>

      <header className="relative z-10 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          {/* Mobile Layout */}
          <div className="block sm:hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-600 rounded-lg relative">
                  <Shield className="w-5 h-5 text-white" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-100">Unravel</h1>
                  <div className="text-xs text-primary-400 font-mono">SISTEMA ACTIVO</div>
                </div>
              </div>
              <HeaderButton 
                isLogin={currentView === 'login'}
                onBack={onBack}
                onLogin={onLogin}
                onLogout={onLogout}
                isAuthenticated={isAuthenticated}
                isMobile={true}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-3 h-3 text-primary-400" />
                <span className="text-xs text-primary-400 font-mono">INVESTIGACIÓN</span>
                <AlertTriangle className="w-3 h-3 text-yellow-400" />
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400 font-mono">
                  {currentView === 'level' ? 'MISIÓN ACTIVA' : 'STANDBY'}
                </div>
                <div className="text-xs text-gray-500">
                  {currentView === 'level' ? `Cap. ${currentLevel}` : 'Operativo'}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-600 rounded-lg relative">
                <Shield className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-100">Unravel: The data detective</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Search className="w-3 h-3 text-primary-400" />
                  <span className="text-xs text-primary-400 font-mono">SISTEMA DE INVESTIGACIÓN</span>
                  <AlertTriangle className="w-3 h-3 text-yellow-400" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-400 font-mono">
                  {currentView === 'level' ? 'MISIÓN ACTIVA' : 'SISTEMA STANDBY'}
                </div>
                <div className="text-xs text-gray-500">
                  {currentView === 'level' ? `Capítulo ${currentLevel}` : 'Estado: Operativo'}
                </div>
              </div>
              <HeaderButton 
                isLogin={currentView === 'login'}
                onBack={onBack}
                onLogin={onLogin}
                onLogout={onLogout}
                isAuthenticated={isAuthenticated}
                isMobile={false}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {children}
      </main>

      <footer className="relative z-10 bg-gray-800/80 backdrop-blur-sm border-t border-gray-700 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="text-center text-gray-400 text-sm">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Search className="w-4 h-4 text-primary-400" />
              <p className="font-mono">UNRAVEL: THE DATA DETECTIVE</p>
              <Search className="w-4 h-4 text-primary-400" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500 font-mono">SISTEMA DE INVESTIGACIÓN OPERATIVO</span>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <p className="mt-2 text-xs text-gray-500 font-mono">
              Desarrollado con 💙 por <a href="https://www.dictamigos.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-300 font-mono">DICTAMIGOS</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
