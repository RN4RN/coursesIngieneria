// src/pages/CourseDetailPage.jsx (Código completo, actualizado y sin omisiones)

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { getCourseById } from '../services/courseService';
import { formatPrice } from '../utils/formatters';
import { Accordion, AccordionItem } from '../components/common/Accordion';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext'; // <-- Importa el hook del carrito
import { 
    FaWhatsapp, FaInfoCircle, FaPlayCircle, FaSpinner, FaCheckCircle, 
    FaStar, FaUserFriends, FaRegClock, FaLayerGroup, FaVideo, FaShoppingCart
} from 'react-icons/fa';
import { motion } from 'framer-motion';


const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { addItem } = useCart(); // <-- 1. OBTENEMOS LA FUNCIÓN addItem del contexto

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useEffect del temporizador (sin cambios)
  useEffect(() => {
    const timer = setInterval(() => {
        const now = new Date();
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        const difference = endOfDay - now;
        if (difference > 0) {
            setTimeLeft({
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            });
        } else {
            setTimeLeft(null); clearInterval(timer);
        }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // fetchCourse no cambia en su estructura
  const fetchCourse = useCallback(async () => {
    setLoading(true);
    try {
        const data = await getCourseById(courseId); // Esta función ahora hace el JOIN
        if (data) {
            if (typeof data.whatYouWillLearn === 'string') {
                data.whatYouWillLearn = data.whatYouWillLearn.split(',').map(item => item.trim());
            }
            setCourse(data);
        } else {
            console.error(`Curso con id: ${courseId} no encontrado.`);
            navigate('/404');
        }
    } catch (err) {
        console.error("Error cargando el curso:", err.message);
    } finally {
        setLoading(false);
    }
  }, [courseId, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCourse();
  }, [fetchCourse]);

  // === FUNCIÓN handleAddToCart SIMPLIFICADA ===
  const handleAddToCart = async () => {
    if (!userData) {
      alert('Por favor, inicia sesión para añadir cursos al carrito.');
      navigate('/login');
      return;
    }
    setIsSubmitting(true);
    await addItem(course); // Usamos la función del contexto
    setIsSubmitting(false);
  };

  // handleWhatsAppPurchase, actualizado como ya estaba, ahora debería funcionar
  const handleWhatsAppPurchase = () => {
    if (!userData) {
        alert('Debes iniciar sesión para realizar la compra.');
        navigate('/login');
        return;
    }
    // Buscamos los datos del instructor en el objeto anidado 'users' que viene del JOIN
    const instructorDetails = course?.users;
    
    if (!instructorDetails || !instructorDetails.phone_number) {
        alert('Lo sentimos, este instructor no ha configurado un método de contacto para la compra.');
        return;
    }

    const instructorName = instructorDetails.display_name;
    const instructorPhone = instructorDetails.phone_number;

    const message = encodeURIComponent(`¡Hola, ${instructorName}! 👋 Estoy interesado/a en tu curso "${course.title}" y quisiera realizar la compra.`);
    const cleanPhone = instructorPhone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const totalLessons = useMemo(() => course?.modules?.flatMap(m => m.lessons).length ?? 0, [course]);
  const discountPercentage = 0.60;
  const originalPrice = useMemo(() => course ? course.price / (1 - discountPercentage) : 0, [course]);
  const padTime = (time) => String(time).padStart(2, '0');

  if (loading) return ( <div className="detail-page-state"><FaSpinner className="icon-spin" /><span>Cargando Curso...</span></div> );
  if (!course) return ( <div className="detail-page-state error"><FaInfoCircle /><h2>Curso no encontrado</h2><Link to="/cursos">Volver al catálogo</Link></div> );

  return (
    <div className="course-detail-page">
      <motion.header 
        className="course-hero-header" style={{ backgroundImage: `url(${course.imageUrl})` }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content-detail">
            <motion.div initial={{ opacity:0, y: 20 }} animate={{ opacity:1, y: 0, transition:{ delay: 0.2 }}}><span className="category-tag">{course.category}</span></motion.div>
            <motion.h1 initial={{ opacity:0, y: 20 }} animate={{ opacity:1, y: 0, transition:{ delay: 0.3 }}} className="course-detail-title">{course.title}</motion.h1>
            <motion.p initial={{ opacity:0, y: 20 }} animate={{ opacity:1, y: 0, transition:{ delay: 0.4 }}} className="course-detail-description">{course.description}</motion.p>
            <motion.div initial={{ opacity:0, y: 20 }} animate={{ opacity:1, y: 0, transition:{ delay: 0.5 }}} className="course-meta-info">
             <div className="course-author-container">
                <span className="created-by-label">Creado por:</span>
                <Link to={`/instructor/${course.users?.id}`} className="instructor-name-link">
                  {course.users?.display_name || 'Instructor Desconocido'}
                </Link>
             </div>
              <div className="rating">
                <FaStar/><FaStar/><FaStar/><FaStar/><FaStar/> <span>5.0 (250+ ratings)</span>
              </div>
            </motion.div>
        </div>
      </motion.header>

      <main className="course-detail-main-layout">
        <div className="course-content-column">
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: 0.5 }} className="content-box what-you-will-learn">
                <h2 className="content-box-title">Lo que Construirás y Dominarás</h2>
                <ul className="learning-list">
                    {course.whatYouWillLearn?.map((point, index) => (
                        <li key={index}><FaCheckCircle className="check-icon" /><span>{point}</span></li>
                    ))}
                </ul>
            </motion.div>
            
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: 0.6 }} className="course-curriculum">
                <h2 className="section-title">Contenido del Curso</h2>
                <div className="course-content-summary">
                  <span><FaLayerGroup/> {course.modules?.length ?? 0} Secciones</span>
                  <span><FaVideo/> {totalLessons} Lecciones</span>
                </div>
                <Accordion>
                {course.modules?.length > 0 ? course.modules.map((module, moduleIndex) => (
                  <AccordionItem key={moduleIndex} title={module.title} defaultOpen={true}>
                      <ul className="lessons-list">
                          {module.lessons.map((lesson, lessonIndex) => (
                              <li key={lessonIndex}>
                                  <FaPlayCircle className="lesson-icon" />
                                  <span>{lesson.title}</span>
                              </li>
                          ))}
                      </ul>
                  </AccordionItem>
                )) : <p className="no-content-message">El temario del curso se publicará próximamente.</p>}
                </Accordion>
            </motion.div>
        </div>

        <motion.aside initial={{ opacity:0, y: 50 }} animate={{ opacity:1 }} transition={{ delay: 0.7 }} className="course-sidebar">
          <div className="sidebar-sticky-box">
              <div className="purchase-box">
                  <div className="price-container">
                    <span className="current-price">{formatPrice(course.price)}</span>
                    <span className="original-price">{formatPrice(originalPrice)}</span>
                  </div>
                  <div className="discount-info">
                    <span className="discount-percentage">{discountPercentage * 100}% de descuento</span>
                  </div>
                  
                  <div className="discount-timer">
                      <FaRegClock/>
                      {timeLeft ? (
                          <span>
                              Oferta termina en: <strong>{padTime(timeLeft.hours)}:{padTime(timeLeft.minutes)}:{padTime(timeLeft.seconds)}</strong>
                          </span>
                      ) : (
                          <strong>¡La oferta ha terminado!</strong>
                      )}
                  </div>

                  <div className="purchase-actions">
                      <button onClick={handleAddToCart} className="action-button primary" disabled={isSubmitting}>
                        {isSubmitting ? <FaSpinner className="icon-spin" /> : <FaShoppingCart />}
                        {isSubmitting ? 'Añadiendo...' : 'Añadir al carrito'}
                      </button>
                      <button onClick={handleWhatsAppPurchase} className="action-button secondary">
                          <FaWhatsapp />
                          Comprar Ahora
                      </button>
                  </div>
                  
                  <div className="course-includes">
                      <h4 className="includes-title">Este curso incluye:</h4>
                      <ul>
                        <li><FaRegClock/> <span>Acceso de por vida</span></li>
                        <li><FaUserFriends/> <span>Acceso a comunidad</span></li>
                        <li><FaCheckCircle/> <span>Certificado de finalización</span></li>
                      </ul>
                  </div>
              </div>
          </div>
        </motion.aside>
      </main>
    </div>
  );
};

export default CourseDetailPage;