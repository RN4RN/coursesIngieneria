// src/components/common/CourseCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  // Verificamos si tenemos un curso válido. Si no, no renderizamos nada para evitar errores.
  if (!course) {
    return null;
  }

  // Desestructuramos las propiedades del curso para un código más limpio.
  const { id, title, instructor, price, imageUrl, category } = course;
  
  // Una imagen de respaldo genérica y de buena calidad si 'imageUrl' no existe.
  const placeholderImage = 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

  return (
    // Cada tarjeta es un enlace a la página de detalle.
    // Usamos las nuevas clases semánticas.
    <Link to={`/curso/${id}`} className="course-card">

        {/* 1. Contenedor de la Imagen: Controla el tamaño y el aspect ratio. */}
        <div className="course-card-image-wrapper">
            
            {/* Div con background-image para control total sobre la imagen. */}
            <div 
                className="course-card-image"
                style={{ backgroundImage: `url(${imageUrl || placeholderImage})` }}
                aria-label={`Portada del curso ${title}`} // Bueno para accesibilidad
            ></div>
            
            {/* La etiqueta de la categoría, ahora sobre la imagen. */}
            <div className="course-card-category-tag">
              {category || 'General'}
            </div>
        </div>

        {/* 2. Contenedor del Contenido de texto. */}
        <div className="course-card-content">
          <h3 className="course-card-title">
            {title || 'Título del curso no disponible'}
          </h3>
          <p className="course-card-instructor">
            Por {instructor || 'Instructor Desconocido'}
          </p>

          {/* 3. El footer de la tarjeta, con el precio y el link de detalles. */}
          <div className="course-card-footer">
            <span className="course-card-price">
              ${price != null ? price.toFixed(2) : '0.00'}
            </span>
            <span className="course-card-details-link">
              Ver detalles →
            </span>
          </div>
        </div>
    </Link>
  );
};

export default CourseCard;