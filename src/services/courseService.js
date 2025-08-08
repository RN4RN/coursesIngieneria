import { supabase } from '../supabase';

// ===================================================================
// ===         FUNCIONES PARA INTERACTUAR CON LA TABLA 'courses'   ===
// ===================================================================
// (getAllCourses se mantiene como está)
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


// (getCourseById se mantiene como está)
export const getCourseById = async (courseId) => { 
  try {
      const { data, error } = await supabase
          .from('courses')
          .select(`*, users ( id, display_name, phone_number )`)
          .eq('id', courseId)
          .single();

      if (error) {
          if (error.code === 'PGRST116') {
              console.warn(`No se encontró el curso con ID ${courseId}`);
              return null;
          }
          if (error.message.includes('relation')) {
              console.error(`Error en getCourseById: Fallo en la relación con 'users'.`, error.message);
          }
          throw error;
      }
      return data;
  } catch (err) {
      console.error("Excepción en getCourseById:", err.message);
      return null;
  }
};


// ===================================================================
// ===    FUNCIONES PARA INTERACTUAR CON LA TABLA 'enrollments'    ===
// ===================================================================
// (getEnrolledCourses se mantiene como está)
export const getEnrolledCourses = async (userId) => {
    if (!userId) return [];

    try {
        const { data, error } = await supabase
            .from('enrollments')
            .select(`courses (*)`) 
            .eq('user_id', userId);

        if (error) throw error;
        
        if (!data) return [];
        
        return data.map(enrollment => enrollment.courses).filter(Boolean);

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
 * VERSIÓN ACTUALIZADA Y ROBUSTA.
 * @param {string} userId - El ID del usuario.
 * @param {string} courseId - El ID del curso.
 * @returns {Promise<number>} El porcentaje de progreso (0-100).
 */
export const getUserProgressForCourse = async (userId, courseId) => {
  try {
      // Este paso es crucial, porque si el curso no existe o no tiene módulos, evitamos el cálculo.
      const course = await getCourseById(courseId);
      if (!course?.modules) return 0;
      
      const totalLessons = course.modules.reduce((acc, module) => acc + (module.lessons?.length || 0), 0);
      if (totalLessons === 0) return 0;

      // --- ¡AQUÍ ESTÁ LA ACTUALIZACIÓN! ---
      const { data: progressData, error } = await supabase
          .from('user_progress')
          .select('completed_lessons')
          .eq('user_id', userId)
          .eq('course_id', courseId)
          // Se reemplaza .single() por una consulta más segura.
          // .limit(1) toma el primer resultado que encuentre.
          // .maybeSingle() no genera un error si no encuentra nada (devuelve null).
          .limit(1)
          .maybeSingle();

      // No tratamos la "no existencia de la fila" como un error. Simplemente significa
      // que el progreso es 0, lo cual es manejado más adelante.
      if (error && error.code !== 'PGRST116') throw error;

      const completedCount = progressData?.completed_lessons?.length || 0;
      
      // La fórmula del cálculo no cambia
      return Math.round((completedCount / totalLessons) * 100);

  } catch (err) {
      console.error(`Error calculando progreso para el curso ${courseId}:`, err.message);
      return 0; // Devolvemos 0 en caso de cualquier error
  }
};