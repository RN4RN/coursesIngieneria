// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Hooks y Servicios
import { useAuth } from '../contexts/AuthContext';
import { getAllCourses } from '../services/courseService';

// Componentes e Iconos
import CourseCard from '../components/common/CourseCard';
import { FaInfinity, FaPlayCircle, FaCheck, FaGithub, FaReact, FaArrowRight } from 'react-icons/fa'; // Añadimos FaArrowRight
import { SiAutodesk, SiPython } from "react-icons/si";
import { WorkspacePremium, BusinessCenter, PrecisionManufacturing, FormatQuote, AccountCircle } from '@mui/icons-material';

// --- Sub-componentes sin cambios ---
const FeatureCard = ({ icon, title, description, index }) => {
  const cardVariants = { hidden: { opacity: 0, y: 50, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, delay: index * 0.1, ease: "easeOut" } }};
  return (<motion.div className="feature-card-engineering" variants={cardVariants}><div className="feature-icon">{icon}</div><h3 className="feature-title">{title}</h3><p className="feature-description">{description}</p></motion.div>);
};
const TestimonialCard = ({ quote, name, role, image, index }) => {
  const cardVariants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.15 } } };
  return (<motion.div className="testimonial-card" variants={cardVariants}><FormatQuote className="testimonial-quote-icon" /><p className="testimonial-text">"{quote}"</p><div className="testimonial-author"><img src={image} alt={name} className="testimonial-avatar" /><div><h4 className="testimonial-name">{name}</h4><p className="testimonial-role">{role}</p></div></div></motion.div>);
};

