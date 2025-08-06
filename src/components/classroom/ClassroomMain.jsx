// src/components/classroom/ClassroomMain.jsx
import React from 'react';
import VideoPlayer from '../common/VideoPlayer'; // ¡Importamos nuestro reproductor corregido!
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
    isSidebarVisible
}) => {
    
    // Suponemos que la comprobación de si la lección está completa se hace en el componente padre
    const isLessonCompleted = false; // Este valor debería venir como prop

    return (
      // El contenedor principal es un flex-col que ocupa todo el espacio sobrante.
      <main className="flex-1 flex flex-col bg-black relative">
        <div className="absolute top-4 left-4 z-20">
            <button onClick={toggleSidebar} className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors">
                {isSidebarVisible ? <FaTimes /> : <FaBars />}
            </button>
        </div>

        {/* El contenedor del video ahora NO tiene una altura fija, permitiendo que VideoPlayer la dicte */}
        <div className="w-full bg-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLesson?.videoUrl || 'placeholder'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
                <VideoPlayer videoUrl={activeLesson?.videoUrl} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* La sección de controles ocupa el espacio restante */}
        <div className="flex-grow bg-white p-6 shadow-inner flex flex-col">
            <div className="flex-grow">
              <motion.h1 
                key={activeLesson?.title || 'welcome'} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-gray-800"
              >
                  {activeLesson?.title || "Bienvenido al curso"}
              </motion.h1>
              <p className="text-gray-500 mt-1">Del curso: <span className="font-semibold">{courseTitle}</span></p>
            </div>
            
            <div className="mt-4 pt-4 border-t flex justify-between items-center flex-shrink-0">
                <button 
                  onClick={() => navigateToLesson(-1)} 
                  disabled={activeLessonIndex === 0} 
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FaArrowLeft/> Anterior
                </button>
                <button 
                  onClick={goToNextAndComplete} 
                  disabled={activeLessonIndex >= totalLessons - 1} 
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                    Completar y Siguiente <FaArrowRight/>
                </button>
            </div>
        </div>
      </main>
    );
};

export default ClassroomMain;