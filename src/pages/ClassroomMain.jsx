import React from 'react';
import VideoPlayer from '../components/common/VideoPlayer'; // Asegúrate que la ruta sea correcta
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaBars, FaTimes, FaCheck } from 'react-icons/fa';

// Este es el componente que tu ClassroomPage está intentando importar
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
    
    return (
      <main className="classroom-main-content">
        <AnimatePresence mode="wait">
            <motion.div 
              key={activeLesson?.id || 'no-lesson'}
              className="video-background-wrapper"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              transition={{ duration: 0.3 }}
            >
              {activeLesson ? (
                  <VideoPlayer videoUrl={activeLesson.videoUrl} />
              ) : (
                  <div className="video-player-container">
                    <div className="video-placeholder-message">
                      <h2>Selecciona una lección del menú para comenzar</h2>
                    </div>
                  </div>
              )}
            </motion.div>
        </AnimatePresence>

        <div className="classroom-overlay-gradient"></div>

        <div className="classroom-controls-container">
            <div className="classroom-header">
                <button onClick={toggleSidebar} className="sidebar-toggle-button" aria-label="Toggle Sidebar">
                    {isSidebarVisible ? <FaTimes /> : <FaBars />}
                </button>
                <div className="course-title-header">
                    <span>Estas viendo el curso:</span>
                    <h3>{courseTitle}</h3>
                </div>
            </div>

            <motion.div 
                key={activeLesson?.title || 'footer'} 
                className="classroom-footer"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <h1 className="lesson-title">{activeLesson?.title || "Bienvenido al curso"}</h1>
                <div className="navigation-buttons">
                    <button onClick={() => navigateToLesson(-1)} disabled={activeLessonIndex === 0} className="nav-button prev"><FaArrowLeft/> Anterior</button>
                    <button onClick={goToNextAndComplete} disabled={activeLessonIndex >= totalLessons - 1} className={`nav-button next ${isLessonCompleted ? 'completed' : ''}`}>
                        {isLessonCompleted ? <><FaCheck/> Completada</> : 'Completar y Siguiente'}
                        <FaArrowRight/>
                    </button>
                </div>
            </motion.div>
        </div>
      </main>
    );
};

export default ClassroomMain;