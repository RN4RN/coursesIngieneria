import { db } from '../firebase'; // Sube un nivel desde 'services' y busca 'firebase.js'
import { collection, getDocs } from 'firebase/firestore';

/**
 * Obtiene todos los usuarios de la colección 'users'.
 * @returns {Promise<Array>} Una promesa que se resuelve con un array de objetos de usuario.
 */
export const getAllUsers = async () => {
    try {
        const usersCollectionRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersCollectionRef);

        const usersList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return usersList;
    } catch (error) {
        console.error("Error al obtener los usuarios: ", error);
        throw new Error("No se pudo obtener la lista de usuarios desde la base de datos.");
    }
};