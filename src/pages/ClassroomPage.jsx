import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Ya importas useAuth
import { getCourseById } from '../services/courseService';
import { supabase } from '../supabase';

import ClassroomSidebar from './ClassroomSidebar';
import ClassroomMain from './ClassroomMain';
import CertificateModal from '../components/common/CertificateModal';

import './ClassroomStyles.css';

const ClassroomPage = () => {
    const { courseId } = useParams();
    const { userData } = useAuth(); // <-- 1. CAMBIO: Usamos userData en lugar de currentUser
    
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeLesson, setActiveLesson] = useState(null);
    const [completedLessons, setCompletedLessons] = useState(new Set());
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [isCertificateModalOpen, setCertificateModalOpen] = useState(false);

    // --- LÓGICA DE CARGA DE DATOS ACTUALIZADA CON GUARDIAS DE SEGURIDAD ---
    const loadInitialData = useCallback(async () => {
        // La guardia principal: no hacer nada hasta que userData y courseId existan.
        if (!userData || !courseId) {
            // Si AuthProvider todavía está cargando userData, mantenemos la pantalla de carga.
            if (!userData) setLoading(true); 
            else setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const courseData = await getCourseById(courseId);
            setCourse(courseData);
            
            // La consulta de progreso ahora usa 'userData.id', que está garantizado que existe
            const { data: progressData } = await supabase
                .from('user_progress')
                .select('completed_lessons')
                .eq('user_id', userData.id) // <-- Usamos userData.id
                .eq('course_id', courseId)
                .limit(1).maybeSingle();
            
            if (progressData?.completed_lessons) { 
                setCompletedLessons(new Set(progressData.completed_lessons)); 
            }

            if (courseData?.modules?.[0]?.lessons?.[0]) { 
                setActiveLesson(courseData.modules[0].lessons[0]); 
            }

        } catch(err) { console.error("Error al cargar datos del aula", err); } 
        finally { setLoading(false); }
    }, [userData, courseId]); // Se re-ejecutará cuando userData esté listo

    useEffect(() => { loadInitialData(); }, [loadInitialData]);


    // --- LÓGICA DE MARCAR LECCIÓN ACTUALIZADA ---
    const markLessonAsComplete = useCallback(async (lesson) => {
        // Guardia: Si no hay userData, no podemos continuar
        if (!userData) return; 

        const lessonId = lesson.id || lesson.title;
        if (!completedLessons.has(lessonId)) {
            const updatedLessons = Array.from(new Set([...completedLessons, lessonId]));
            setCompletedLessons(new Set(updatedLessons));
            
            await supabase
                .from('user_progress')
                .upsert(
                    { user_id: userData.id, course_id: courseId, completed_lessons: updatedLessons }, // <-- Usamos userData.id
                    { onConflict: 'user_id, course_id' }
                );
        }
    }, [userData, courseId, completedLessons]);

    // El resto de tu código lógico se mantiene exactamente igual
    const allLessons = useMemo(() => course?.modules?.flatMap(m => m.lessons) ?? [], [course]);
    const activeLessonIndex = useMemo(() => allLessons.findIndex(l => l.title === activeLesson?.title), [allLessons, activeLesson]);

    const navigateToLesson = (direction) => {
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

    const isCourseComplete = useMemo(() => {
        if (!course || allLessons.length === 0) return false;
        return allLessons.every(lesson => completedLessons.has(lesson.id || lesson.title));
    }, [allLessons, completedLessons, course]);


    if (loading) return <div className="classroom-loading-fullscreen">Cargando Aula...</div>;

    // Condición mejorada por si la carga falla pero el estado de carga es falso
    if (!course) return <div className="classroom-loading-fullscreen">No se pudo cargar el curso.</div>;

    return (
        <>
            <div className={`classroom-layout ${isSidebarVisible ? 'sidebar-visible' : ''}`}>
                <ClassroomSidebar
                    course={course}
                    activeLesson={activeLesson}
                    completedLessons={completedLessons}
                    onLessonClick={setActiveLesson}
                    isCourseComplete={isCourseComplete}
                    onGenerateCertificateClick={() => setCertificateModalOpen(true)}
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
            
            <CertificateModal 
                isOpen={isCertificateModalOpen}
                onClose={() => setCertificateModalOpen(false)}
                templateUrl={course?.certificate_template_url}
                courseTitle={course?.title}
            />
        </>
    );
};

export default ClassroomPage;