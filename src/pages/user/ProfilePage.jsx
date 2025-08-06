// src/pages/user/ProfilePage.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FaUserCircle, FaEnvelope, FaCalendarAlt, FaCrown } from 'react-icons/fa';

const ProfilePage = () => {
    // Usamos tanto currentUser (de Firebase) como userData (de Supabase)
    const { currentUser, userData, signOut } = useAuth();

    if (!currentUser || !userData) {
        return <div>Cargando datos del perfil...</div>;
    }
    
    // Formateamos la fecha de registro para que sea legible
    const registrationDate = new Date(userData.created_at).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>

            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                       <img 
                          src={currentUser.photoURL} 
                          alt="Avatar" 
                          className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg"
                        />
                    </div>

                    {/* Información del Usuario */}
                    <div className="flex-grow w-full text-center md:text-left">
                        <h2 className="text-2xl font-bold text-gray-800">{currentUser.displayName}</h2>
                        {userData.role === 'admin' && (
                            <span className="flex items-center justify-center md:justify-start mt-2 text-sm font-semibold text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full w-max mx-auto md:mx-0">
                                <FaCrown className="mr-2" />
                                Administrador
                            </span>
                        )}

                        <ul className="mt-6 space-y-4 text-gray-600">
                            <li className="flex items-center">
                                <FaEnvelope className="mr-4 text-gray-400"/>
                                <span>{currentUser.email}</span>
                            </li>
                            <li className="flex items-center">
                                <FaCalendarAlt className="mr-4 text-gray-400"/>
                                <span>Miembro desde: {registrationDate}</span>
                            </li>
                        </ul>
                        
                        <div className="mt-8 border-t pt-6">
                           <button 
                              onClick={signOut}
                              className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Cerrar Sesión
                           </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;