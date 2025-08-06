// src/components/common/CartSidebar.jsx (Código completo y actualizado)

import React, { useState } from 'react'; // <-- Se añade useState
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../utils/formatters';
import { FaTimes, FaShoppingCart, FaTrash, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { WHATSAPP_NUMBER, OWNER_NAME } from '../../config'; // <-- 1. IMPORTAMOS LA CONFIGURACIÓN

// === Componente CartItem (Lógica mejorada) ===
const CartItem = ({ item }) => {
    const { removeItem } = useCart();
    const [isRemoving, setIsRemoving] = useState(false);

    const handleRemove = async () => {
        setIsRemoving(true);
        await removeItem(item.cart_item_id);
    };
    
    // Tu JSX para CartItem (el de la respuesta anterior está perfecto)
    return (
        <motion.div 
            className="cart-item-card"
            layout initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
        >
            <div className="cart-item-image-container"> <img src={item.imageUrl} alt={item.title} /> </div>
            <div className="cart-item-info">
                <h4 className="cart-item-title">{item.title}</h4>
                <p className="cart-item-instructor">{item.instructor}</p>
                <div className="cart-item-actions">
                    <span className="cart-item-price">{formatPrice(item.price)}</span>
                    <button onClick={handleRemove} disabled={isRemoving} className="cart-item-remove-btn">
                        {isRemoving ? <FaSpinner className="icon-spin" /> : <FaTrash />}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};


// === Componente Principal CartSidebar ===
const CartSidebar = () => {
    // 2. OBTENEMOS TODOS LOS DATOS NECESARIOS DEL CONTEXTO
    const { isOpen, closeCart, cartItems, cartTotal, loading } = useCart();

    // --- 3. NUEVA FUNCIÓN PARA FINALIZAR LA COMPRA DESDE EL CARRITO ---
    const handleCheckout = () => {
        if (cartItems.length === 0) return;

        // Construimos la lista de cursos para el mensaje
        const courseList = cartItems.map(item => `- ${item.title}`).join('\n');
        
        // Creamos el mensaje completo y dinámico
        const message = `¡Hola, ${OWNER_NAME}! 👋\n\nQuisiera finalizar la compra de los siguientes cursos:\n\n${courseList}\n\n*Total a pagar: ${formatPrice(cartTotal)}*\n\nQuedo a la espera de las instrucciones de pago. ¡Gracias!`;
        
        // Codificamos el mensaje para que sea seguro en una URL
        const encodedMessage = encodeURIComponent(message);
        
        // Abrimos la ventana de WhatsApp
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
    };


    return (
        <AnimatePresence>
            {isOpen && (
                <div className="cart-sidebar-container">
                    <motion.div 
                        className="cart-overlay" 
                        onClick={closeCart}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    ></motion.div>

                    <motion.div
                        className="cart-panel"
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        <header className="cart-header">
                            <h3>Tu Carrito</h3>
                            <button onClick={closeCart} className="cart-close-button"><FaTimes /></button>
                        </header>
                        
                        <div className="cart-content">
                            {loading && ( <div className="cart-state-message"><FaSpinner className="icon-spin"/> Cargando...</div> )}
                            {!loading && cartItems.length === 0 && (
                                <div className="cart-state-message">
                                    <FaShoppingCart className="icon-large"/>
                                    <h4>Tu carrito está vacío</h4>
                                    <p>Añade cursos para verlos aquí.</p>
                                </div>
                            )}
                            {!loading && cartItems.length > 0 && (
                                <div className="cart-items-list">
                                    <AnimatePresence>
                                        {cartItems.map(item => ( <CartItem key={item.cart_item_id} item={item} /> ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {cartItems.length > 0 && !loading && (
                            <footer className="cart-footer">
                                <div className="cart-total">
                                    <span>Total</span>
                                    <span>{formatPrice(cartTotal)}</span>
                                </div>
                                {/* --- 4. ASIGNAMOS LA NUEVA FUNCIÓN AL BOTÓN --- */}
                                <button onClick={handleCheckout} className="checkout-button">
                                    Finalizar Compra por WhatsApp
                                </button>
                            </footer>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CartSidebar;