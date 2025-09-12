import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { LoginPage, RegisterPage, HomePage, ChapterPage } from './pages';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono">Verificando credenciales...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <RegisterPage />
          } 
        />
        
        {/* Protected routes */}
        <Route 
          path="/home" 
          element={
            isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/chapter/:id" 
          element={
            isAuthenticated ? <ChapterPage /> : <Navigate to="/login" replace />
          } 
        />
        
        {/* Default redirect */}
        <Route 
          path="/" 
          element={
            <Navigate to={isAuthenticated ? "/home" : "/login"} replace />
          } 
        />
        
        {/* Catch all route */}
        <Route 
          path="*" 
          element={
            <Navigate to={isAuthenticated ? "/home" : "/login"} replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
