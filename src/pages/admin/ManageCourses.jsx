
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useAuth } from '../../contexts/AuthContext'; // <-- 1. IMPORTAMOS useAuth PARA SABER QUIÉN ES EL INSTRUCTOR
import { FaEdit, FaTrash, FaPlus, FaSpinner, FaVideo, FaBookOpen, FaTimes, FaCertificate, FaQuestionCircle } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';

// =====================================================================================
// ===                       SUB-COMPONENTE: FORMULARIO MEJORADO                       ===
// =====================================================================================
const CourseForm = ({ courseToEdit, onFormSubmit, onCancel }) => {
    const initialFormData = { 
        title: '', 
        // Eliminamos 'instructor' del estado del formulario, se asignará automáticamente.
        description: '', 
        price: 0, 
        category: '', 
        whatYouWillLearn: '', 
        imageUrl: null,
        has_exam: false, exam_url: '',
        has_certificate: false, certificate_template_url: ''
    };
    const [formData, setFormData] = useState(initialFormData);
    const [modules, setModules] = useState([{ title: '', lessons: [{ title: '', videoUrl: '' }] }]);
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (courseToEdit) {
            setFormData({
                title: courseToEdit.title || '', 
                description: courseToEdit.description || '',
                price: courseToEdit.price || 0, 
                category: courseToEdit.category || '', 
                imageUrl: courseToEdit.imageUrl || null,
                whatYouWillLearn: Array.isArray(courseToEdit.whatYouWillLearn) ? courseToEdit.whatYouWillLearn.join(', ') : '',
                has_exam: courseToEdit.has_exam || false,
                exam_url: courseToEdit.exam_url || '',
                has_certificate: courseToEdit.has_certificate || false,
                certificate_template_url: courseToEdit.certificate_template_url || '',
            });
            setModules(courseToEdit.modules && courseToEdit.modules.length > 0 ? courseToEdit.modules : [{ title: '', lessons: [{ title: '', videoUrl: '' }] }]);
            setPreviewUrl(courseToEdit.imageUrl);
        } else {
            setFormData(initialFormData);
            setModules([{ title: '', lessons: [{ title: '', videoUrl: '' }] }]);
            setCoverImageFile(null);
            setPreviewUrl(null);
        }
    }, [courseToEdit]);

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(e.target.value) || 0 : value) }));
    };
    
    // (Estas funciones se mantienen igual que en tu código original)
    const handleModuleChange = (i, e) => { const newMods = [...modules]; newMods[i][e.target.name] = e.target.value; setModules(newMods); };
    const handleLessonChange = (modIdx, lesIdx, e) => { const newMods = [...modules]; newMods[modIdx].lessons[lesIdx][e.target.name] = e.target.value; setModules(newMods); };
    const addModule = () => setModules([...modules, { title: '', lessons: [{ title: '', videoUrl: '' }] }]);
    const addLesson = (modIdx) => { const newMods = [...modules]; newMods[modIdx].lessons.push({ title: '', videoUrl: '' }); setModules(newMods); };
    const removeModule = (modIdx) => setModules(modules.filter((_, i) => i !== modIdx));
    const removeLesson = (modIdx, lesIdx) => { const newMods = [...modules]; newMods[modIdx].lessons = newMods[modIdx].lessons.filter((_, i) => i !== lesIdx); setModules(newMods); };

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file) { setCoverImageFile(file); setPreviewUrl(URL.createObjectURL(file)); }
    };
    
    // --- FUNCIÓN DE ENVÍO SIN CAMBIOS VISIBLES (la lógica del instructor se pasa en `handleFormSubmit`) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        let finalImageUrl = formData.imageUrl;

        if (coverImageFile) {
            const fileName = `${uuidv4()}-${coverImageFile.name}`;
            const { error } = await supabase.storage.from('course-covers').upload(fileName, coverImageFile, { upsert: true });
            if (error) { alert('Error subiendo imagen: ' + error.message); setIsSubmitting(false); return; }
            const { data } = supabase.storage.from('course-covers').getPublicUrl(fileName);
            finalImageUrl = data.publicUrl;
        }

        const finalCourseData = { 
            ...formData, 
            id: courseToEdit?.id, 
            imageUrl: finalImageUrl, 
            modules, 
            whatYouWillLearn: formData.whatYouWillLearn.split(',').map(s => s.trim()),
            exam_url: formData.has_exam ? formData.exam_url : null,
            certificate_template_url: formData.has_certificate ? formData.certificate_template_url : null
        };
        
        await onFormSubmit(finalCourseData);
        setIsSubmitting(false);
    };

    // --- RENDERIZADO DEL FORMULARIO ---
    return (
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="form-container">
            <form onSubmit={handleSubmit}>
                <div className="form-header">{/* ... (Sin cambios) ... */}</div>
                <div className="form-content">
                    <fieldset className="form-section">
                        <legend>Información General</legend>
                        <div className="form-grid">
                            <div className="form-group col-span-2"><label htmlFor="title">Título del curso</label><input id="title" name="title" value={formData.title} onChange={handleFormChange} required /></div>
                            
                            {/* --- ELIMINADO EL CAMPO MANUAL DE INSTRUCTOR ---
                            <div className="form-group"><label htmlFor="instructor">Instructor</label><input id="instructor" name="instructor" value={formData.instructor} onChange={handleFormChange} required /></div>
                             ------------------------------------------ */}
                            
                            <div className="form-group"><label htmlFor="category">Categoría</label><input id="category" name="category" value={formData.category} onChange={handleFormChange} required /></div>
                            <div className="form-group col-span-2"><label htmlFor="description">Descripción</label><textarea id="description" name="description" value={formData.description} onChange={handleFormChange} rows="4" required /></div>
                            <div className="form-group col-span-2"><label htmlFor="whatYouWillLearn">Qué aprenderán (separado por comas)</label><textarea id="whatYouWillLearn" name="whatYouWillLearn" value={formData.whatYouWillLearn} onChange={handleFormChange} rows="3" /></div>
                        </div>
                    </fieldset>

                     <fieldset className="form-section">{/* ... (Sección Precio e Imagen sin cambios) ... */}</fieldset>
                     <fieldset className="form-section">{/* ... (Sección Examen y Certificados sin cambios) ... */}</fieldset>
                     <fieldset className="form-section">{/* ... (Sección Módulos y Lecciones sin cambios) ... */}</fieldset>
                </div>
                <div className="form-footer">{/* ... (Sin cambios) ... */}</div>
            </form>
        </motion.div>
    );
};


