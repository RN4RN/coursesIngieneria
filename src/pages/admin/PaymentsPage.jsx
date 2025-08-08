// src/pages/admin/PaymentsPage.jsx (Código completo y funcional)

import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';        // 1. Importamos Supabase
import { useAuth } from '../../contexts/AuthContext';    // 2. Importamos el hook de autenticación
import { FaWhatsapp, FaSpinner, FaInfoCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';               // 3. Importamos toast para notificaciones

const PaymentsPage = () => {
  // Obtenemos los datos del usuario logueado (quien está configurando su número)
  const { userData } = useAuth();

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useEffect se ejecuta cuando los datos del usuario están listos
  // para cargar el número de teléfono que ya tiene guardado.
  useEffect(() => {
    if (userData) {
      setPhone(userData.phone_number || ''); // Si existe el número, lo mostramos, si no, un string vacío
    }
    setLoading(false);
  }, [userData]);

  // La nueva función que SÍ guarda en la base de datos
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userData) {
      toast.error('No se pudo identificar al usuario. Por favor, reinicia sesión.');
      return;
    }

    setIsSubmitting(true);

    try {
        const { error } = await supabase
            .from('users')
            .update({ phone_number: phone }) // El dato a actualizar
            .eq('id', userData.id);           // Y la condición: solo en la fila de este usuario

        if (error) throw error; // Si hay un error, saltamos al catch
        
        toast.success('¡Número de WhatsApp guardado correctamente!');
    } catch (error) {
        toast.error('Hubo un error al guardar el número.');
        console.error("Error updating phone number:", error.message);
    } finally {
        setIsSubmitting(false); // Vuelve a habilitar el botón
    }
  };

  if (loading) {
    return <div className="loading-state"><FaSpinner className="animate-spin"/> Cargando configuración...</div>;
  }

  return (
    <div className="payments-page-container">
      <header className="page-header-container">
        <h1 className="dashboard-section-title">Método de Contacto para Pagos</h1>
        <p className="dashboard-section-subtitle">
            Ingresa tu número de WhatsApp aquí. Este será el número de contacto que verán los estudiantes al intentar comprar tus cursos.
        </p>
      </header>
      
      <form className="payments-form" onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="phone">Tu número de celular (WhatsApp)</label>
            <div className="input-with-icon">
                <FaWhatsapp />
                <input
                  type="tel"
                  id="phone"
                  placeholder="Ej: +51 987 654 321"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
            </div>
            <p className="input-hint">
                <FaInfoCircle />
                Asegúrate de incluir el código de tu país (ej. +51 para Perú).
            </p>
        </div>
        <button type="submit" className="form-button primary" disabled={isSubmitting}>
          {isSubmitting ? <FaSpinner className="animate-spin" /> : 'Guardar Número de Contacto'}
        </button>
      </form>
    </div>
  );
};

export default PaymentsPage;