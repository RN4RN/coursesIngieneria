// src/pages/ClassroomPage.jsx (Código completo con la corrección)

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getCourseById } from '../services/courseService';
import { supabase } from '../supabase';

import ClassroomSidebar from './ClassroomSidebar';
import ClassroomMain from './ClassroomMain';
import CertificateModal from '../components/common/CertificateModal';

import './ClassroomStyles.css';

const ClassroomPage = () => {
    const { courseId } = useParams();
    const { currentUser } = useAuth();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeLesson, setActiveLesson] = useState(null);
    const [completedLessons, setCompletedLessons] = useState(new Set());
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [isCertificateModalOpen, setCertificateModalOpen] = useState(false);

    const loadInitialData = useCallback(async () => {
        if (!currentUser || !courseId) { setLoading(false); return; }
        setLoading(true);
        try {
            const courseData = await getCourseById(courseId);
            setCourse(courseData);
            
            // --- LA CORRECCIÓN ESTÁ AQUÍ ---
            const { data: progressData } = await supabase
                .from('user_progress')
                .select('completed_lessons')
                .eq('user_id', currentUser.id)
                .eq('course_id', courseId)
                .limit(1).maybeSingle(); // Usamos maybeSingle() para más seguridad
            
            if (progressData?.completed_lessons) { 
                setCompletedLessons(new Set(progressData.completed_lessons)); 
            }

            if (courseData?.modules?.[0]?.lessons?.[0]) { 
                setActiveLesson(courseData.modules[0].lessons[0]); 
            }

        } catch(err) { console.error("Error al cargar datos del aula", err); } 
        finally { setLoading(false); }
    }, [currentUser, courseId]);

    useEffect(() => { loadInitialData(); }, [loadInitialData]);

    const markLessonAsComplete = useCallback(async (lesson) => {
        const lessonId = lesson.id || lesson.title;
        if (currentUser && !completedLessons.has(lessonId)) {
            const updatedLessons = Array.from(new Set([...completedLessons, lessonId]));
            setCompletedLessons(new Set(updatedLessons));
            
            await supabase
                .from('user_progress')
                .upsert(
                    { user_id: currentUser.id, course_id: courseId, completed_lessons: updatedLessons }, 
                    { onConflict: 'user_id, course_id' }
                );
        }
    }, [currentUser, courseId, completedLessons]);

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