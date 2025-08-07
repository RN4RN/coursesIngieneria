import React from 'react';
import { NavLink, Routes, Route, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- NUEVAS IMPORTACIONES REQUERIDAS ---
import { Dashboard as DashboardIcon, School, People, PersonAdd } from '@mui/icons-material'; // <-- Se añade el ícono PersonAdd
import EnrollUserPage from './EnrollUserPage'; // <-- Se importa la nueva página que creamos
// ------------------------------------------

// Importa los componentes de las sub-páginas que ya tenías
import DashboardHomePage from './DashboardHomePage';
import ManageCourses from './ManageCourses';
import ManageUsers from './ManageUsers';

// --- SUB-COMPONENTE: Barra Lateral de Navegación MODIFICADA ---
const DashboardSidebar = () => {
    // Definimos los enlaces del menú
    const navLinks = [
        { to: '/admin', text: 'Dashboard', icon: <DashboardIcon /> },
        { to: '/admin/courses', text: 'Gestionar Cursos', icon: <School /> },
        { to: '/admin/users', text: 'Gestionar Usuarios', icon: <People /> },
        // --- AQUÍ AÑADIMOS EL NUEVO ENLACE VISIBLE ---
        { to: '/admin/enroll', text: 'Inscribir Usuario', icon: <PersonAdd /> }, // <-- ESTE ES EL ENLACE QUE FALTABA
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


// --- COMPONENTE PRINCIPAL DEL DASHBOARD MODIFICADO ---
const AdminDashboard = () => {
    return (
        <div className="admin-dashboard-layout">
            <DashboardSidebar />
            <main className="admin-main-content">
                 <Routes>
                    <Route index element={<DashboardHomePage />} />
                    <Route path="courses" element={<ManageCourses />} />
                    <Route path="users" element={<ManageUsers />} />
                    {/* --- AQUÍ AÑADIMOS LA RUTA LÓGICA --- */}
                    <Route path="enroll" element={<EnrollUserPage />} /> {/* <-- ESTA ES LA RUTA LÓGICA QUE FALTABA */}
                 </Routes>
                 <Outlet/>
            </main>
        </div>
    );
}

export default AdminDashboard;