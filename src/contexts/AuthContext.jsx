import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../firebase';
import { supabase } from '../supabase';

const AuthContext = createContext();

// Hook personalizado - Esta es la exportación que el error menciona
export function useAuth() {
  return useContext(AuthContext);
}

// Función auxiliar
const syncUserWithSupabase = async (firebaseUser) => {
    // ... la lógica interna está bien ...
    if (!firebaseUser) return null;
    try {
        const { data: existingUser, error: findError } = await supabase
            .from('users').select('*').eq('firebase_uid', firebaseUser.uid).single();
        if (existingUser) return existingUser;
        if (findError && findError.code !== 'PGRST116') throw findError;
        const newUser = {
            firebase_uid: firebaseUser.uid, email: firebaseUser.email,
            display_name: firebaseUser.displayName, photo_url: firebaseUser.photoURL,
            role: 'user',
        };
        const { data: createdUser, error: createError } = await supabase
            .from('users').insert(newUser).select().single();
        if (createError) throw createError;
        return createdUser;
    } catch (error) {
        console.error("Error al sincronizar usuario con Supabase:", error.message);
        return null;
    }
}

// Proveedor del Contexto - Esta es la otra exportación
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const supabaseUser = await syncUserWithSupabase(user);
        setUserData(supabaseUser);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
        await firebaseSignOut(auth);
    } catch(error) {
        console.error("Error al cerrar sesión:", error)
    }
  }

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