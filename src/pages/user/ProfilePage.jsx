// src/pages/user/ProfilePage.jsx (Código completo con nuevo diseño)

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaEnvelope, FaCalendarAlt, FaCrown, FaGraduationCap, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- SUB-COMPONENTE: Tarjeta de Acción ---
const ActionCard = ({ to, icon, title, description }) => (
    <Link to={to} className="profile-action-card">
        <div className="action-card-icon">{icon}</div>
        <div className="action-card-text">
            <h4>{title}</h4>
            <p>{description}</p>
        </div>
    </Link>
);

const ProfilePage = () => {
    // La lógica de datos se mantiene igual
    const { currentUser, userData, signOut } = useAuth();

    if (!currentUser || !userData) {
        return <div className="loading-screen"><p>Cargando datos del perfil...</p></div>;
    }
    
    const registrationDate = new Date(userData.created_at).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
    };

    return (
        <div className="profile-page-wrapper">
            <motion.div
                className="profile-container"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* --- SECCIÓN 1: BANNER DE PERFIL --- */}
                <motion.header className="profile-banner" variants={itemVariants}>
                    <div className="profile-avatar">
                        {currentUser.photoURL ? (
                            <img src={currentUser.photoURL} alt="Avatar de usuario" />
                        ) : (
                            <FaUser className="fallback-avatar-icon" />
                        )}
                    </div>
                    <div className="profile-banner-info">
                        <h1 className="profile-name">{currentUser.displayName}</h1>
                        <p className="profile-email">{currentUser.email}</p>
                        {userData.role === 'admin' && (
                            <span className="profile-admin-badge">
                                <FaCrown /> Administrador
                            </span>
                        )}
                    </div>
                </motion.header>

                {/* --- SECCIÓN 2: TARJETAS DE INFORMACIÓN Y ACCIONES --- */}
                <motion.div className="profile-grid" variants={itemVariants}>
                    {/* Columna de Información */}
                    <div className="profile-info-card">
                        <h3>Información de la Cuenta</h3>
                        <ul>
                            <li>
                                <FaEnvelope />
                                <div>
                                    <span>Email</span>
                                    <p>{currentUser.email}</p>
                                </div>
                            </li>
                            <li>
                                <FaCalendarAlt />
                                <div>
                                    <span>Miembro desde</span>
                                    <p>{registrationDate}</p>
                                </div>
                            </li>
                            {/* Puedes añadir más campos de 'userData' aquí si los tuvieras */}
                        </ul>
                    </div>

                    {/* Columna de Acciones Rápidas */}
                    <div className="profile-actions-container">
                        <h3>Accesos Directos</h3>
                        <ActionCard
                            to="/mis-cursos"
                            icon={<FaGraduationCap />}
                            title="Mis Cursos"
                            description="Continúa tu aprendizaje donde lo dejaste."
                        />
                        {/* Aquí puedes añadir más ActionCards, como "Mis Certificados", "Historial de Compras", etc. */}
                    </div>
                </motion.div>
                
                {/* --- SECCIÓN 3: CERRAR SESIÓN --- */}
                <motion.div className="profile-logout-section" variants={itemVariants}>
                    <button 
                        onClick={signOut}
                        className="profile-logout-button"
                    >
                        <FaSignOutAlt />
                        Cerrar Sesión
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default ProfilePage;