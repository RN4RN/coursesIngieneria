import { getAllCourses } from './courseService';
import { getAllUsers } from './userService';

/**
 * Obtiene las estadísticas agregadas para el dashboard principal.
 * @returns {Promise<Object>} Una promesa que se resuelve con un objeto de estadísticas.
 */
export const getDashboardStats = async () => {
    try {
        // Ejecutamos ambas promesas en paralelo para mayor eficiencia
        const [courses, users] = await Promise.all([
            getAllCourses(),
            getAllUsers()
        ]);
        
        // Aquí podrías añadir más lógica en el futuro (ej. cálculo de ventas)
        return {
            totalCourses: courses.length,
            totalUsers: users.length,
            // Ejemplo de dato futuro
            monthlySales: 12500, // En un caso real, esto vendría de otra consulta
        };
    } catch (error) {
        console.error("Error al obtener las estadísticas del dashboard: ", error);
        throw new Error("No se pudieron cargar las estadísticas.");
    }
};