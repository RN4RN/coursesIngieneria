// src/pages/LoginPage.jsx (Código completo con el nuevo diseño)

import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth'; 
import { auth, googleProvider, facebookProvider, githubProvider } from '../firebase'; 
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// Nuevos íconos para el diseño
import { FaUser, FaLock, FaGoogle, FaFacebookF, FaGithub } from 'react-icons/fa';

const LoginPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState('');
    
    // --- LÓGICA PARA EL NUEVO FORMULARIO (VISUAL) ---
    // La funcionalidad real de email/contraseña no está implementada aún.
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailSignIn = (e) => {
        e.preventDefault();
        toast.error('El inicio de sesión con email y contraseña aún no está implementado. Por favor, usa una de las opciones sociales.');
    }
    // --------------------------------------------------

    const handleSocialSignIn = async (provider, providerName) => {
        setIsLoading(providerName);
        try {
            await signInWithPopup(auth, provider);
            toast.success('¡Bienvenido/a de nuevo!');
            navigate('/');
        } catch (error) {
            // Manejo de errores (sin cambios)
            if (error.code === 'auth/account-exists-with-different-credential') {
                toast.error('Ya existe una cuenta con este email. Intenta con otro proveedor.');
            } else if (error.code !== 'auth/popup-closed-by-user') {
                toast.error('Hubo un problema al iniciar sesión.');
            }
        } finally {
            setIsLoading('');
        }
    };
    
    return (
      <div className="relative login-v2-page-wrapper">
        {/* Capa oscura */}
        <div className="absolute inset-0 bg-black/70 z-0"></div>

        {/* Contenedor principal */}
        <motion.div 
          className="login-v2-container relative z-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* --- LADO IZQUIERDO: FORMULARIO DE LOGIN --- */}
          <div className="login-v2-form-panel">
            <div className="login-v2-header">
              <div className="login-v2-logo">CursosOnline</div>
              <h2>Iniciar Sesión</h2>
              <p>Accede a tu cuenta para continuar</p>
            </div>

            <form onSubmit={handleEmailSignIn} className="login-v2-form">
              <div className="login-v2-input-group">
                <FaUser className="input-icon" />
                <input 
                  type="email" 
                  placeholder="Email o Nombre de Usuario" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="login-v2-input-group">
                <FaLock className="input-icon" />
                <input 
                  type="password" 
                  placeholder="Contraseña" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>

              <div className="login-v2-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  Recuérdame
                </label>
                <a href="#">¿Olvidaste tu contraseña?</a>
              </div>
              
              <button type="submit" className="login-v2-main-btn" disabled={!!isLoading}>
                {isLoading ? 'Cargando...' : 'INGRESAR'}
              </button>
            </form>

            <div className="login-v2-divider">
              <span>O continúa con</span>
            </div>

            <div className="login-v2-social-buttons">
              <button onClick={() => handleSocialSignIn(googleProvider, 'google')} className="social-icon-btn google">
                <FaGoogle />
              </button>
              <button onClick={() => handleSocialSignIn(facebookProvider, 'facebook')} className="social-icon-btn facebook">
                <FaFacebookF />
              </button>
              <button onClick={() => handleSocialSignIn(githubProvider, 'github')} className="social-icon-btn github">
                <FaGithub />
              </button>
            </div>

            <p className="login-v2-signup-link">
              ¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link>
            </p>
          </div>

          {/* --- LADO DERECHO: BIENVENIDA Y VISUAL --- */}
          <div className="login-v2-welcome-panel">
            <div className="welcome-content">
              <h1>Bienvenido.</h1>
              <p>Desbloquea tu potencial. Aprende nuevas habilidades con nuestros cursos de alta calidad, diseñados por expertos de la industria.</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
};

export default LoginPage;