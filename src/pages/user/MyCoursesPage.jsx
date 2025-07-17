// src/pages/user/MyCoursesPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getEnrolledCourses, getUserProgressForCourse } from '../../services/courseService';
import { FaPlayCircle, FaCrown } from 'react-icons/fa';
import { School } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- SUB-COMPONENTE: Tarjeta de Progreso del Curso ---
const MyCourseCard = ({ course, userId }) => {
    const [progress, setProgress] = useState(0);
    const [loadingProgress, setLoadingProgress] = useState(true);
    course.progress = progress;
    
    // LÓGICA DE IMAGEN A PRUEBA DE ERRORES
    const placeholderImage = 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
    const finalImageUrl = (course && typeof course.imageUrl === 'string' && course.imageUrl.trim() !== '') ? course.imageUrl : placeholderImage;

    useEffect(() => {
        const fetchProgress = async () => {
            if (!userId || !course.id) return;
            setLoadingProgress(true);
            const progressData = await getUserProgressForCourse(userId, course.id);
            setProgress(progressData); setLoadingProgress(false);
        };
        fetchProgress();
    }, [userId, course.id]);

    return (
        <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`my-course-card ${progress === 100 ? 'completed' : ''}`}>
            {progress === 100 && <div className="completed-badge"><FaCrown/> Completado</div>}
            <div className="my-course-card-image" style={{ backgroundImage: `url(${finalImageUrl})` }}/>
            <div className="my-course-card-content">
                <h3 className="my-course-card-title">{course.title}</h3>
                <p className="my-course-card-instructor">Por {course.instructor}</p>
                <div className={`progress-bar-container ${loadingProgress ? 'loading' : ''}`}>
                    {loadingProgress ? <div className="skeleton-progress-bar" /> : <div className="progress-bar-fill" style={{ width: `${progress}%` }}/>}
                </div>
                <span className="progress-label">{loadingProgress ? 'Calculando...' : `${progress}% completado`}</span>
            </div>
            <div className="my-course-card-footer">
                <Link to={`/classroom/${course.id}`} className="my-course-card-button"><FaPlayCircle/>{progress > 0 ? 'Continuar Curso' : 'Empezar Curso'}</Link>
            </div>
        </motion.div>
    );
};

// --- SUB-COMPONENTE: Esqueleto de Carga ---
const CourseCardSkeleton = () => (
    <div className="skeleton-course-card">
        <div className="skeleton skeleton-image" /> <div className="skeleton-content"><div className="skeleton skeleton-title" /> <div className="skeleton skeleton-instructor" /> <div className="skeleton skeleton-progress" /> <div className="skeleton skeleton-button" /></div>
    </div>
);

// --- COMPONENTE PRINCIPAL ---
const MyCoursesPage = () => {
    const { userData } = useAuth();
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (userData?.id) {
            const fetchCourses = async () => {
                setLoading(true); const courses = await getEnrolledCourses(userData.id);
                setEnrolledCourses(courses); setLoading(false);
            };
            fetchCourses();
        } else { setLoading(false); }
    }, [userData]);

    const filteredCourses = useMemo(() => {
        if (loading) return [];
        switch (filter) {
            case 'inProgress': return enrolledCourses.filter(c => c.progress > 0 && c.progress < 100);
            case 'completed': return enrolledCourses.filter(c => c.progress === 100);
            default: return enrolledCourses;
        }
    }, [filter, enrolledCourses, loading]);

    if (loading) return (
        <div className="my-courses-container">
            <div className="page-header-my-courses"><div className="skeleton skeleton-title" style={{ width: '400px', height: '40px' }} /></div>
            <div className="my-courses-grid">{[...Array(3)].map((_, i) => <CourseCardSkeleton key={i} />)}</div>
        </div>
    );

    return (
        <div className="my-courses-container">
            <div className="page-header-my-courses">
                <div><h1 className="dashboard-section-title">Mi Espacio de Aprendizaje</h1><p>Bienvenido, {userData?.name || 'estudiante'}. Tienes {enrolledCourses.length} cursos en tu biblioteca.</p></div>
                {enrolledCourses.length > 0 && (<div className="my-courses-filter-group"><button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>Todos</button><button onClick={() => setFilter('inProgress')} className={filter === 'inProgress' ? 'active' : ''}>En Progreso</button><button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Completados</button></div>)}
            </div>
            
            <AnimatePresence>
            {filteredCourses.length > 0 ? (
                <motion.div layout className="my-courses-grid">
                    {filteredCourses.map(course => <MyCourseCard key={course.id} course={course} userId={userData.id} />)}
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="empty-state-my-courses"><div className="empty-state-icon"><School /></div><h2>No tienes cursos que mostrar</h2><p>Parece que no hay cursos que coincidan con el filtro seleccionado. ¡Sigue aprendiendo!</p></motion.div>
            )}
            </AnimatePresence>
        </div>
    );
}

export default MyCoursesPage;