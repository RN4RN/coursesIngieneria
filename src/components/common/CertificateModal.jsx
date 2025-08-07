import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCertificate } from 'react-icons/fa';

const CertificateModal = ({ isOpen, onClose, templateUrl, courseTitle }) => {
    const [fullName, setFullName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!fullName.trim()) {
            alert('Por favor, ingresa tu nombre completo.');
            return;
        }

        setIsSubmitting(true);

        // Creamos la URL final con el nombre del estudiante como parámetro de búsqueda
        const finalUrl = `${templateUrl}?name=${encodeURIComponent(fullName)}`;
        
        // Abrimos la plantilla del certificado en una nueva pestaña
        window.open(finalUrl, '_blank');

        // Cerramos el modal
        onClose();
        setFullName('');
        setIsSubmitting(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    className="certificate-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div 
                        className="certificate-modal-panel"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                    >
                        <header className="modal-header">
                            <h3>Generar Certificado</h3>
                            <button onClick={onClose}><FaTimes /></button>
                        </header>
                        
                        <div className="modal-content">
                            <FaCertificate className="modal-icon"/>
                            <p>¡Felicidades por completar el curso <strong>{courseTitle}</strong>!</p>
                            <p>Ingresa tu nombre completo como deseas que aparezca en el certificado.</p>
                            <form onSubmit={handleSubmit} className="modal-form">
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Ej. Juan Pérez García"
                                    required
                                />
                                <button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Generando...' : 'Generar Mi Certificado'}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CertificateModal;