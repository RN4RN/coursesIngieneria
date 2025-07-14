import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../firebase';      // Cliente de autenticación de Firebase
import { supabase } from '../supabase';  // Cliente de la base de datos de Supabase

// 1. Crear el Contexto
const AuthContext = createContext();

// 2. Hook personalizado para facilitar el uso del contexto
export function useAuth() {
  return useContext(AuthContext);
}

// 3. Función auxiliar para sincronizar el usuario con Supabase
const syncUserWithSupabase = async (firebaseUser) => {
  if (!firebaseUser) return null;

  try {
    // Buscar al usuario en la tabla 'users' de Supabase por su 'firebase_uid'
    const { data: existingUser, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('firebase_uid', firebaseUser.uid)
      .single();

    // Si el usuario ya existe, lo retornamos.
    if (existingUser) {
      return existingUser;
    }

    // El error 'PGRST116' significa "No se encontró la fila", lo cual es esperado para un nuevo usuario.
    // Si es otro tipo de error, lo mostramos en consola.
    if (findError && findError.code !== 'PGRST116') {
      throw findError;
    }
    
    // Si el usuario no existe, lo creamos en Supabase.
    const newUser = {
      firebase_uid: firebaseUser.uid,
      email: firebaseUser.email,
      display_name: firebaseUser.displayName,
      photo_url: firebaseUser.photoURL,
      role: 'user', // Asignamos el rol por defecto
    };

    const { data: createdUser, error: createError } = await supabase
      .from('users')
      .insert(newUser)
      .select()
      .single();
    
    if (createError) {
      throw createError;
    }

    return createdUser;

  } catch (error) {
    console.error("Error al sincronizar usuario con Supabase:", error.message);
    return null; // En caso de error, no devolvemos datos de usuario.
  }
}

// 4. Componente Proveedor del Contexto
export function AuthProvider({ children }) {
  // `currentUser` guarda el objeto de usuario de Firebase (útil para su UID, email, etc.)
  const [currentUser, setCurrentUser] = useState(null);
  // `userData` guarda los datos completos del usuario desde NUESTRA base de datos Supabase (incluyendo el rol)
  const [userData, setUserData] = useState(null);
  // `loading` nos ayuda a no mostrar la app hasta que sepamos si el usuario está logueado o no.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged es el listener mágico de Firebase.
    // Se dispara cuando alguien inicia sesión, cierra sesión o al cargar la página.
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // Si hay un usuario de Firebase, llamamos a nuestra función para
        // obtener/crear su perfil en nuestra base de datos de Supabase.
        const supabaseUser = await syncUserWithSupabase(user);
        setUserData(supabaseUser);
      } else {
        // Si no hay usuario (logout), limpiamos los datos.
        setUserData(null);
      }
      setLoading(false); // La comprobación inicial ha terminado.
    });

    // Limpiamos el listener cuando el componente se desmonta para evitar fugas de memoria.
    return () => unsubscribe();
  }, []);

  // Función para cerrar sesión que ahora pasamos a través del contexto
  const signOut = async () => {
    try {
        await firebaseSignOut(auth);
        // El listener onAuthStateChanged se encargará de actualizar los estados a null
    } catch(error) {
        console.error("Error al cerrar sesión:", error)
    }
  }


  // Estos son los valores que cualquier componente de la app podrá consumir.
  const value = {
    currentUser,
    userData,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}