// =====================================================================================
// ===                      COMPONENTE PRINCIPAL DE GESTIÓN (CRUD)                   ===
// =====================================================================================
const ManageCourses = () => {
    // --- 2. OBTENEMOS LOS DATOS DEL USUARIO LOGUEADO ---
    const { userData } = useAuth();
    // --------------------------------------------------

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCourse, setEditingCourse] = useState(null);
    const [showForm, setShowForm] = useState(false);
    
    // --- 3. FETCHCOURSES ACTUALIZADO PARA HACER EL JOIN ---
    const fetchCourses = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          users (display_name)
        `) // <-- Hacemos el JOIN para obtener el nombre del instructor
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      else setCourses(data);
      setLoading(false);
    };
    useEffect(() => { fetchCourses(); }, []);
    
    // --- 4. handleFormSubmit ACTUALIZADO PARA GUARDAR EL ID Y NOMBRE DEL INSTRUCTOR ---
    const handleFormSubmit = async (courseData) => {
        if (!userData) {
            alert('Error: No se ha podido identificar al instructor. Por favor, reinicia sesión.');
            return;
        }

        const { id, ...data } = courseData;

        // --- Datos a guardar, incluyendo el ID y nombre del instructor ---
        const dataToSubmit = {
            ...data,
            instructor_id: userData.id,      // ID del usuario que crea/edita (desde el AuthContext)
            instructor: userData.display_name // Guardamos también el nombre para mostrarlo rápido
        };

        const { error } = id 
            ? await supabase.from('courses').update(dataToSubmit).eq('id', id) 
            : await supabase.from('courses').insert(dataToSubmit);

        if (error) { 
            alert(error.message); 
        } else { 
            setShowForm(false); 
            setEditingCourse(null); 
            fetchCourses(); 
        }
    };
    
    // --- handleDelete sin cambios ---
    const handleDelete = async (courseId) => { /* ... */ };

    if (loading && !showForm) return <div className="table-loading-state"><FaSpinner className="animate-spin"/> Cargando Cursos...</div>;
    
    // --- RENDERIZADO ---
    return (
        <div>
            <div className="page-header-container">{/* ... (Sin cambios) ... */}</div>

            <AnimatePresence>
                {showForm && (
                    <CourseForm 
                        courseToEdit={editingCourse} 
                        onFormSubmit={handleFormSubmit}
                        onCancel={() => { setShowForm(false); setEditingCourse(null); }}
                    />
                )}
            </AnimatePresence>
            
            {!showForm && courses.length > 0 && (
                <div className="table-container">
                    <table className="data-table">
                        <thead><tr><th>Curso</th><th>Extras</th><th>Precio</th><th>Módulos</th><th>Acciones</th></tr></thead>
                        <tbody>
                            {courses.map(course => (
                                <tr key={course.id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="course-table-image" style={{backgroundImage: `url(${course.imageUrl || 'https://via.placeholder.com/150'})`}}/>
                                            <div>
                                                <div className="font-semibold text-gray-800">{course.title}</div>
                                                {/* --- 5. AHORA MOSTRAMOS EL NOMBRE DEL INSTRUCTOR DESDE EL JOIN --- */}
                                                <div className="text-xs text-gray-500">{course.users?.display_name || course.instructor}</div>
                                                {/* ------------------------------------------------------------- */}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="extras-cell">
                                        {course.has_exam && <div title="Tiene Examen"><FaQuestionCircle /></div>}
                                        {course.has_certificate && <div title="Ofrece Certificado"><FaCertificate /></div>}
                                    </td>
                                    <td>S/.{course.price?.toFixed(2) ?? '0.00'}</td>
                                    <td>{course.modules?.length ?? 0}</td>
                                    <td className="actions-cell">
                                        <button onClick={() => { setEditingCourse(course); setShowForm(true); window.scrollTo(0, 0); }} className="action-button edit" title="Editar"><FaEdit /></button>
                                        <button onClick={() => handleDelete(course.id)} className="action-button delete" title="Eliminar"><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!showForm && !loading && courses.length === 0 && (
                <div className="empty-state-message">{/*... (Sin cambios) ...*/}</div>
            )}
        </div>
    );
};

export default ManageCourses;