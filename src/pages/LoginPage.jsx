// src/pages/LoginPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';

const LoginPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Si el usuario ya está logueado, lo redirigimos a la página de inicio.
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      // Abre una ventana emergente para el inicio de sesión con Google.
      await signInWithPopup(auth, googleProvider);
      // Cuando el login es exitoso, el onAuthStateChanged en AuthContext
      // se activará. El useEffect de arriba se encargará de la redirección.
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error.message);
      // Aquí podrías mostrar un mensaje de error al usuario.
    }
  };

  return (
    <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
      <div className="text-center p-8 bg-white shadow-xl rounded-lg max-w-sm w-full">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Bienvenido</h1>
        <p className="text-gray-600 mb-8">
          Inicia sesión para acceder a un mundo de aprendizaje.
        </p>
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center px-6 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FcGoogle className="w-6 h-6 mr-3" />
          <span className="font-semibold text-gray-700">Continuar con Google</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;