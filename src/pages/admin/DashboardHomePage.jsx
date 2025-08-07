import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getDashboardStats } from '../../services/adminService'; // ¡Importamos nuestro servicio!
import { School, People, AddCircleOutline, Analytics, Loop } from '@mui/icons-material';

// --- SUB-COMPONENTE: Tarjeta de Estadística ---
const StatCard = ({ icon, title, value, linkTo, loading }) => (
    <div className={`stat-card ${loading ? 'loading' : ''}`}>
        {loading ? (
            <div className="skeleton skeleton-stat-card"></div>
        ) : (
            <>
                <div className="stat-card-icon">{icon}</div>
                <div className="stat-card-info">
                    <span className="stat-card-title">{title}</span>
                    <span className="stat-card-value">{value}</span>
                </div>
                <Link to={linkTo} className="stat-card-link">→</Link>
            </>
        )}
    </div>
);

const DashboardHomePage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div>
      <motion.h1 className="dashboard-section-title" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        Resumen General
      </motion.h1>

      <div className="stats-grid">
          <StatCard 
              icon={<School />} 
              title="Total de Cursos" 
              value={stats?.totalCourses}
              linkTo="/admin/courses"
              loading={loading}
          />
          <StatCard 
              icon={<People />} 
              title="Usuarios Registrados" 
              value={stats?.totalUsers}
              linkTo="/admin/users"
              loading={loading}
          />
          <StatCard 
              icon={<Analytics />} 
              title="Ventas (Último Mes)" 
              value={`$ ${stats?.monthlySales.toLocaleString('es-ES') || '...'}`}
              linkTo="/admin/analytics"
              loading={loading}
          />
      </div>

       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="dashboard-section-title mt-12">Acciones Rápidas</h2>
          <div className="quick-actions-grid">
            <Link to="/admin/courses/new" className="quick-action-button"><AddCircleOutline />Añadir Nuevo Curso</Link>
            <Link to="/admin/users/new" className="quick-action-button"><AddCircleOutline />Añadir Nuevo Usuario</Link>
          </div>
       </motion.div>
    </div>
  );
};

export default DashboardHomePage;