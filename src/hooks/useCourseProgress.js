import { create } from 'zustand'; // ¡CORREGIDO! Usar importación nombrada con llaves.
import { persist } from 'zustand/middleware';

// 'persist' es un middleware que automáticamente guarda el estado en localStorage.
export const useCourseProgressStore = create(
    persist(
        (set, get) => ({
            progress: {}, // Estructura: { "courseId1": Set de URLs, "courseId2": Set de URLs }

            // Acción para marcar/desmarcar una lección como completada
            toggleLessonCompleted: (courseId, lessonUrl) => {
                set(state => {
                    // Copiamos el Set existente para no mutar el estado directamente
                    const courseProgress = new Set(state.progress[courseId] || []);
                    
                    if (courseProgress.has(lessonUrl)) {
                        courseProgress.delete(lessonUrl); // Si ya está, la quitamos (desmarcar)
                    } else {
                        courseProgress.add(lessonUrl); // Si no está, la añadimos (marcar)
                    }

                    // Devolvemos el nuevo objeto de estado
                    return {
                        progress: {
                            ...state.progress,
                            [courseId]: courseProgress
                        }
                    };
                });
            },
        }),
        {
            name: 'course-progress-storage', // Nombre de la clave en localStorage
            
            // zustand/persist no sabe cómo guardar un objeto `Set` en localStorage,
            // ya que localStorage solo guarda strings. Necesitamos decirle cómo convertirlo.
            storage: {
                // Función para tomar nuestro estado y convertirlo a string
                getItem: (name) => {
                    const str = localStorage.getItem(name);
                    if (!str) return null;

                    const { state } = JSON.parse(str);
                    // Re-hidratar: Convertir los arrays guardados de vuelta a Sets
                    for (const courseId in state.progress) {
                        state.progress[courseId] = new Set(state.progress[courseId]);
                    }
                    return { state };
                },
                // Función para tomar nuestro estado y guardarlo como string
                setItem: (name, newValue) => {
                    // Des-hidratar: Convertir los Sets a arrays para poder guardarlos como JSON
                    const stateToStore = { ...newValue.state };
                    for (const courseId in stateToStore.progress) {
                        stateToStore.progress[courseId] = Array.from(stateToStore.progress[courseId]);
                    }
                    localStorage.setItem(name, JSON.stringify({ state: stateToStore }));
                },
                // Función para eliminar del storage
                removeItem: (name) => localStorage.removeItem(name),
            },
        }
    )
);