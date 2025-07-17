// src/pages/CourseDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseById } from '../services/courseService';
import VideoPlayer from '../components/common/VideoPlayer';
import { Accordion, AccordionItem } from '../components/common/Accordion';
import { FaWhatsapp, FaInfoCircle, FaPlayCircle, FaSpinner, FaCheckCircle, FaStar, FaUserFriends, FaRegClock } from 'react-icons/fa';
import { motion } from 'framer-motion';

// --- CONFIGURACIÓN PARA WHATSAPP (PONER TUS DATOS) ---
const WHATSAPP_NUMBER = '5211234567890'; // ¡REEMPLAZA!
const OWNER_NAME = 'TuNombre';             // ¡REEMPLAZA!


const CourseDetailPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await getCourseById(courseId);
        if (data) {
          if (typeof data.whatYouWillLearn === 'string') { data.whatYouWillLearn = data.whatYouWillLearn.split(',').map(item => item.trim()); }
          setCourse(data);
        } else {
          setError('¡Ups! No pudimos encontrar ese curso.');
        }
      } catch (err) {
        setError('Ocurrió un error al cargar los datos.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleWhatsAppPurchase = () => {
    const message = encodeURIComponent(`¡Hola, ${OWNER_NAME}! 👋 Estoy interesado/a en el curso "${course.title}". ¿Me podrías dar más información?`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  if (loading) return ( <div className="detail-page-state"><FaSpinner className="animate-spin text-5xl text-blue-600" /></div> );
  if (error) return ( <div className="detail-page-state error"><FaInfoCircle className="text-5xl" /><h2 className="text-3xl font-bold">{error}</h2></div> );
  if (!course) return null;

  return (
    <>
      {/* ===== HERO HEADER INMERSIVO ===== */}
      <motion.header 
        className="course-hero-header" 
        style={{ backgroundImage: `url(${course.imageUrl})` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content-detail">
            <motion.p initial={{ opacity:0, y: 20 }} animate={{ opacity:1, y: 0, transition:{ delay: 0.2 }}} className="category-tag">{course.category}</motion.p>
            <motion.h1 initial={{ opacity:0, y: 20 }} animate={{ opacity:1, y: 0, transition:{ delay: 0.3 }}}>{course.title}</motion.h1>
            <motion.p initial={{ opacity:0, y: 20 }} animate={{ opacity:1, y: 0, transition:{ delay: 0.4 }}} className="hero-description">{course.description}</motion.p>
            <motion.div initial={{ opacity:0, y: 20 }} animate={{ opacity:1, y: 0, transition:{ delay: 0.5 }}} className="course-meta-info">
              <span>Creado por: <Link to={`/instructor/${course.instructor}`} className="instructor-link">{course.instructor}</Link></span>
              <div className="rating">
                <FaStar/><FaStar/><FaStar/><FaStar/><FaStar/> <span>5.0 (250 ratings)</span>
              </div>
            </motion.div>
        </div>
      </motion.header>

      {/* ===== LAYOUT PRINCIPAL (2 COLUMNAS) ===== */}
      <main className="course-detail-main-layout">
        <div className="course-content-column">
            
            {/* Sección: ¿Qué aprenderás? */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1, transition:{ delay: 0.6 } }} className="content-box">
                <h2 className="content-box-title">Lo que Construirás y Dominarás</h2>
                <ul className="learning-list">
                    {course.whatYouWillLearn?.map((point, index) => (
                        <li key={index}><FaCheckCircle /><span>{point}</span></li>
                    ))}
                </ul>
            </motion.div>
            
            {/* Sección: Contenido del Curso (Acordeón) */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1, transition:{ delay: 0.7 } }} className="mt-12">
                <h2 className="section-title">Contenido del Curso</h2>
                <div className="text-sm text-gray-500 mb-4">{course.modules?.length ?? 0} Secciones • {course.modules?.flatMap(m => m.lessons).length ?? 0} Lecciones</div>
                <Accordion>
                {course.modules?.length > 0 ? course.modules.map((module, moduleIndex) => (
                  <AccordionItem key={moduleIndex} title={module.title}>
                      <ul className="lessons-list">
                          {module.lessons.map((lesson, lessonIndex) => (
                              <li key={lessonIndex}>
                                  <FaPlayCircle />
                                  <span>{lesson.title}</span>
                              </li>
                          ))}
                      </ul>
                  </AccordionItem>
                )) : <p className="p-4 text-gray-500">El temario del curso se publicará próximamente.</p>}
                </Accordion>
            </motion.div>

        </div>

        {/* --- Sidebar de Compra --- */}
        <motion.aside initial={{ opacity:0, y: 50 }} animate={{ opacity:1, y: 0, transition:{ delay: 0.8 }}} className="course-sidebar">
          <div className="sidebar-sticky-box">
              <div className="video-player-wrapper">
                {/* Usar una imagen como placeholder si no hay video */}
                {!course.modules?.[0]?.lessons?.[0]?.videoUrl ? (
                    <img src={course.imageUrl} alt={course.title} className="video-placeholder-image"/>
                ) : (
                    <VideoPlayer videoUrl={course.modules?.[0]?.lessons?.[0]?.videoUrl} />
                )}
                <div className="video-overlay-text">Vista Previa del Curso</div>
              </div>
              
              <div className="purchase-box">
                  <p className="price-tag">${course.price?.toFixed(2)}</p>
                  <button onClick={handleWhatsAppPurchase} className="purchase-button whatsapp">
                      <FaWhatsapp /> Comprar por WhatsApp
                  </button>
                  <p className="secure-payment-text">Pago 100% seguro. Atención personalizada.</p>
                  <div className="course-includes">
                      <h4 className="includes-title">Este curso incluye:</h4>
                      <ul>
                        <li><FaRegClock/> <span>Acceso de por vida</span></li>
                        <li><FaUserFriends/> <span>Acceso a comunidad de estudiantes</span></li>
                        <li><FaCheckCircle/> <span>Certificado de finalización</span></li>
                      </ul>
                  </div>
              </div>
          </div>
        </motion.aside>
      </main>
    </>
  );
};

export default CourseDetailPage;