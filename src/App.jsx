// src/App.jsx (Código completo con las rutas corregidas)

// --- 1. IMPORTACIONES ---
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartSidebar from './components/common/CartSidebar';

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

// --- 2. COMPONENTES DE PROTECCIÓN DE RUTAS (Sin cambios) ---
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


// --- 3. COMPONENTE RAÍZ DE LA APLICACIÓN ---
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app-container">
            
            <Navbar />

            <main className="main-content">
              <Routes>
                {/* ======== RUTAS CORREGIDAS PARA SER CONSISTENTES EN ESPAÑOL ======== */}
                {/* Rutas Públicas */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/cursos" element={<CoursesPage />} /> {/* Catálogo de cursos */}
                <Route path="/curso/:courseId" element={<CourseDetailPage />} /> {/* Detalle de un curso */}
                
                {/* =================================================================== */}
                
                {/* Rutas Privadas */}
                <Route path="/perfil" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                <Route path="/mis-cursos" element={<PrivateRoute><MyCoursesPage /></PrivateRoute>} />
                <Route path="/classroom/:courseId" element={<PrivateRoute><ClassroomPage /></PrivateRoute>} />
                
                {/* Ruta de Administrador */}
                <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              </Routes>
            </main>

            <Footer />

            <CartSidebar /> 
          </div>
        </Router>

        <Toaster 
          position="bottom-center"
          toastOptions={{
            success: {
              style: { background: '#28a745', color: 'white' }
            },
            error: {
              style: { background: '#dc3545', color: 'white' }
            }
          }}
        />
      </CartProvider>
    </AuthProvider>
  );
}

// --- 4. EXPORTACIÓN POR DEFECTO ---
export default App;