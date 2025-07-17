// src/pages/ClassroomPage.jsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getCourseById } from '../services/courseService';
import { supabase } from '../supabase';

import ClassroomSidebar from './ClassroomSidebar'; // Componente de la barra lateral
import ClassroomMain from './ClassroomMain';     // Componente del video

import './ClassroomStyles.css'; // ¡Importaremos un CSS específico para el aula!

const ClassroomPage = () => {
    const { courseId } = useParams();
    const { currentUser } = useAuth();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeLesson, setActiveLesson] = useState(null);
    const [completedLessons, setCompletedLessons] = useState(new Set());
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    // Lógica para cargar datos (mejorada)
    const loadInitialData = useCallback(async () => {
        if (!currentUser || !courseId) { setLoading(false); return; }
        setLoading(true);
        try {
            const courseData = await getCourseById(courseId);
            setCourse(courseData);
            
            const { data: progressData } = await supabase.from('user_progress').select('completed_lessons').eq('user_id', currentUser.id).eq('course_id', courseId).single();
            if (progressData?.completed_lessons) { setCompletedLessons(new Set(progressData.completed_lessons)); }

            if (courseData?.modules?.[0]?.lessons?.[0]) { setActiveLesson(courseData.modules[0].lessons[0]); }

        } catch(err) { console.error("Error al cargar datos del aula", err); } 
        finally { setLoading(false); }
    }, [currentUser, courseId]);

    useEffect(() => { loadInitialData(); }, [loadInitialData]);

    // Lógica para marcar lección como completada
    const markLessonAsComplete = useCallback(async (lesson) => {
        const lessonId = lesson.id || lesson.title; // Usar un ID único es mejor
        if (currentUser && !completedLessons.has(lessonId)) {
            const updatedLessons = Array.from(new Set([...completedLessons, lessonId]));
            setCompletedLessons(new Set(updatedLessons)); // Actualización optimista de la UI
            
            await supabase.from('user_progress').upsert({ user_id: currentUser.id, course_id: courseId, completed_lessons: updatedLessons }, { onConflict: 'user_id, course_id' });
        }
    }, [currentUser, courseId, completedLessons]);

    // Navegación entre lecciones
    const allLessons = useMemo(() => course?.modules?.flatMap(m => m.lessons) ?? [], [course]);
    const activeLessonIndex = useMemo(() => allLessons.findIndex(l => l.title === activeLesson?.title), [allLessons, activeLesson]);

    const navigateToLesson = (direction) => { // direction es -1 (anterior) o 1 (siguiente)
        const newIndex = activeLessonIndex + direction;
        if (newIndex >= 0 && newIndex < allLessons.length) {
            setActiveLesson(allLessons[newIndex]);
        }
    };
    
    const goToNextAndComplete = () => {
        if (activeLesson) markLessonAsComplete(activeLesson);
        navigateToLesson(1);
    };

    const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);

    // No mostraremos nada hasta que la carga inicial termine
    if (loading) return <div className="classroom-loading-fullscreen">Cargando Aula...</div>;

    return (
        // ¡ESTE LAYOUT ES LA CLAVE DE LA SOLUCIÓN!
        <div className={`classroom-layout ${isSidebarVisible ? 'sidebar-visible' : ''}`}>
            <ClassroomSidebar
                course={course}
                activeLesson={activeLesson}
                completedLessons={completedLessons}
                onLessonClick={setActiveLesson}
                isSidebarVisible={isSidebarVisible}
            />
            <ClassroomMain 
                activeLesson={activeLesson}
                courseTitle={course?.title}
                navigateToLesson={navigateToLesson}
                goToNextAndComplete={goToNextAndComplete}
                activeLessonIndex={activeLessonIndex}
                totalLessons={allLessons.length}
                toggleSidebar={toggleSidebar}
                isSidebarVisible={isSidebarVisible}
                isLessonCompleted={completedLessons.has(activeLesson?.id || activeLesson?.title)}
            />
        </div>
    );
};

export default ClassroomPage;