// --- Componente Principal de la Página de Inicio ---
const HomePage = () => {
  const { currentUser } = useAuth();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      setLoading(true);
      try { const allCourses = await getAllCourses(); setFeaturedCourses(allCourses.slice(0, 4)); } catch (error) { console.error("Error al cargar cursos:", error); } finally { setLoading(false); }
    };
    fetchFeaturedCourses();
  }, []);

  const sectionContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" } } };
  const avatarVariants = { hidden: { opacity: 0, scale: 0.5 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: "spring", stiffness: 120 } } };

  // Una clase condicional para el Hero Section
  const heroClass = currentUser ? "hero-section epic logged-in" : "hero-section epic";

  return (
    <div className="homepage-container">

      {/* ===== HERO SECTION DINÁMICO MEJORADO ===== */}
      <motion.header className={heroClass} initial="hidden" animate="visible" variants={sectionContainer}>
        {/* Este nuevo div creará el efecto de superposición para la imagen */}
        <div className="hero-background-overlay"></div>
        
        <div className="hero-bg-shapes">
          {[...Array(5)].map((_, i) => <span key={i}></span>)}
        </div>

        <div className="hero-content">
          {currentUser ? (
            // VISTA PARA USUARIO LOGUEADO
            <>
              <motion.div variants={avatarVariants} className="hero-welcome-avatar">
                {currentUser.photoURL ? <img src={currentUser.photoURL} alt="Perfil" /> : <AccountCircle sx={{ fontSize: 'inherit', color: 'inherit' }} />}
              </motion.div>
              <motion.h1 className="hero-title welcome-title" variants={itemVariants}>
                ¡Bienvenido de nuevo, {currentUser.displayName || 'Ingeniero'}!
              </motion.h1>
              <motion.p className="hero-subtitle" variants={itemVariants}>
                Tu siguiente gran proyecto empieza aquí. Continúa donde lo dejaste o descubre un nuevo desafío.
              </motion.p>
              <motion.div variants={itemVariants}>
                <Link to="/mis-cursos" className="button-primary hero-button special-action">
                  Continuar Aprendiendo <FaArrowRight style={{ marginLeft: '10px' }}/>
                </Link>
              </motion.div>
            </>
          ) : (
            // VISTA PARA VISITANTES
            <>
              <motion.div variants={itemVariants}><PrecisionManufacturing sx={{ fontSize: '70px', color: 'var(--color-primary-light)', marginBottom: '1rem' }} /></motion.div>
              <motion.h1 className="hero-title" variants={itemVariants}>Construye el Futuro de la Ingeniería, Hoy.</motion.h1>
              <motion.p className="hero-subtitle" variants={itemVariants}>Tu plataforma de élite, diseñada por ingenieros para los futuros líderes de la industria y la tecnología.</motion.p>
              <motion.div variants={itemVariants}><Link to="/cursos" className="button-primary hero-button"><FaPlayCircle style={{ marginRight: '10px' }} /> Explorar Catálogo de Cursos</Link></motion.div>
            </>
          )}
        </div>
      </motion.header>
      
      {/* ===== RESTO DE LAS SECCIONES (SIN CAMBIOS EN LA ESTRUCTURA) ===== */}

      <motion.section className="logo-cloud-section" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionContainer}>
          <h4 className="logo-cloud-title">TECNOLOGÍAS Y SOFTWARE QUE DOMINARÁS</h4>
          <div className="logo-cloud-grid">
            <motion.div variants={itemVariants} className="logo-item"><SiPython size={35}/><span>Python</span></motion.div>
            <motion.div variants={itemVariants} className="logo-item"><FaReact size={35}/><span>React</span></motion.div>
            <motion.div variants={itemVariants} className="logo-item"><SiAutodesk size={35}/><span>AutoCAD</span></motion.div>
            <motion.div variants={itemVariants} className="logo-item"><FaGithub size={35}/><span>Git & GitHub</span></motion.div>
          </div>
      </motion.section>

      <motion.section className="engineering-section" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionContainer}>
        <motion.h2 variants={itemVariants} className="section-title-engineering">Una Formación de Vanguardia</motion.h2>
        <motion.p variants={itemVariants} className="section-subtitle-engineering">Todo lo que necesitas para una carrera de éxito garantizado.</motion.p>
        <div className="features-grid-engineering"><FeatureCard icon={<WorkspacePremium size={35} />} title="Instructores de Élite" description="Aprende de profesionales líderes con años de experiencia real en proyectos complejos." index={0}/><FeatureCard icon={<BusinessCenter size={35} />} title="Proyectos de Calibre Industrial" description="Aplica tus conocimientos en retos prácticos basados en desafíos del mundo real." index={1}/><FeatureCard icon={<FaInfinity size={35} />} title="Acceso y Actualizaciones de por Vida" description="Un solo pago te da acceso ilimitado al curso y a todas sus futuras mejoras." index={2}/></div>
      </motion.section>

      <motion.section className="testimonials-section" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={sectionContainer}>
         <motion.h2 variants={itemVariants} className="section-title-engineering">Lo que Dicen Nuestros Ingenieros</motion.h2>
         <div className="testimonials-grid"><TestimonialCard name="Elena García" role="Ingeniera de Software en Google" quote="La profundidad técnica de los cursos es inigualable. Pasé de tener conocimientos básicos de React a liderar proyectos en mi empresa." image="https://randomuser.me/api/portraits/women/44.jpg" index={0} /><TestimonialCard name="Carlos Mendoza" role="Ingeniero Civil, Constructora ACM" quote="El curso de diseño estructural avanzado me dio las herramientas que necesitaba para mi certificación profesional. 100% recomendado." image="https://randomuser.me/api/portraits/men/46.jpg" index={1} /></div>
      </motion.section>

      {!loading && featuredCourses.length > 0 && (
        <motion.section className="engineering-section-dark" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={sectionContainer}>
          <motion.h2 variants={itemVariants} className="section-title-engineering">Sumérgete en el Conocimiento</motion.h2>
          <motion.p variants={itemVariants} className="section-subtitle-engineering">Nuestros cursos más demandados te están esperando.</motion.p>
          <motion.div variants={sectionContainer} className="course-grid">{featuredCourses.map(course => ( <motion.div key={course.id} variants={itemVariants}><CourseCard course={course} /></motion.div> ))}</motion.div>
          <motion.div variants={itemVariants} className="text-center mt-20"><Link to="/cursos" className="button-secondary">Ver todos los cursos →</Link></motion.div>
        </motion.section>
      )}

      <motion.section className="final-cta-section" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={sectionContainer}>
        <motion.h2 variants={itemVariants} className="final-cta-title">¿Listo para Construir tu Futuro?</motion.h2>
        <motion.p variants={itemVariants} className="final-cta-subtitle">Únete a miles de ingenieros que están transformando sus carreras.</motion.p>
        <motion.div variants={itemVariants}><Link to={currentUser ? "/cursos" : "/registro"} className="button-primary final-cta-button">{currentUser ? "Descubrir Más Cursos" : "Crear Mi Cuenta Gratis"}</Link></motion.div>
      </motion.section>
    </div>
  );
};

export default HomePage;