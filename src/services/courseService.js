// src/services/courseService.js
import { supabase } from '../supabase';

// ===================================================================
// ===         FUNCIONES PARA INTERACTUAR CON LA TABLA 'courses'   ===
// ===================================================================

/**
 * Obtiene todos los cursos disponibles en la plataforma.
 * @returns {Promise<Array>} Un array con todos los objetos de curso.
 */
export const getAllCourses = async () => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];

  } catch (err) {
    console.error("Error en getAllCourses:", err.message);
    return [];
  }
};


/**
 * Obtiene un único curso específico por su ID.
 * @param {string} courseId - El ID (UUID) del curso a buscar.
 * @returns {Promise<Object|null>} El objeto del curso o null si no se encuentra.
 */
export const getCourseById = async (courseId) => {
    try {
        const { data, error } = await supabase
            .from('courses')
            .select('*') // Podrías especificar columnas si quisieras, como '*, modules(lessons(*))'
            .eq('id', courseId)
            .single();

        if (error) {
            // No consideramos un error no encontrar una fila, solo lo notificamos si es algo más grave.
            if (error.code !== 'PGRST116') { 
                 console.error(`Error en getCourseById para el ID ${courseId}:`, error.message);
            }
            return null;
        }

        return data;

    } catch (err) {
        console.error("Excepción en getCourseById:", err.message);
        return null;
    }
}


// ===================================================================
// ===    FUNCIONES PARA INTERACTUAR CON LA TABLA 'enrollments'    ===
// ===================================================================

/**
 * Obtiene los cursos en los que un usuario específico está inscrito.
 * @param {string} userId - El ID (UUID de Supabase) del usuario.
 * @returns {Promise<Array>} Un array de objetos de curso.
 */
export const getEnrolledCourses = async (userId) => {
    if (!userId) return [];

    try {
        // La sintaxis 'courses(*)' realiza un JOIN automáticamente
        const { data, error } = await supabase
            .from('enrollments')
            .select(`courses (*)`) 
            .eq('user_id', userId);

        if (error) throw error;
        
        // Extraemos solo el objeto 'courses' de cada resultado
        return data?.map(enrollment => enrollment.courses).filter(Boolean) || [];

    } catch (err) {
        console.error("Error en getEnrolledCourses:", err.message);
        return [];
    }
}


// =====================================================================
// === FUNCIONES PARA INTERACTUAR CON LA TABLA 'user_progress'       ===
// =====================================================================

/**
 * Calcula el progreso de un usuario para un curso específico.
 * @param {string} userId - El ID del usuario.
 * @param {string} courseId - El ID del curso.
 * @returns {Promise<number>} El porcentaje de progreso (0-100).
 */
export const getUserProgressForCourse = async (userId, courseId) => {
    try {
        // Paso 1: Obtener el total de lecciones del curso. Usamos la función que ya tenemos.
        const course = await getCourseById(courseId);
        if (!course?.modules) return 0;
        
        const totalLessons = course.modules.reduce((acc, module) => acc + (module.lessons?.length || 0), 0);
        if (totalLessons === 0) return 0;

        // Paso 2: Obtener las lecciones completadas por el usuario.
        const { data: progressData, error } = await supabase
            .from('user_progress')
            .select('completed_lessons')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // Lanzar errores reales

        const completedCount = progressData?.completed_lessons?.length || 0;
        
        // Paso 3: Calcular y redondear el porcentaje.
        return Math.round((completedCount / totalLessons) * 100);

    } catch (err) {
        console.error(`Error calculando progreso para el curso ${courseId}:`, err.message);
        return 0;
    }
};