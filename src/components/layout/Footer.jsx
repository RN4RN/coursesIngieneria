// src/components/layout/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Importa los iconos que usarás
import { School } from '@mui/icons-material';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

// Variantes de animación para una entrada suave
const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const Footer = () => {
  return (
    <motion.footer 
      className="site-footer"
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="footer-content">
        
        {/* COLUMNA 1: MARCA Y REDES SOCIALES */}
        <div className="footer-column footer-brand-info">
          <Link to="/" className="footer-logo">
            <School sx={{ fontSize: '32px' }} />
            <span>CursosOnline</span>
          </Link>
          <p className="footer-description">
            Tu plataforma de élite, diseñada por ingenieros para los futuros líderes de la industria y la tecnología.
          </p>
          <div className="footer-social-links">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="GitHub">
              <FaGithub />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* COLUMNA 2: NAVEGACIÓN */}
        <div className="footer-column">
          <h4 className="footer-column-title">Explorar</h4>
          <ul className="footer-link-list">
            <li><Link to="/cursos">Catálogo de Cursos</Link></li>
            <li><Link to="/#testimonials">Testimonios</Link></li>
            <li><Link to="/instructors">Instructores</Link></li>
            <li><Link to="/about">Sobre Nosotros</Link></li>
          </ul>
        </div>

        {/* COLUMNA 3: SOPORTE */}
        <div className="footer-column">
          <h4 className="footer-column-title">Soporte</h4>
          <ul className="footer-link-list">
            <li><Link to="/contact">Contacto</Link></li>
            <li><Link to="/faq">Preguntas Frecuentes</Link></li>
            <li><Link to="/community">Comunidad</Link></li>
          </ul>
        </div>

        {/* COLUMNA 4: LEGAL */}
        <div className="footer-column">
          <h4 className="footer-column-title">Legal</h4>
          <ul className="footer-link-list">
            <li><Link to="/terms">Términos de Servicio</Link></li>
            <li><Link to="/privacy">Política de Privacidad</Link></li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom-bar">
        <p>© {new Date().getFullYear()} CursosOnline. Todos los derechos reservados.</p>
        <p>Impulsado por la mejor tecnología para ingenieros.</p>
      </div>

    </motion.footer>
  );
};

export default Footer;