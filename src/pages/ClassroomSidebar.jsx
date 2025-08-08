// src/pages/ClassroomSidebar.jsx (Código completo y actualizado)

import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaArrowLeft, FaQuestionCircle, FaCertificate } from 'react-icons/fa';

const ClassroomSidebar = ({ 
    course, 
    activeLesson, 
    completedLessons, 
    onLessonClick,
    // --- NUEVAS PROPS RECIBIDAS ---
    isCourseComplete,
    onGenerateCertificateClick
}) => {
  return (
    <aside className="classroom-sidebar">
        <div className="sidebar-header">
            <Link to="/mis-cursos" className="back-to-courses-link" title="Volver a Mis Cursos">
                <FaArrowLeft />
            </Link>
            <h4>Contenido del Curso</h4>
        </div>
        
        <div className="sidebar-content">
            {/* ... (el .map de los módulos y lecciones no cambia) ... */}
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
            
            {/* --- SECCIÓN AÑADIDA PARA EXAMEN Y CERTIFICADO --- */}
            {/* Solo se muestra si el curso está 100% completo */}
            {isCourseComplete && (
                <div className="final-steps-group">
                    <h5 className="module-title">Finalizar Curso</h5>
                    <ul className="lessons-list">
                        {course.has_exam && course.exam_url && (
                             <li>
                                {/* El examen es un link que abre en una nueva pestaña */}
                                <a href={course.exam_url} target="_blank" rel="noopener noreferrer" className="lesson-item final-step">
                                    <FaQuestionCircle />
                                    <span className="lesson-name">Rendir Examen Final</span>
                                </a>
                            </li>
                        )}
                        {course.has_certificate && (
                             <li>
                                {/* El certificado es un botón que abre el modal */}
                                <button onClick={onGenerateCertificateClick} className="lesson-item final-step">
                                    <FaCertificate />
                                    <span className="lesson-name">Generar Certificado</span>
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            )}
            {/* -------------------------------------------------------- */}
        </div>
    </aside>
  );
};

export default ClassroomSidebar;