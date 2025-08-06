// src/pages/admin/ManageCourses.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
// --- AÑADIDOS NUEVOS ÍCONOS ---
import { FaEdit, FaTrash, FaPlus, FaSpinner, FaVideo, FaBookOpen, FaTimes, FaCertificate, FaQuestionCircle } from 'react-icons/fa';
// ---------------------------------
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';


// =====================================================================================
// ===                       SUB-COMPONENTE: FORMULARIO MEJORADO                       ===
// =====================================================================================
const CourseForm = ({ courseToEdit, onFormSubmit, onCancel }) => {
    // --- ESTADO INICIAL AÑADIENDO CAMPOS DE EXAMEN/CERTIFICADO ---
    const initialFormData = { 
        title: '', instructor: '', description: '', price: 0, category: '', 
        whatYouWillLearn: '', imageUrl: null,
        has_exam: false, exam_url: '',
        has_certificate: false, certificate_template_url: ''
    };
    const [formData, setFormData] = useState(initialFormData);
    // -------------------------------------------------------------
    const [modules, setModules] = useState([{ title: '', lessons: [{ title: '', videoUrl: '' }] }]);
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);


    // --- EFECTO DE RELLENO ACTUALIZADO ---
    useEffect(() => {
        if (courseToEdit) {
            setFormData({
                title: courseToEdit.title || '', 
                instructor: courseToEdit.instructor || '', 
                description: courseToEdit.description || '',
                price: courseToEdit.price || 0, 
                category: courseToEdit.category || '', 
                imageUrl: courseToEdit.imageUrl || null,
                whatYouWillLearn: Array.isArray(courseToEdit.whatYouWillLearn) ? courseToEdit.whatYouWillLearn.join(', ') : '',
                // --- AÑADIDO: RELLENO DE NUEVOS CAMPOS ---
                has_exam: courseToEdit.has_exam || false,
                exam_url: courseToEdit.exam_url || '',
                has_certificate: courseToEdit.has_certificate || false,
                certificate_template_url: courseToEdit.certificate_template_url || '',
                // ----------------------------------------
            });
            setModules(courseToEdit.modules && courseToEdit.modules.length > 0 ? courseToEdit.modules : [{ title: '', lessons: [{ title: '', videoUrl: '' }] }]);
            setPreviewUrl(courseToEdit.imageUrl);
        } else {
            // Reset completo para un curso nuevo
            setFormData(initialFormData);
            setModules([{ title: '', lessons: [{ title: '', videoUrl: '' }] }]);
            setCoverImageFile(null);
            setPreviewUrl(null);
        }
    }, [courseToEdit]);


    // --- MANEJADOR DE CAMBIOS MODIFICADO para checkboxes ---
    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(p => ({ 
            ...p, 
            [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(e.target.value) || 0 : value) 
        }));
    };
    // --------------------------------------------------------
    
    // (Estas funciones se mantienen igual)
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
    
    // --- FUNCIÓN DE ENVÍO ACTUALIZADA ---
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

        // --- AÑADIDO: lógica de preparación de datos ---
        const finalCourseData = { 
            ...formData, 
            id: courseToEdit?.id, 
            imageUrl: finalImageUrl, 
            modules, 
            whatYouWillLearn: formData.whatYouWillLearn.split(',').map(s => s.trim()),
            exam_url: formData.has_exam ? formData.exam_url : null,
            certificate_template_url: formData.has_certificate ? formData.certificate_template_url : null
        };
        // ----------------------------------------------

        await onFormSubmit(finalCourseData);
        setIsSubmitting(false);
    };

    // --- RENDERIZADO DEL FORMULARIO (JSX) ---
    return (
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="form-container">
            <form onSubmit={handleSubmit}>
                <div className="form-header">
                    <h3>{courseToEdit ? 'Editar Curso' : 'Crear Nuevo Curso'}</h3>
                    <button type="button" onClick={onCancel} className="close-form-btn"><FaTimes /></button>
                </div>
                
                <div className="form-content">
                    {/* Sección de Información General */}
                    <fieldset className="form-section">
                        <legend>Información General</legend>
                        <div className="form-grid">
                            <div className="form-group col-span-2"><label htmlFor="title">Título del curso</label><input id="title" name="title" value={formData.title} onChange={handleFormChange} required /></div>
                            <div className="form-group"><label htmlFor="instructor">Instructor</label><input id="instructor" name="instructor" value={formData.instructor} onChange={handleFormChange} required /></div>
                            <div className="form-group"><label htmlFor="category">Categoría</label><input id="category" name="category" value={formData.category} onChange={handleFormChange} required /></div>
                            <div className="form-group col-span-2"><label htmlFor="description">Descripción</label><textarea id="description" name="description" value={formData.description} onChange={handleFormChange} rows="4" required /></div>
                            <div className="form-group col-span-2"><label htmlFor="whatYouWillLearn">Qué aprenderán (separado por comas)</label><textarea id="whatYouWillLearn" name="whatYouWillLearn" value={formData.whatYouWillLearn} onChange={handleFormChange} rows="3" /></div>
                        </div>
                    </fieldset>

                     {/* Sección de Precio e Imagen */}
                     <fieldset className="form-section">
                        <legend>Precio e Imagen de Portada</legend>
                         <div className="form-grid">
                            <div className="form-group"><label htmlFor="price">Precio (PEN)</label><input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleFormChange} required /></div>
                            <div className="form-group col-span-2">
                                <label>Imagen de Portada</label>
                                <div className="file-input-wrapper">
                                    <input type="file" id="coverImage" onChange={handleCoverImageChange} accept="image/*" />
                                    <label htmlFor="coverImage" className="file-input-label"><span>Seleccionar archivo</span></label>
                                    {previewUrl && <img src={previewUrl} alt="Vista previa" className="image-preview" />}
                                </div>
                            </div>
                        </div>
                    </fieldset>

                    {/* --- AÑADIDA NUEVA SECCIÓN PARA EXÁMENES Y CERTIFICADOS --- */}
                    <fieldset className="form-section">
                        <legend>Exámenes y Certificados</legend>
                        <div className="form-grid">
                            {/* Campo de Examen */}
                            <div className="form-group checkbox-group">
                                <input type="checkbox" id="has_exam" name="has_exam" checked={formData.has_exam} onChange={handleFormChange} />
                                <label htmlFor="has_exam"> <FaQuestionCircle/> Ofrece Examen Final </label>
                            </div>
                            {formData.has_exam && (
                                <div className="form-group col-span-2 indented">
                                    <label htmlFor="exam_url">URL del Examen (ej. Google Form)</label>
                                    <input id="exam_url" name="exam_url" value={formData.exam_url} onChange={handleFormChange} placeholder="https://forms.gle/..." />
                                </div>
                            )}

                            {/* Campo de Certificado */}
                            <div className="form-group checkbox-group">
                                <input type="checkbox" id="has_certificate" name="has_certificate" checked={formData.has_certificate} onChange={handleFormChange} />
                                <label htmlFor="has_certificate"> <FaCertificate/> Ofrece Certificado </label>
                            </div>
                            {formData.has_certificate && (
                                <div className="form-group col-span-2 indented">
                                    <label htmlFor="certificate_template_url">URL de Plantilla del Certificado (ej. Canva)</label>
                                    <input id="certificate_template_url" name="certificate_template_url" value={formData.certificate_template_url} onChange={handleFormChange} placeholder="https://www.canva.com/design/..." />
                                </div>
                            )}
                        </div>
                    </fieldset>
                    {/* ----------------------------------------------------------------- */}

                    {/* Sección de Módulos y Lecciones */}
                    <fieldset className="form-section">
                        <legend>Contenido del Curso</legend>
                        {modules.map((module, modIdx) => (
                            <div key={modIdx} className="module-container">
                                <div className="module-header">
                                    <FaBookOpen />
                                    <input name="title" value={module.title} onChange={(e) => handleModuleChange(modIdx, e)} placeholder={`Título del Módulo ${modIdx + 1}`} className="module-title-input" />
                                    <button type="button" onClick={() => removeModule(modIdx)} className="remove-item-btn"><FaTrash /></button>
                                </div>
                                <div className="lessons-container">
                                    {module.lessons.map((lesson, lesIdx) => (
                                        <div key={lesIdx} className="lesson-row">
                                            <FaVideo className="lesson-icon" />
                                            <input name="title" value={lesson.title} onChange={(e) => handleLessonChange(modIdx, lesIdx, e)} placeholder={`Lección ${lesIdx + 1}`} className="lesson-input" />
                                            <input name="videoUrl" value={lesson.videoUrl} onChange={(e) => handleLessonChange(modIdx, lesIdx, e)} placeholder="URL del Video" className="lesson-input" />
                                            <button type="button" onClick={() => removeLesson(modIdx, lesIdx)} className="remove-item-btn small"><FaTimes /></button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addLesson(modIdx)} className="add-lesson-btn"><FaPlus/> Añadir Lección</button>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addModule} className="add-module-btn"><FaPlus/> Añadir Módulo</button>
                    </fieldset>
                </div>

                <div className="form-footer">
                    <button type="button" onClick={onCancel} className="form-button secondary">Cancelar</button>
                    <button type="submit" disabled={isSubmitting} className="form-button primary">
                        {isSubmitting && <FaSpinner className="animate-spin" />}
                        <span>{courseToEdit ? 'Actualizar Curso' : 'Guardar Curso'}</span>
                    </button>
                </div>
            </form>
        </motion.div>
    );
};


// =====================================================================================
// ===                      COMPONENTE PRINCIPAL DE GESTIÓN (CRUD)                   ===
// =====================================================================================
const ManageCourses = () => {
    // --- ESTADOS DE LA PÁGINA (LÓGICA SIN CAMBIOS) ---
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCourse, setEditingCourse] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // --- Cargar, Enviar y Eliminar (LÓGICA SIN CAMBIOS) ---
    const fetchCourses = async () => { setLoading(true); const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false }); if (error) console.error(error); else setCourses(data); setLoading(false); };
    useEffect(() => { fetchCourses(); }, []);
    
    const handleFormSubmit = async (courseData) => {
        const { id, ...data } = courseData;
        const { error } = id ? await supabase.from('courses').update(data).eq('id', id) : await supabase.from('courses').insert(data);
        if (error) { alert(error.message); } else { setShowForm(false); setEditingCourse(null); fetchCourses(); }
    };
    
    const handleDelete = async (courseId) => {
        if (window.confirm('¿Seguro que quieres eliminar este curso?')) {
            const { error } = await supabase.from('courses').delete().eq('id', courseId);
            if (error) alert(error.message); else fetchCourses();
        }
    }

    if (loading && !showForm) return <div className="table-loading-state"><FaSpinner className="animate-spin"/> Cargando Cursos...</div>;
    
    // --- RENDERIZADO (JSX MEJORADO) ---
    return (
        <div>
            <div className="page-header-container">
                <h1 className="dashboard-section-title">Gestionar Cursos</h1>
                {!showForm && (
                     <motion.button onClick={() => { setEditingCourse(null); setShowForm(true); }} className="add-new-button">
                        <FaPlus/> Nuevo Curso
                    </motion.button>
                )}
            </div>

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
                        {/* --- CABECERA DE LA TABLA AÑADIENDO COLUMNA --- */}
                        <thead><tr><th>Curso</th><th>Extras</th><th>Precio</th><th>Módulos</th><th>Acciones</th></tr></thead>
                        {/* ----------------------------------------------- */}
                        <tbody>
                            {courses.map(course => (
                                <tr key={course.id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="course-table-image" style={{backgroundImage: `url(${course.imageUrl || 'https://via.placeholder.com/150'})`}}/>
                                            <div>
                                                <div className="font-semibold text-gray-800">{course.title}</div>
                                                <div className="text-xs text-gray-500">{course.instructor}</div>
                                            </div>
                                        </div>
                                    </td>
                                    {/* --- CELDA AÑADIDA PARA MOSTRAR EXTRAS --- */}
                                    <td className="extras-cell">
                                        {course.has_exam && <div title="Tiene Examen"><FaQuestionCircle /></div>}
                                        {course.has_certificate && <div title="Ofrece Certificado"><FaCertificate /></div>}
                                    </td>
                                    {/* --------------------------------------- */}
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
                <div className="empty-state-message">
                    <h2 className="text-2xl font-semibold">No hay cursos creados</h2>
                    <p className="mt-2">Haz clic en "Nuevo Curso" para empezar a añadir contenido.</p>
                </div>
            )}
        </div>
    );
};

export default ManageCourses;