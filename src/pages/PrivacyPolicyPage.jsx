import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
    // Hace que la página siempre empiece desde arriba
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="policy-page-container">
            <div className="policy-content">
                <h1 className="policy-title">Política de Privacidad</h1>
                <p className="policy-subtitle">
                    <strong>Última actualización:</strong> [Rellena la fecha de hoy, ej: 20 de Mayo de 2024]
                </p>

                <div className="policy-section">
                    <p>
                        Bienvenido a <strong>[Nombre de tu Plataforma, ej: CursosOnline]</strong>. Tu privacidad es de suma importancia para nosotros. Esta política de privacidad explica qué datos personales recopilamos de nuestros usuarios y cómo los usamos.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>1. Información que Recopilamos</h2>
                    <p>Recopilamos información para proporcionar y mejorar nuestros servicios. Esto incluye:</p>
                    <ul>
                        <li>
                            <strong>Información de la cuenta:</strong> Cuando te registras utilizando proveedores de terceros como Google, Facebook o GitHub, recibimos la información que has aceptado compartir a través de ellos, como tu nombre completo, dirección de correo electrónico y foto de perfil.
                        </li>
                        <li>
                            <strong>Progreso del curso:</strong> Guardamos información sobre tu actividad en la plataforma, como los cursos en los que te inscribes y las lecciones que completas, para gestionar tu progreso y emitir certificados.
                        </li>
                        <li>
                            <strong>Información de contacto:</strong> Si te pones en contacto con nosotros directamente, podemos recibir información adicional sobre ti, como tu nombre y el contenido de los mensajes o archivos adjuntos que nos envíes.
                        </li>
                    </ul>
                </div>

                <div className="policy-section">
                    <h2>2. Cómo Usamos tu Información</h2>
                    <p>Usamos la información que recopilamos para:</p>
                    <ul>
                        <li>Proporcionar, operar y mantener nuestra plataforma.</li>
                        <li>Crear y gestionar tu cuenta de usuario.</li>
                        <li>Personalizar tu experiencia de aprendizaje.</li>
                        <li>Procesar tus inscripciones y darte acceso a los cursos.</li>
                        <li>Comunicarnos contigo para proporcionar soporte al cliente o informarte sobre actualizaciones.</li>
                    </ul>
                </div>
                
                <div className="policy-section">
                    <h2>3. Cómo Compartimos tu Información</h2>
                    <p>
                        No vendemos ni alquilamos tu información personal a terceros. Utilizamos servicios de terceros de confianza para funciones específicas, como la autenticación y el almacenamiento de datos:
                    </p>
                     <ul>
                        <li><strong>Firebase Authentication:</strong> Para gestionar el inicio de sesión de forma segura.</li>
                        <li><strong>Supabase:</strong> Para almacenar los datos de tu perfil y el progreso de tus cursos.</li>
                    </ul>
                    <p>
                        Estos proveedores de servicios solo tienen acceso a la información personal necesaria para realizar sus funciones y están obligados a protegerla.
                    </p>
                </div>
                
                <div className="policy-section">
                    <h2>4. Tus Derechos de Privacidad</h2>
                    <p>
                        Tienes derecho a acceder, corregir o eliminar tu información personal. Si deseas ejercer alguno de estos derechos, por favor contáctanos.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>5. Contacto</h2>
                    <p>
                        Si tienes alguna pregunta sobre esta Política de Privacidad, por favor contáctanos en:
                        <br />
                        <strong>[Tu Email de Contacto, ej: soporte@cursosonline.com]</strong>
                    </p>
                    <Link to="/" className="back-to-home-link">Volver al Inicio</Link>
                </div>

            </div>
        </div>
    );
};

export default PrivacyPolicyPage;