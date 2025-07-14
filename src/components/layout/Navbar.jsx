// src/components/layout/Navbar.jsx

import React from 'react';
import { Link, NavLink } from 'react-router-dom';
// Importamos todo lo que necesitamos de nuestro hook de autenticación
import { useAuth } from '../../contexts/AuthContext';
// Importamos los iconos, incluyendo el del panel de admin
import { School, AccountCircle, ExitToApp, AdminPanelSettings } from '@mui/icons-material';

const Navbar = () => {
  // Ahora también obtenemos `userData` que contiene el rol
  const { currentUser, userData, logout } = useAuth();

  return (
    <nav className="navbar-sticky">
      <div className="navbar-container">
        
        {/* --- LADO IZQUIERDO: Logo (sin cambios) --- */}
        <Link to="/" className="navbar-logo">
          <School sx={{ fontSize: '28px', color: '#14b8a6' }} />
          <span>CursosOnline</span>
        </Link>

        {/* --- LADO DERECHO: Grupo completo de navegación --- */}
        <div className="navbar-right-group">
        
          <div className="navbar-links">
            <NavLink to="/" className={({isActive}) => isActive ? "navbar-link active" : "navbar-link"}>Inicio</NavLink>
            <NavLink to="/cursos" className={({isActive}) => isActive ? "navbar-link active" : "navbar-link"}>Cursos</NavLink>
            
            {/* Se muestra para cualquier usuario logueado */}
            {currentUser && (
              <NavLink to="/mis-cursos" className={({isActive}) => isActive ? "navbar-link active" : "navbar-link"}>Mis Cursos</NavLink>
            )}

            {/* ======== AQUÍ INTEGRAMOS LA LÓGICA DE ADMIN ======== */}
            {/* Este bloque solo se renderiza si `userData.role` es 'admin' */}
            {userData?.role === 'admin' && (
                <>
                    {/* Un divisor para separar visualmente los links de admin */}
                    <div className="navbar-divider"></div> 
                    
                    <NavLink
                        to="/admin" // Ruta principal del dashboard de administrador
                        className={({isActive}) => "navbar-link admin-link" + (isActive ? " active" : "")}
                    >
                        <AdminPanelSettings sx={{ fontSize: '20px', marginRight: '8px' }}/>
                        <span>Panel Admin</span>
                    </NavLink>
                </>
            )}
          </div>

          <div className="navbar-actions">
            {currentUser ? (
              // Vista para usuario logueado
              <>
                <Link to="/perfil" className="navbar-profile-link">
                  <div className="navbar-avatar">
                    {currentUser.photoURL ? ( <img src={currentUser.photoURL} alt="Mi Perfil" /> ) : ( <AccountCircle fontSize="inherit" /> )}
                  </div>
                </Link>
                <button onClick={logout} className="navbar-logout-button" title="Salir">
                    <ExitToApp />
                </button>
              </>
            ) : (
              // Vista para visitantes
              <Link to="/login" className="navbar-button primary">
                Iniciar Sesión
              </Link>
            )}
          </div>

        </div> {/* Fin de navbar-right-group */}
      </div>
    </nav>
  );
};

export default Navbar;