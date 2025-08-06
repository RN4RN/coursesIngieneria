// src/pages/CoursesPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { getAllCourses } from '../services/courseService';
import CourseCard from '../components/common/CourseCard';
import { FaSpinner, FaSearch, FaExclamationCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// --- SUB-COMPONENTE: ENCABEZADO DE PÁGINA ---
const PageHeader = () => (
    <div className="courses-page-header">
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            Catálogo de Cursos de Ingeniería
        </motion.h1>
        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="header-subtitle"
        >
            Explora las disciplinas que están construyendo el futuro. Filtra por categoría o busca tu próxima habilidad.
        </motion.p>
    </div>
);

// --- SUB-COMPONENTE: FILTROS DE CATEGORÍA VISUALES ---
const CategoryFilters = ({ categories, selectedCategory, onSelectCategory }) => (
    <div className="category-filters">
        {categories.map(cat => (
            <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`category-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
            >
                {cat}
                {selectedCategory === cat && (
                    <motion.div className="active-filter-pill" layoutId="activePill" />
                )}
            </button>
        ))}
    </div>
);


const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try { const data = await getAllCourses(); setCourses(data); setError(null); } 
      catch (err) { console.error("Error en Cursos:", err); setError("No se pudieron cargar los cursos."); } 
      finally { setLoading(false); }
    };
    fetchCourses();
  }, []);

  const categories = useMemo(() => {
    const allCategories = new Set(courses.map(course => course.category));
    return ['All', ...allCategories];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
        const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });
  }, [courses, searchTerm, selectedCategory]);

  return (
    <div className="courses-page-container">
      
      <PageHeader />

      <div className="courses-content-wrapper">
        {/* --- BARRA DE BÚSQUEDA Y FILTROS REDISEÑADA --- */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="filter-bar"
        >
            <div className="search-input-wrapper">
                <FaSearch className="search-icon" />
                <input 
                    type="text"
                    placeholder="Busca por título: 'React', 'Estructuras'..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>
            <CategoryFilters 
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />
        </motion.div>
        
        {/* --- MOSTRADOR DE RESULTADOS --- */}
        <div className="results-info">
            {!loading && !error && (
                <p>Mostrando {filteredCourses.length} de {courses.length} cursos.</p>
            )}
        </div>

        {/* --- CONTENEDOR DE RESULTADOS --- */}
        <div className="courses-grid-wrapper">
          {loading && (
            <div className="empty-state-message">
              <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700">Cargando cursos...</h2>
            </div>
          )}

          {error && (
             <div className="empty-state-message error">
                 <FaExclamationCircle className="text-5xl text-red-500 mb-4"/>
                 <h2 className="text-2xl font-semibold">¡Ups! Algo salió mal.</h2>
                 <p>{error}</p>
             </div>
         )}

         {!loading && !error && (
              <AnimatePresence mode="wait">
                  {filteredCourses.length > 0 ? (
                      <motion.div 
                          key="course-list"
                          initial="hidden"
                          animate="visible"
                          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                          className="courses-grid"
                      >
                      {filteredCourses.map(course => (
                          <motion.div
                              key={course.id}
                              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                              className="course-card-wrapper-motion"
                          >
                              <CourseCard course={course} />
                          </motion.div>
                      ))}
                      </motion.div>
                  ) : (
                      <motion.div
                          key="no-results" 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="empty-state-message"
                      >
                          <h2 className="text-2xl font-semibold text-gray-700">No se encontraron resultados</h2>
                          <p className="text-gray-600 mt-2">Prueba con otra búsqueda o selecciona una categoría diferente.</p>
                      </motion.div>
                  )}
              </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;