// src/contexts/CartContext.jsx (Código completo con lógica de añadir item)

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast'; // Usaremos toasts para una mejor UX

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { userData } = useAuth();

    const [isOpen, setIsOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCartItems = useCallback(async () => {
        if (!userData) {
            setCartItems([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('cart')
                .select(`
                    id, 
                    courses (
                        *,
                        users ( id, display_name )
                    )
                `)
                .eq('user_id', userData.id);
            if (error) throw error;
            const formattedData = data.map(item => ({
                cart_item_id: item.id,
                ...(item.courses || {}),
            }));
            setCartItems(formattedData);
        } catch (err) {
            console.error("Error fetching cart items:", err);
            setError("No se pudieron cargar los items del carrito.");
        } finally {
            setLoading(false);
        }
    }, [userData]);
    
    useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems]);

    // === NUEVA FUNCIÓN PARA AÑADIR UN ITEM AL CARRITO ===
    const addItem = async (course) => {
        if (!userData) {
            toast.error('Debes iniciar sesión para añadir cursos.');
            // Podríamos redirigir aquí, pero es mejor manejarlo en la página
            return { error: new Error('Usuario no autenticado') };
        }

        try {
            // Inserta el nuevo item en la base de datos
            const { data: newItem, error } = await supabase
                .from('cart')
                .insert({
                    user_id: userData.id,
                    course_id: course.id,
                })
                .select(`
                    id, 
                    courses (
                        *,
                        users ( id, display_name )
                    )
                `) // Pedimos que nos devuelva el item insertado con toda su info
                .single();
            
            if (error) {
                // Maneja el caso de que el item ya exista
                if (error.code === '23505') { 
                    toast.error('¡Este curso ya está en tu carrito!');
                    return { error };
                }
                throw error;
            }

            // Actualiza el estado local para una respuesta visual inmediata
            if (newItem) {
                const formattedNewItem = {
                    cart_item_id: newItem.id,
                    ...(newItem.courses || {})
                };
                setCartItems(prevItems => [...prevItems, formattedNewItem]);
                toast.success(`"${course.title}" fue añadido a tu carrito!`);
            }
            return { data: newItem, error: null }; // Devuelve éxito
        } catch (err) {
            console.error("Error adding item to cart:", err);
            toast.error('Hubo un problema al añadir el curso.');
            return { error: err }; // Devuelve fracaso
        }
    };

    const removeItem = async (cartItemId) => {
        try {
            const { error } = await supabase.from('cart').delete().eq('id', cartItemId);
            if (error) throw error;
            setCartItems(prevItems => prevItems.filter(item => item.cart_item_id !== cartItemId));
            toast.success('Curso eliminado del carrito.');
        } catch (err) {
            console.error("Error removing item from cart:", err);
            toast.error("No se pudo eliminar el curso del carrito.");
        }
    };
    
    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);

    const cartTotal = cartItems.reduce((total, item) => total + (item.price || 0), 0);

    const value = {
        isOpen,
        openCart,
        closeCart,
        cartItems,
        addItem, // <-- Exponemos la nueva función
        removeItem,
        loading,
        error,
        cartTotal
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};