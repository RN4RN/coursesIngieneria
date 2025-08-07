// src/pages/HomePage.jsx (Código completo, ampliado y 100% compatible)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Hooks y Servicios
import { useAuth } from '../contexts/AuthContext';
import { getAllCourses } from '../services/courseService';

// Componentes e Iconos (Sin cambios aquí)
import CourseCard from '../components/common/CourseCard';
import { FaInfinity, FaPlayCircle, FaCheck, FaGithub, FaReact, FaArrowRight, FaArrowDown } from 'react-icons/fa'; 
import { SiAutodesk, SiPython } from "react-icons/si";
import { WorkspacePremium, BusinessCenter, PrecisionManufacturing, FormatQuote, AccountCircle, Public } from '@mui/icons-material';

// --- NUEVO SUB-COMPONENTE PARA LAS DISCIPLINAS, USA ÍCONOS QUE YA TIENES ---
const DisciplineCard = ({ icon, title, description, index }) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.1 } }
    };
    return (
        <motion.div className="discipline-card" variants={cardVariants}>
            <div className="discipline-icon">{icon}</div>
            <h3 className="discipline-title">{title}</h3>
            <p className="discipline-description">{description}</p>
        </motion.div>
    );
};

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

  const sectionContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" } } };
  const avatarVariants = { hidden: { opacity: 0, scale: 0.5 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: "spring", stiffness: 120 } } };

  const heroClass = currentUser ? "hero-section epic logged-in" : "hero-section epic";

  return (
    <div className="homepage-container">

      {/* ===== HERO SECTION CON TEXTO MODIFICADO ===== */}
      <motion.header className={heroClass} initial="hidden" animate="visible" variants={sectionContainer}>
        <div className="hero-background-overlay"></div>
        <div className="hero-bg-shapes">{[...Array(5)].map((_, i) => <span key={i}></span>)}</div>
        <div className="hero-content">
          {currentUser ? (
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
            <>
              <motion.div variants={itemVariants}><PrecisionManufacturing sx={{ fontSize: '70px', color: 'var(--color-primary-light)', marginBottom: '1rem' }} /></motion.div>
              <motion.h1 className="hero-title" variants={itemVariants}>
                  Ingeniería Que Transforma el Mundo.
              </motion.h1>
              <motion.p className="hero-subtitle" variants={itemVariants}>
                  Domina las herramientas y principios que definen el futuro de la ingeniería civil, mecánica, industrial y de software.
              </motion.p>
              
              <motion.div className="hero-button-wrapper" variants={itemVariants}>
                <Link to="/cursos" className="button-primary hero-button">
                  <FaPlayCircle style={{ marginRight: '10px' }} /> Explorar Catálogo
                </Link>
                <motion.div className="scroll-down-indicator" animate={{ y: [0, 15, 0], opacity: [1, 0.5, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
                  <FaArrowDown />
                </motion.div>
              </motion.div>
            </>
          )}
        </div>
      </motion.header>

      {/* ===== SECCIÓN QUIÉNES SOMOS ===== */}
      <motion.section
        className="about-us-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionContainer}
      >
        <motion.h2 variants={itemVariants} className="section-title-engineering">
          ¿Quiénes Somos?
        </motion.h2>
        <motion.p variants={itemVariants} className="section-subtitle-engineering">
          Somos una comunidad apasionada por la ingeniería y la educación. Nuestro objetivo es democratizar el acceso a formación de calidad, conectando a estudiantes y profesionales con expertos de la industria y recursos de vanguardia. Creemos en el aprendizaje práctico, la innovación y el crecimiento profesional continuo.
        </motion.p>
      </motion.section>

      {/* ===== NUEVA SECCIÓN: DISCIPLINAS DE INGENIERÍA ===== */}
      <motion.section className="engineering-disciplines-section" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionContainer}>
          <motion.h2 variants={itemVariants} className="section-title-engineering">Explora las Ramas Clave de la Ingeniería</motion.h2>
          <div className="disciplines-grid">
  <DisciplineCard
    icon={<PrecisionManufacturing sx={{ fontSize: '40px' }} />}
    title="Ingeniería Civil y Estructural"
    description="Diseña y construye la infraestructura del mañana. Domina el análisis estructural y la gestión de proyectos complejos."
    index={0}
  />
  <DisciplineCard
    icon={<BusinessCenter sx={{ fontSize: '40px' }} />}
    title="Ingeniería Industrial"
    description="Optimiza procesos, gestiona recursos y lidera la mejora continua en la industria."
    index={1}
  />
  <DisciplineCard
    icon={<FaReact size={40} />}
    title="Ingeniería de Software"
    description="Desarrolla aplicaciones, sistemas y soluciones digitales para el mundo moderno."
    index={2}
  />
  <DisciplineCard
    icon={<SiPython size={40} />}
    title="Ingeniería Mecánica"
    description="Domina el diseño y análisis de sistemas mecánicos, termodinámica y manufactura avanzada."
    index={3}
  />
  <DisciplineCard
    icon={<SiAutodesk size={40} />}
    title="Ingeniería Eléctrica"
    description="Aprende sobre circuitos, automatización, robótica y energías renovables."
    index={4}
  />
  <DisciplineCard
    icon={<FaGithub size={40} />}
    title="Ingeniería en Telecomunicaciones"
    description="Explora redes, sistemas de comunicación y tecnologías inalámbricas."
    index={5}
  />
  <DisciplineCard
    icon={<WorkspacePremium sx={{ fontSize: '40px' }} />}
    title="Ingeniería Ambiental"
    description="Gestiona recursos naturales, sostenibilidad y soluciones para el cambio climático."
    index={6}
  />
  <DisciplineCard
    icon={<Public sx={{ fontSize: '40px' }} />}
    title="Ingeniería Química"
    description="Transforma materias primas en productos útiles. Aprende procesos industriales y control de calidad."
    index={7}
  />
  <DisciplineCard
    icon={<FaInfinity size={40} />}
    title="Ingeniería Biomédica"
    description="Desarrolla tecnología para la salud, dispositivos médicos y soluciones innovadoras."
    index={8}
  />
  <DisciplineCard
    icon={<FaCheck size={40} />}
    title="Ingeniería en Energías Renovables"
    description="Especialízate en energía solar, eólica, hidráulica y nuevas fuentes limpias."
    index={9}
  />
  <DisciplineCard
    icon={<FaArrowRight size={40} />}
    title="Ingeniería Aeroespacial"
    description="Participa en el diseño y desarrollo de aeronaves, satélites y tecnología espacial."
    index={10}
  />
  <DisciplineCard
    icon={<FaArrowDown size={40} />}
    title="Ingeniería en Sistemas"
    description="Gestiona infraestructuras tecnológicas, redes y sistemas de información."
    index={11}
  />
  <DisciplineCard
    icon={<AccountCircle sx={{ fontSize: '40px' }} />}
    title="Ingeniería Industrial Alimentaria"
    description="Optimiza procesos de producción y control de calidad en la industria alimentaria."
    index={12}
  />
  <DisciplineCard
    icon={<FormatQuote sx={{ fontSize: '40px' }} />}
    title="Otras Ingenierías"
    description="Encuentra cursos de muchas más ramas y especialidades."
    index={13}
  />
</div>
      </motion.section>
      
      {/* ===== RESTO DE LAS SECCIONES (Contenido Original) ===== */}
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
        <div className="features-grid-engineering">
          <FeatureCard
            icon={<WorkspacePremium sx={{ fontSize: '35px' }} />}
            title="Instructores de Élite"
            description="Aprende de profesionales líderes con años de experiencia real en proyectos complejos."
            index={0}
          />
          <FeatureCard
            icon={<BusinessCenter sx={{ fontSize: '35px' }} />}
            title="Proyectos de Calibre Industrial"
            description="Aplica tus conocimientos en retos prácticos basados en desafíos del mundo real."
            index={1}
          />
          <FeatureCard
            icon={<FaInfinity size={35} />}
            title="Acceso y Actualizaciones de por Vida"
            description="Un solo pago te da acceso ilimitado al curso y a todas sus futuras mejoras."
            index={2}
          />
          <FeatureCard
            icon={<FaGithub size={35} />}
            title="Certificaciones Internacionales"
            description="Obtén certificados reconocidos por empresas y universidades de todo el mundo."
            index={3}
          />
          <FeatureCard
            icon={<FaReact size={35} />}
            title="Laboratorios Virtuales"
            description="Experimenta con simuladores y herramientas digitales para aprender haciendo."
            index={4}
          />
          <FeatureCard
            icon={<SiPython size={35} />}
            title="Comunidad Global"
            description="Conecta con miles de estudiantes y expertos en ingeniería para compartir ideas y resolver dudas."
            index={5}
          />
          <FeatureCard
            icon={<SiAutodesk size={35} />}
            title="Mentorías Personalizadas"
            description="Recibe orientación directa de mentores para acelerar tu desarrollo profesional."
            index={6}
          />
          <FeatureCard
            icon={<WorkspacePremium sx={{ fontSize: '35px' }} />}
            title="Bolsa de Trabajo y Prácticas"
            description="Accede a oportunidades laborales y pasantías exclusivas para estudiantes destacados."
            index={7}
          />
        </div>
      </motion.section>

      {/* SECCIÓN DE TESTIMONIOS AMPLIADA */}
      <motion.section className="testimonials-section" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={sectionContainer}>
         <motion.h2 variants={itemVariants} className="section-title-engineering">Lo que Dicen Nuestros Futuros Líderes</motion.h2>
         <div className="testimonials-grid">
            <TestimonialCard name="Elena García" role="Ingeniera de Software en Google" quote="La profundidad técnica de los cursos es inigualable. Pasé de tener conocimientos básicos de React a liderar proyectos en mi empresa." image="https://randomuser.me/api/portraits/women/44.jpg" index={0} />
            <TestimonialCard name="Carlos Mendoza" role="Ingeniero Civil, Constructora ACM" quote="El curso de diseño estructural avanzado me dio las herramientas que necesitaba para mi certificación profesional. 100% recomendado." image="https://randomuser.me/api/portraits/men/46.jpg" index={1} />
            <TestimonialCard name="Sofía Torres" role="Ingeniera Industrial en Kimberly-Clark" quote="Gracias al curso de optimización de procesos, pude liderar un proyecto que incrementó la eficiencia de nuestra línea de producción en un 15%." image="https://randomuser.me/api/portraits/women/3.jpg" index={2} />
         </div>
      </motion.section>

      {!loading && featuredCourses.length > 0 && (
        <motion.section className="engineering-section-dark" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={sectionContainer}>
          <motion.h2 variants={itemVariants} className="section-title-engineering">Sumérgete en el Conocimiento</motion.h2>
          <motion.p variants={itemVariants} className="section-subtitle-engineering">Nuestros cursos más demandados te están esperando.</motion.p>
          <div className="course-grid">{featuredCourses.map(course => ( <motion.div key={course.id} variants={itemVariants}><CourseCard course={course} /></motion.div> ))}</div>
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