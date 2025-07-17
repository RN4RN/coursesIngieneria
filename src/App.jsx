// src/App.jsx

// --- 1. IMPORTACIONES ---
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Contexto y Componentes
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Páginas
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import MyCoursesPage from './pages/user/MyCoursesPage';
import ClassroomPage from './pages/ClassroomPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProfilePage from './pages/user/ProfilePage';

// Estilos globales
import './App.css'; 

// --- 2. COMPONENTES DE PROTECCIÓN DE RUTAS ---
const AdminRoute = ({ children }) => {
  const { userData, loading } = useAuth();
  if (loading) return <div className="loading-screen"><p>Verificando permisos...</p></div>;
  return userData?.role === 'admin' ? children : <Navigate to="/" />;
};

const PrivateRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();
    if (loading) return <div className="loading-screen"><p>Cargando sesión...</p></div>;
    return currentUser ? children : <Navigate to="/login" />;
};

// --- 3. COMPONENTE DE CONTENIDO PRINCIPAL ---
function AppContent() {
  return (
    <Router>
      <div className="app-container">
        {/* Navbar ahora es parte del layout y está fuera del main content para que sea persistente */}
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cursos" element={<CoursesPage />} />
            <Route path="/curso/:courseId" element={<CourseDetailPage />} />
            
            {/* Rutas Privadas */}
            <Route path="/perfil" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/mis-cursos" element={<PrivateRoute><MyCoursesPage /></PrivateRoute>} />
            <Route path="/classroom/:courseId" element={<PrivateRoute><ClassroomPage /></PrivateRoute>} />
            
            {/* Ruta de Administrador */}
            <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

            {/* Futura página 404 <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

// --- 4. COMPONENTE RAÍZ DE LA APLICACIÓN ---
function App() {
  return (
    <AuthProvider> 
        <AppContent /> 
        <Toaster 
          position="bottom-center"
          toastOptions={{
            success: {
              style: {
                background: 'linear-gradient(90deg, #10b981, #059669)',
                color: 'white',
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                borderRadius: '9999px',
              },
            },
            error: {
              style: {
                background: 'linear-gradient(90deg, #ef4444, #dc2626)',
                color: 'white',
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                borderRadius: '9999px',
              },
            },
          }}
        />
    </AuthProvider>
  );
}

// --- 5. EXPORTACIÓN POR DEFECTO ---
export default App;