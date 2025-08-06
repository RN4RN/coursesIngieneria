import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase'; // --- IMPORTAMOS SUPABASE ---
import { getCourseById } from '../services/courseService';
import { formatPrice } from '../utils/formatters';
import { Accordion, AccordionItem } from '../components/common/Accordion';
import { useAuth } from '../contexts/AuthContext';
import { 
    FaWhatsapp, FaInfoCircle, FaPlayCircle, FaSpinner, FaCheckCircle, 
    FaStar, FaUserFriends, FaRegClock, FaLayerGroup, FaVideo, FaShoppingCart
} from 'react-icons/fa';
import { motion } from 'framer-motion';

// --- CONFIGURACIÓN ---
// --- CONFIGURACIÓN IMPORTADA ---
import { WHATSAPP_NUMBER, OWNER_NAME } from '../config';

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // --- Estado para deshabilitar botones al procesar

  // El useEffect del temporizador no cambia...
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

  // La lógica para obtener el curso no cambia...
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await getCourseById(courseId);
        if (data) {
          if (typeof data.whatYouWillLearn === 'string') { 
              data.whatYouWillLearn = data.whatYouWillLearn.split(',').map(item => item.trim()); 
          }
          setCourse(data);
        } else { setError('¡Ups! No pudimos encontrar ese curso.'); }
      } catch (err) { setError('Ocurrió un error al cargar los datos.'); } 
      finally { setLoading(false); }
    };
    fetchCourse();
  }, [courseId]);

  // --- FUNCIÓN DE AÑADIR AL CARRITO MEJORADA Y CONECTADA A SUPABASE ---
  const handleAddToCart = async () => {
    if (!userData) {
      alert('Por favor, inicia sesión para añadir cursos al carrito.');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('cart')
        .insert({
          user_id: userData.id,   // El ID del usuario desde nuestra tabla 'users'
          course_id: course.id, // El ID del curso actual
        });
        
      if (error) {
        if (error.code === '23505') { // Código de error para 'unique constraint violation'
          alert('¡Este curso ya está en tu carrito!');
        } else {
          throw error;
        }
      } else {
        alert(`¡"${course.title}" fue añadido a tu carrito!`);
        // Opcional: podrías actualizar el ícono del carrito en la barra de navegación aquí
      }
    } catch (error) {
      alert('Hubo un problema al añadir el curso al carrito.');
      console.error('Error adding to cart:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleWhatsAppPurchase = () => {
    // ... esta función no cambia ...
    if (!userData) {
        alert('Debes iniciar sesión para realizar la compra.');
        navigate('/login');
        return;
    }
    const message = encodeURIComponent(`¡Hola, ${OWNER_NAME}! 👋 Quisiera comprar ahora el curso "${course.title}".`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  // ... el resto de la lógica de renderizado no cambia ...
  const totalLessons = course?.modules?.flatMap(m => m.lessons).length ?? 0;
  const discountPercentage = 0.60;
  const originalPrice = course ? course.price / (1 - discountPercentage) : 0;
  const padTime = (time) => String(time).padStart(2, '0');

  if (loading) return ( <div className="detail-page-state"><FaSpinner className="icon-spin" /><span>Cargando Curso...</span></div> );
  if (error) return ( <div className="detail-page-state error"><FaInfoCircle /><h2 className="error-title">{error}</h2></div> );
  if (!course) return null;

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
                <Link to={`/instructor/${course.instructor}`} className="instructor-name-link">{course.instructor}</Link>
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