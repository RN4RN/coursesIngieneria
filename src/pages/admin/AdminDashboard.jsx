// src/pages/admin/AdminDashboard.jsx
import React from 'react';
import { NavLink, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

// Iconos para la navegación
import { Dashboard as DashboardIcon, School, People } from '@mui/icons-material';

// Importa los componentes de las sub-páginas
import DashboardHomePage from './DashboardHomePage';
import ManageCourses from './ManageCourses';
import ManageUsers from './ManageUsers';

// --- SUB-COMPONENTE: Barra Lateral de Navegación ---
const DashboardSidebar = () => {
    // Definimos los enlaces del menú
    const navLinks = [
        { to: '/admin', text: 'Dashboard', icon: <DashboardIcon /> },
        { to: '/admin/courses', text: 'Gestionar Cursos', icon: <School /> },
        { to: '/admin/users', text: 'Gestionar Usuarios', icon: <People /> },
    ];
    
    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <span className="sidebar-title">PANEL DE CONTROL</span>
            </div>
            <nav className="sidebar-nav">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.to === '/admin'} // 'end' prop para que '/' no coincida con todo
                        className={({ isActive }) => 
                            `sidebar-nav-link ${isActive ? 'active' : ''}`
                        }
                    >
                        {link.icon}
                        <span>{link.text}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};


// --- COMPONENTE PRINCIPAL DEL DASHBOARD ---
const AdminDashboard = () => {
    const location = useLocation();

    return (
        <div className="admin-dashboard-layout">
            <DashboardSidebar />
            <main className="admin-main-content">
                {/* 'Outlet' renderizará el componente de la ruta hija que coincida */}
                {/* Las rutas se definirán en App.jsx, pero Outlet permite este layout */}
                 <Routes location={location} key={location.pathname}>
                    <Route index element={<DashboardHomePage />} />
                    <Route path="courses" element={<ManageCourses />} />
                    <Route path="users" element={<ManageUsers />} />
                    {/* Puedes añadir más rutas de admin aquí */}
                 </Routes>
                 <Outlet/>
            </main>
        </div>
    );
}

export default AdminDashboard;