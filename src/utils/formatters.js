// src/utils/formatters.js

/**
 * Formatea un número al estilo de moneda peruana (PEN).
 * Muestra 'Gratis' si el precio es 0 o nulo.
 * @param {number | null | undefined} price El precio a formatear.
 * @returns {string} El precio formateado como 'S/ 120.00' o 'Gratis'.
 */
export const formatPrice = (price) => {
    // Si el precio es 0 o no está definido, retorna 'Gratis'
    if (!price || price === 0) {
        return 'Gratis';
    }
    
    // Usa la API de Internacionalización para el formato de Soles (Perú)
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
    }).format(price);
};