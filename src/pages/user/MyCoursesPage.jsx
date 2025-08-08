// src/pages/user/MyCoursesPage.jsx (Código completo, robusto y mejorado)

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getEnrolledCourses, getUserProgressForCourse } from '../../services/courseService';
import { FaPlayCircle, FaCrown, FaSearch } from 'react-icons/fa';
import { School } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- SUB-COMPONENTE: Tarjeta de Progreso del Curso (Sin cambios lógicos) ---
const MyCourseCard = ({ course, userId }) => {
    const [progress, setProgress] = useState(0);
    const [loadingProgress, setLoadingProgress] = useState(true);
    // Asignar progreso para filtros
    // Importante: No mutar el prop directamente
    const courseWithProgress = useMemo(() => ({ ...course, progress }), [course, progress]);

    const placeholderImage = 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
    const finalImageUrl = (course && typeof course.imageUrl === 'string' && course.imageUrl.trim() !== '') ? course.imageUrl : placeholderImage;

    useEffect(() => {
        const fetchProgress = async () => {
            if (!userId || !course.id) return;
            setLoadingProgress(true);
            const progressData = await getUserProgressForCourse(userId, course.id);
            setProgress(progressData);
            setLoadingProgress(false);
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

// --- SUB-COMPONENTE: Esqueleto de Carga (Sin cambios) ---
const CourseCardSkeleton = () => (
    <div className="my-course-card skeleton">
        <div className="my-course-card-image skeleton-bg" />
        <div className="my-course-card-content">
            <div className="skeleton skeleton-title" style={{ width: '70%', height: '24px', marginBottom: '8px' }} />
            <div className="skeleton skeleton-text" style={{ width: '50%', height: '16px', marginBottom: '16px' }} />
            <div className="progress-bar-container loading">
                <div className="skeleton-progress-bar" />
            </div>
            <div className="skeleton skeleton-text" style={{ width: '40%', height: '14px', marginTop: '8px' }} />
        </div>
        <div className="my-course-card-footer">
            <div className="skeleton skeleton-button" style={{ width: '60%', height: '32px' }} />
        </div>
    </div>
)


// --- COMPONENTE PRINCIPAL ---
const MyCoursesPage = () => {
    const { userData } = useAuth();
    // CLAVE DE LA SOLUCIÓN: El estado se inicializa como un array vacío
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState(''); // <-- Nuevo estado para la búsqueda

    useEffect(() => {
        if (userData?.id) {
            const fetchCourses = async () => {
                setLoading(true);
                // La función del servicio AHORA SIEMPRE devuelve un array
                const courses = await getEnrolledCourses(userData.id);
                // Hacemos una comprobación de seguridad extra aquí
                setEnrolledCourses(Array.isArray(courses) ? courses : []);
                setLoading(false);
            };
            fetchCourses();
        } else {
            // Si no hay userData, nos aseguramos de no seguir cargando
            if (loading) setLoading(false);
        }
    }, [userData]);


    const filteredCourses = useMemo(() => {
        // SOLUCIÓN AL ERROR: Usamos un array vacío si `enrolledCourses` es nulo
        const coursesToFilter = enrolledCourses || [];

        // Primero, aplicamos el filtro de búsqueda por texto
        const searchedCourses = searchTerm
            ? coursesToFilter.filter(course =>
                course.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
            : coursesToFilter;
        
        // Luego, aplicamos el filtro de estado (En progreso, completado)
        switch (filter) {
            case 'inProgress': return searchedCourses.filter(c => (c.progress ?? 0) > 0 && c.progress < 100);
            case 'completed': return searchedCourses.filter(c => c.progress === 100);
            default: return searchedCourses;
        }
    }, [filter, searchTerm, enrolledCourses]);


    if (loading) {
        return (
            <div className="my-courses-container">
                <div className="page-header-my-courses"><div className="skeleton skeleton-title" style={{ width: '400px', height: '40px' }} /></div>
                <div className="my-courses-grid">{[...Array(3)].map((_, i) => <CourseCardSkeleton key={i} />)}</div>
            </div>
        );
    }

    return (
        <div className="my-courses-container">
            <header className="page-header-my-courses">
                <div>
                    <h1 className="dashboard-section-title">Mi Espacio de Aprendizaje</h1>
                    <p className="dashboard-section-subtitle">
                        Bienvenido de nuevo, {userData?.display_name || 'estudiante'}. 
                        Tienes {enrolledCourses.length} cursos en tu biblioteca.
                    </p>
                </div>
            </header>

            {/* --- NUEVA BARRA DE FILTROS Y BÚSQUEDA --- */}
            {enrolledCourses.length > 0 && (
                <div className="my-courses-controls">
                    <div className="search-bar-wrapper">
                       <FaSearch className="search-icon"/>
                       <input 
                           type="text"
                           placeholder="Buscar en mis cursos..."
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           className="search-input"
                       />
                    </div>
                    <div className="my-courses-filter-group">
                        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>Todos</button>
                        <button onClick={() => setFilter('inProgress')} className={filter === 'inProgress' ? 'active' : ''}>En Progreso</button>
                        <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Completados</button>
                    </div>
                </div>
            )}
            
            <AnimatePresence>
            {filteredCourses.length > 0 ? (
                <motion.div layout className="my-courses-grid">
                    {filteredCourses.map(course => <MyCourseCard key={course.id} course={course} userId={userData.id} />)}
                </motion.div>
            ) : (
                 // --- MENSAJE DE ESTADO VACÍO MEJORADO ---
                 <motion.div 
                     key="empty-state"
                     initial={{ opacity: 0, y: 30 }} 
                     animate={{ opacity: 1, y: 0 }} 
                     className="empty-state-my-courses"
                 >
                     <div className="empty-state-icon"><School /></div>
                     <h2>
                         {searchTerm ? 'No se encontraron resultados' : 'Aún no te has inscrito en ningún curso'}
                     </h2>
                     <p>
                         {searchTerm ? 'Prueba con otra palabra clave o limpia la búsqueda.' : 'Explora nuestro catálogo y encuentra tu próxima gran habilidad.'}
                     </p>
                     {!searchTerm && (
                         <Link to="/cursos" className="form-button primary mt-4">
                             Ver Cursos Disponibles
                         </Link>
                     )}
                 </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
}

export default MyCoursesPage;