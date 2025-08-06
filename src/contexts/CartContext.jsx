import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { useAuth } from './AuthContext';

// 1. Crear el contexto
const CartContext = createContext();

// 2. Crear el hook personalizado para consumirlo fácilmente
export const useCart = () => useContext(CartContext);

// 3. Crear el Proveedor del Contexto
export const CartProvider = ({ children }) => {
    const { userData } = useAuth(); // Usamos el contexto de autenticación para saber quién es el usuario

    const [isOpen, setIsOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- FUNCIÓN PARA OBTENER LOS ITEMS DEL CARRITO DESDE SUPABASE ---
    const fetchCartItems = useCallback(async () => {
        if (!userData) {
            setCartItems([]); // Si no hay usuario, el carrito está vacío
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Esta es la consulta clave: seleccionamos los items del carrito Y hacemos un JOIN
            // para obtener toda la información de los cursos asociados.
            const { data, error } = await supabase
                .from('cart')
                .select(`
                    id, 
                    course_id,
                    courses (*)
                `)
                .eq('user_id', userData.id);

            if (error) throw error;
            
            // Transformamos los datos para que sean más fáciles de usar
            const formattedData = data.map(item => ({
                cart_item_id: item.id,
                ...item.courses,
            }));

            setCartItems(formattedData);

        } catch (err) {
            console.error("Error fetching cart items:", err);
            setError("No se pudieron cargar los items del carrito.");
        } finally {
            setLoading(false);
        }
    }, [userData]); // Se volverá a ejecutar si el usuario cambia (login/logout)


    // --- FUNCIÓN PARA ABRIR EL CARRITO ---
    const openCart = () => {
        fetchCartItems(); // Cada vez que se abre, se actualizan los datos.
        setIsOpen(true);
    };

    // --- FUNCIÓN PARA CERRAR EL CARRITO ---
    const closeCart = () => setIsOpen(false);

    // --- FUNCIÓN PARA ELIMINAR UN ITEM DEL CARRITO ---
    const removeItem = async (cartItemId) => {
        try {
            const { error } = await supabase
                .from('cart')
                .delete()
                .eq('id', cartItemId);

            if (error) throw error;

            // Actualizamos el estado local para una respuesta instantánea
            setCartItems(prevItems => prevItems.filter(item => item.cart_item_id !== cartItemId));
        } catch (err) {
            console.error("Error removing item from cart:", err);
            alert("No se pudo eliminar el curso del carrito.");
        }
    };
    
    // Calcula el total del carrito
    const cartTotal = cartItems.reduce((total, item) => total + (item.price || 0), 0);

    // useEffect para cargar el carrito inicial (sin abrirlo) y así poder mostrar el contador en el Navbar
    useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems]);


    // El valor que se comparte con toda la app
    const value = {
        isOpen,
        openCart,
        closeCart,
        cartItems,
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