import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import Select from 'react-select'; // Usaremos una librería para selectores con búsqueda
import { FaUserPlus, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

// NOTA: Si no tienes 'react-select', instálalo con: npm install react-select

const EnrollUserPage = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar todos los usuarios y cursos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      const fetchUsers = supabase.from('users').select('id, display_name, email');
      const fetchCourses = supabase.from('courses').select('id, title');
      
      const [usersResponse, coursesResponse] = await Promise.all([fetchUsers, fetchCourses]);
      
      if (usersResponse.data) setAllUsers(usersResponse.data);
      if (coursesResponse.data) setAllCourses(coursesResponse.data);
      
      setLoading(false);
    };
    fetchData();
  }, []);

  // Formatear datos para la librería React-Select
  const userOptions = allUsers.map(user => ({
    value: user.id,
    label: `${user.display_name} (${user.email})`,
    ...user
  }));

  const courseOptions = allCourses.map(course => ({
    value: course.id,
    label: course.title,
    ...course
  }));

  // La función principal que se ejecuta al hacer clic en el botón
  const handleEnrollUser = async (e) => {
    e.preventDefault();
    
    if (!selectedUser || selectedCourses.length === 0) {
      toast.error('Debes seleccionar un usuario y al menos un curso.');
      return;
    }

    setIsSubmitting(true);
    
    // Preparamos los datos para la inserción en la tabla 'enrollments'
    const enrollmentsToInsert = selectedCourses.map(course => ({
      user_id: selectedUser.value,
      course_id: course.value,
    }));

    try {
      const { error } = await supabase.from('enrollments').insert(enrollmentsToInsert);
      
      if (error) {
        if (error.code === '23505') { // Error de "violación de clave única"
            toast.error('El usuario ya está inscrito en uno o más de los cursos seleccionados.');
        } else {
            throw error;
        }
      } else {
        toast.success(`¡${selectedUser.display_name} inscrito en ${selectedCourses.length} curso(s) exitosamente!`);
        // Limpiamos los campos para la siguiente inscripción
        setSelectedUser(null);
        setSelectedCourses([]);
      }
    } catch (error) {
      toast.error('Hubo un problema al realizar la inscripción.');
      console.error("Error enrolling user:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-state"><FaSpinner className="animate-spin"/> Cargando datos...</div>;
  }
  
  return (
    <div className="enroll-page-container">
      <header className="page-header-container">
        <h1 className="dashboard-section-title">Inscribir Usuario en Cursos</h1>
        <p className="dashboard-section-subtitle">Confirma el pago y luego utiliza esta herramienta para dar acceso manualmente.</p>
      </header>

      <form onSubmit={handleEnrollUser} className="enroll-form">
        <div className="form-group">
          <label htmlFor="user-select">1. Seleccionar Usuario</label>
          <Select
            id="user-select"
            options={userOptions}
            value={selectedUser}
            onChange={setSelectedUser}
            placeholder="Busca por nombre o email..."
            isClearable
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        <div className="form-group">
          <label htmlFor="course-select">2. Seleccionar Cursos Comprados</label>
          <Select
            id="course-select"
            options={courseOptions}
            value={selectedCourses}
            onChange={setSelectedCourses}
            placeholder="Busca y selecciona uno o más cursos..."
            isMulti // Permite seleccionar varios cursos
            closeMenuOnSelect={false}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        <button type="submit" className="form-button primary" disabled={isSubmitting}>
          {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaUserPlus />}
          <span>Confirmar Inscripción</span>
        </button>
      </form>
    </div>
  );
};

export default EnrollUserPage;