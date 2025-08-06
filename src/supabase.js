// src/supabase.js
import { createClient } from '@supabase/supabase-js';

// --- PEGA TUS CREDENCIALES DE SUPABASE AQUÍ ---

// Esta es la URL de tu proyecto que copiaste en el paso anterior.
const supabaseUrl = 'https://chdheigcybymcsvfhsev.supabase.co'; 

// Esta es la clave 'anon public' que copiaste.
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoZGhlaWdjeWJ5bWNzdmZoc2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMzEwMTgsImV4cCI6MjA2NjgwNzAxOH0.YpESXmmmbXUHkgPjFlW27U7cayQzRXdTFfbVMWe0kZ8';


// --- CREACIÓN DEL CLIENTE DE CONEXIÓN ---

// Creamos una única instancia del cliente de Supabase.
// Esta es nuestra "conexión" a la base de datos.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);