// src/pages/ClassroomSidebar.jsx
import React from 'react';
import { FaCheckCircle, FaLock } from 'react-icons/fa';

const ClassroomSidebar = ({ course, activeLesson, completedLessons, onLessonClick, isSidebarVisible }) => {
  return (
    <aside className="classroom-sidebar">
        <div className="sidebar-header">
            <h4>Contenido del Curso</h4>
        </div>
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
                                            {isCompleted ? <FaCheckCircle className="completed" /> : <div className="incomplete-circle"/>}
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