// Contiene la barra de progreso y la lista de lecciones
import React from 'react';
import { motion } from 'framer-motion';
import { FaBook, FaCheckCircle, FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ClassroomSidebar = ({ course, flatLessons, activeLesson, handleLessonClick, completedLessons, progressPercentage, isSidebarVisible }) => {
    return (
      <motion.aside 
        className="w-full lg:w-[400px] bg-white shadow-lg flex flex-col flex-shrink-0"
        initial={{ x: '-100%' }}
        animate={{ x: isSidebarVisible ? '0%' : '-100%' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold flex items-center"><FaBook className="mr-3 text-blue-500"/> Contenido</h2>
          <Link to="/mis-cursos" title="Volver a Mis Cursos" className="text-gray-500 hover:text-gray-800"><FaHome /></Link>
        </div>
        <div className="p-4 border-b">
          <p className="text-sm font-semibold text-gray-600 mb-2">Tu Progreso: <span className="text-black">{course.title}</span></p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }} />
          </div>
          <p className="text-xs text-right text-gray-500 mt-1">{Math.round(progressPercentage)}% completado</p>
        </div>
        <div className="overflow-y-auto flex-grow p-2">
          {course.modules?.map((module, moduleIndex) => (
            <div key={moduleIndex} className="mb-4">
              <h3 className="font-bold p-3 bg-gray-100 rounded-md text-gray-800 text-sm uppercase tracking-wider">{module.title}</h3>
              <ul className="mt-1 space-y-1">
                {module.lessons?.map((lesson) => {
                  const isCompleted = completedLessons.has(lesson.videoUrl);
                  const isActive = lesson.videoUrl === activeLesson?.videoUrl;
                  return (
                    <li key={lesson.videoUrl}>
                      <button onClick={() => handleLessonClick(lesson)} className={`w-full text-left p-3 flex items-center gap-4 transition-colors duration-200 rounded-md text-sm ${isActive ? 'bg-blue-100 text-blue-800 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}>
                        {isCompleted ? <FaCheckCircle className="text-green-500 text-lg flex-shrink-0"/> : <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex-shrink-0"></div>}
                        <span className="flex-grow">{lesson.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </motion.aside>
    );
};
export default ClassroomSidebar;