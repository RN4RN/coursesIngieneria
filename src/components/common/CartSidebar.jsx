// src/components/common/CartSidebar.jsx (Código completo y actualizado)

import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../utils/formatters';
import { FaTimes, FaShoppingCart, FaTrash, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// === Componente CartItem (sin cambios, tu versión es correcta) ===
const CartItem = ({ item }) => {
    const { removeItem } = useCart();
    const [isRemoving, setIsRemoving] = new useState(false);

    const handleRemove = async () => {
        setIsRemoving(true);
        await removeItem(item.cart_item_id);
    };

    return (
        <motion.div 
            className="cart-item-card"
            layout initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
        >
            <div className="cart-item-image-container">
                 <img src={item.imageUrl} alt={item.title} />
            </div>
            <div className="cart-item-info">
                <h4 className="cart-item-title">{item.title}</h4>
                {/* Ahora el nombre del instructor viene desde el objeto 'users' anidado */}
                <p className="cart-item-instructor">{item.users?.display_name || item.instructor}</p>
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
    const { isOpen, closeCart, cartItems, cartTotal, loading } = useCart();

    const handleCheckout = () => {
        if (!cartItems || cartItems.length === 0) return;

        // La estrategia de contactar al instructor del primer item sigue siendo válida
        const firstItem = cartItems[0];
        const instructor = firstItem.users;

        if (!instructor || !instructor.phone_number) {
            alert('No se pudo encontrar la información de contacto del instructor para finalizar la compra. Por favor, intenta comprar el curso desde su página de detalle.');
            return;
        }

        const instructorName = instructor.display_name;
        const instructorPhone = instructor.phone_number;
        const courseList = cartItems.map(item => `- ${item.title}`).join('\n');
        const message = `¡Hola, ${instructorName}! 👋\n\nQuisiera finalizar la compra de los siguientes cursos de mi carrito:\n\n${courseList}\n\n*Total a pagar: ${formatPrice(cartTotal)}*\n\nQuedo a la espera de las instrucciones. ¡Gracias!`;
        const encodedMessage = encodeURIComponent(message);
        const cleanPhone = instructorPhone.replace(/\D/g, '');
        
        window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank');
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
                        
                        {/* --- ESTA ES LA SECCIÓN QUE FALTABA Y FUE RESTAURADA --- */}
                        <div className="cart-content">
                            {loading && (
                                <div className="cart-state-message">
                                    <FaSpinner className="icon-spin"/> Cargando...
                                </div>
                            )}
                            {!loading && (!cartItems || cartItems.length === 0) && (
                                <div className="cart-state-message">
                                    <FaShoppingCart className="icon-large"/>
                                    <h4>Tu carrito está vacío</h4>
                                    <p>¡Añade cursos para empezar a aprender!</p>
                                </div>
                            )}
                            {!loading && cartItems && cartItems.length > 0 && (
                                <div className="cart-items-list">
                                    <AnimatePresence>
                                        {cartItems.map(item => (
                                             <CartItem key={item.cart_item_id} item={item} />
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                        {/* ----------------------------------------------------------- */}

                        {cartItems && cartItems.length > 0 && !loading && (
                            <footer className="cart-footer">
                                <div className="cart-total">
                                    <span>Total</span>
                                    <span>{formatPrice(cartTotal)}</span>
                                </div>
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