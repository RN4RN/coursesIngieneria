// src/pages/ClassroomMain.jsx (Código completo, actualizado y manteniendo tu estructura original)

import React from 'react';
import VideoPlayer from '../components/common/VideoPlayer';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaBars, FaTimes, FaCheck } from 'react-icons/fa';

const ClassroomMain = ({ 
    activeLesson, 
    courseTitle, 
    navigateToLesson, 
    goToNextAndComplete, 
    activeLessonIndex, 
    totalLessons, 
    toggleSidebar, 
    isSidebarVisible, 
    isLessonCompleted 
}) => {
    
    // Calcula si es la primera o última lección para deshabilitar los botones
    const isFirstLesson = activeLessonIndex === 0;
    const isLastLesson = activeLessonIndex === totalLessons - 1;

    return (
      // El contenedor principal ahora usa Flexbox para organizar todo verticalmente
      <main className="classroom-main-content">
        
        {/* --- CABECERA SUPERIOR --- */}
        {/* Sigue siendo parte del layout principal, como en tu código original */}
        <div className="classroom-header">
            <button onClick={toggleSidebar} className="sidebar-toggle-button" aria-label="Toggle Sidebar">
                {isSidebarVisible ? <FaTimes /> : <FaBars />}
            </button>
            <div className="course-title-header">
                <span>Estas viendo el curso:</span>
                <h3>{courseTitle}</h3>
            </div>
        </div>

        {/* --- CONTENIDO CENTRAL (VIDEO) --- */}
        {/* Este contenedor ocupará todo el espacio sobrante */}
        <div className="video-player-wrapper">
            <AnimatePresence mode="wait">
                <motion.div 
                  key={activeLesson?.id || activeLesson?.title || 'no-lesson'}
                  className="video-player-motion-container" // Usamos una nueva clase para darle el 100% de tamaño
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  transition={{ duration: 0.3 }}
                >
                  {activeLesson && activeLesson.videoUrl ? (
                      <VideoPlayer videoUrl={activeLesson.videoUrl} />
                  ) : (
                      <div className="video-placeholder-message">
                        <h2>{activeLesson ? 'No hay video para esta lección' : 'Selecciona una lección del menú para comenzar'}</h2>
                      </div>
                  )}
                </motion.div>
            </AnimatePresence>
        </div>
        
        {/* --- PIE DE PÁGINA CON NAVEGACIÓN --- */}
        {/* El footer ahora es una sección separada y siempre visible abajo */}
        <motion.div 
            key={activeLesson?.title || 'footer'} 
            className="classroom-footer"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
        >
            <h1 className="lesson-title">{activeLesson?.title || "Bienvenido al curso"}</h1>
            <div className="navigation-buttons">
                <button onClick={() => navigateToLesson(-1)} disabled={isFirstLesson} className="nav-button prev">
                    <FaArrowLeft/> 
                    Anterior
                </button>
                <button onClick={goToNextAndComplete} disabled={isLastLesson && isLessonCompleted} className={`nav-button next ${isLessonCompleted ? 'completed' : ''}`}>
                    {isLessonCompleted ? <><FaCheck/> Completada</> : 'Completar y Siguiente'}
                    {!isLastLesson && <FaArrowRight/>}
                </button>
            </div>
        </motion.div>
      </main>
    );
};

export default ClassroomMain;