import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { FaGraduationCap, FaCertificate, FaInfinity, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Componente para las características destacadas
const Feature = ({ icon, title, description }) => (
    <motion.li 
        className="flex items-start text-gray-200" 
        variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
    >
        <div className="flex-shrink-0 bg-white bg-opacity-10 p-3 rounded-full mr-4 mt-1">
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-white">{title}</h4>
            <p className="text-gray-300 text-sm">{description}</p>
        </div>
    </motion.li>
);

// Componente para la caja de información importante
const InfoBox = ({ children }) => (
    <div className="mt-8 p-4 bg-sky-50 border-l-4 border-sky-400 text-left rounded-r-lg">
        <div className="flex">
            <div className="flex-shrink-0">
                <FaExclamationTriangle className="h-5 w-5 text-sky-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
                {children}
            </div>
        </div>
    </div>
);

const LoginPage = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    useEffect(() => {
        if (currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Error al iniciar sesión con Google:", error.message);
        }
    };

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.2, // Aumenta el retraso para un efecto más notable
            },
        },
    };

    const formVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            transition: { 
                duration: 0.5, 
                ease: 'easeOut' 
            } 
        },
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                
                {/* Columna Izquierda: Visual y Beneficios */}
                <motion.div 
                    className="p-12 text-white flex-col justify-center login-visual-column hidden md:flex"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }}>
                        <FaGraduationCap className="text-5xl text-white mb-6" />
                        <h2 className="text-4xl font-black mb-4 leading-tight tracking-tight">
                            Tu Futuro Profesional Comienza Aquí.
                        </h2>
                        <p className="text-gray-200 mb-10 max-w-md">
                            No solo mires videos, domina habilidades. Cada curso está diseñado para llevarte de cero a experto con proyectos del mundo real.
                        </p>
                    </motion.div>
                    
                    <ul className="space-y-6">
                        <Feature icon={<FaCertificate className="text-yellow-300 text-xl" />} title="Certifica Tu Conocimiento" description="Valida tus nuevas habilidades con certificados que puedes añadir a tu CV y LinkedIn." />
                        <Feature icon={<FaInfinity className="text-purple-300 text-xl" />} title="Aprende Sin Presión, Para Siempre" description="Tu acceso a los cursos nunca expira. Repasa el contenido cuando lo necesites." />
                        <Feature icon={<FaGraduationCap className="text-green-300 text-xl" />} title="De Profesionales Para Profesionales" description="Aprende directamente de expertos que trabajan en la industria y conocen el mercado." />
                    </ul>
                </motion.div>
                
                {/* Columna Derecha: Formulario de Login */}
                <div className="p-12 flex flex-col items-center justify-center">
                    <motion.div 
                        className="max-w-md w-full text-center" 
                        variants={formVariants} 
                        initial="hidden" 
                        animate="visible"
                    >
                        <div className="md:hidden mb-8">
                             <FaGraduationCap className="text-5xl text-blue-600 mx-auto" />
                        </div>
                        
                        <h1 className="text-3xl font-bold mb-2 text-gray-900">Crea tu Cuenta de Acceso</h1>
                        <p className="text-gray-600 mb-10">Usa tu cuenta de Google para un acceso rápido y seguro.</p>
                        
                        <button
                            onClick={handleGoogleSignIn}
                            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-lg shadow-sm font-semibold text-gray-800 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 google-signin-button"
                        >
                            <FcGoogle className="text-2xl" />
                            <span className="text-base">Continuar con Google</span>
                        </button>
                        
                        <InfoBox>
                            <h3 className="text-sm font-bold text-sky-800">¿Cómo funciona el acceso?</h3>
                            <div className="mt-2 text-sm text-sky-700 space-y-2">
                                <p>➡️ <strong>Si ya tienes una cuenta:</strong> Tus cursos se habilitarán automáticamente aquí.</p>
                                <p>➡️ <strong>Si eres nuevo:</strong> Al comprar por WhatsApp, usaremos esta cuenta para darte acceso a tus cursos.</p>
                            </div>
                        </InfoBox>

                        <div className="mt-8 text-xs text-gray-500">
                           <p>Al continuar, aceptas nuestros <a href="#" className="underline hover:text-blue-600 transition-colors">Términos de Servicio</a> y <a href="#" className="underline hover:text-blue-600 transition-colors">Política de Privacidad</a>.</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;