// src/pages/ClassroomSidebar.jsx (Código completo y actualizado)

import React from 'react';
import { Link } from 'react-router-dom'; // <-- 1. IMPORTAMOS Link para la navegación
import { FaCheckCircle, FaArrowLeft } from 'react-icons/fa'; // <-- 2. IMPORTAMOS el ícono de la flecha

const ClassroomSidebar = ({ course, activeLesson, completedLessons, onLessonClick, isSidebarVisible }) => {
  return (
    <aside className="classroom-sidebar">
        
        {/* --- CABECERA MODIFICADA --- */}
        <div className="sidebar-header">
            <Link to="/mis-cursos" className="back-to-courses-link" title="Volver a Mis Cursos">
                <FaArrowLeft />
            </Link>
            <h4>Contenido del Curso</h4>
        </div>
        {/* --------------------------- */}
        
        <div className="sidebar-content">
            {course?.modules?.map((module, modIndex) => (
                <div key={modIndex} className="module-group">
                    <h5 className="module-title">{module.title}</h5>
                    <ul className="lessons-list">
                        {module.lessons.map((lesson, lesIndex) => {
                            const lessonId = lesson.id || lesson.title;
                            const isActive = activeLesson?.title === lesson.title;
                            const isCompleted = completedLessons.has(lessonId);

                            return (
                                <li key={lesIndex}>
                                    <button 
                                        onClick={() => onLessonClick(lesson)}
                                        className={`lesson-item ${isActive ? 'active' : ''}`}
                                    >
                                        <div className="lesson-status-icon">
                                            {isCompleted ? <FaCheckCircle className="completed" /> : <div className="lesson-status-incomplete" />}
                                        </div>
                                        <span className="lesson-name">{lesson.title}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </div>
    </aside>
  );
};

export default ClassroomSidebar;