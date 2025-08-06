// src/components/layout/Navbar.jsx (Código completo y corregido)

import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { School, AccountCircle, ExitToApp, AdminPanelSettings } from '@mui/icons-material';
import { FaShoppingCart } from 'react-icons/fa';

const Navbar = () => {
  const { currentUser, userData, logout } = useAuth();
  const { openCart, cartItems } = useCart();

  return (
    <nav className="navbar-sticky">
      <div className="navbar-container">
        
        <Link to="/" className="navbar-logo">
          <School sx={{ fontSize: '28px', color: '#14b8a6' }} />
          <span>CursosOnline</span>
        </Link>

        <div className="navbar-right-group">
        
          <div className="navbar-links">
            <NavLink to="/" className={({isActive}) => isActive ? "navbar-link active" : "navbar-link"}>Inicio</NavLink>
            
            {/* ====== LA CORRECCIÓN ESTÁ AQUÍ ====== */}
            <NavLink to="/cursos" className={({isActive}) => isActive ? "navbar-link active" : "navbar-link"}>Cursos</NavLink>
            {/* ==================================== */}
            
            {currentUser && (
              <NavLink to="/mis-cursos" className={({isActive}) => isActive ? "navbar-link active" : "navbar-link"}>Mis Cursos</NavLink>
            )}

            {userData?.role === 'admin' && (
                <>
                    <div className="navbar-divider"></div> 
                    <NavLink to="/admin" className={({isActive}) => "navbar-link admin-link" + (isActive ? " active" : "")}>
                        <AdminPanelSettings sx={{ fontSize: '20px', marginRight: '8px' }}/>
                        <span>Panel Admin</span>
                    </NavLink>
                </>
            )}
          </div>

          <div className="navbar-actions">
             <button onClick={openCart} className="cart-button" title="Ver carrito">
                <FaShoppingCart />
                {cartItems.length > 0 && (
                    <span className="cart-badge">{cartItems.length}</span>
                )}
            </button>
            
            {currentUser ? (
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
              <Link to="/login" className="navbar-button primary">
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;