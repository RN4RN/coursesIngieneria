import { initializeApp } from 'firebase/app';
// --- 1. IMPORTAMOS LOS NUEVOS PROVEEDORES ---
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  GithubAuthProvider
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TU CONFIGURACIÓN DE FIREBASE (SIN CAMBIOS)
const firebaseConfig = {
  apiKey: "AIzaSyCfV5T3dA68kg80suoxDvOdU7ZoD12JKv0",
  authDomain: "mi-plataforma-de-cursos.firebaseapp.com",
  projectId: "mi-plataforma-de-cursos",
  storageBucket: "mi-plataforma-de-cursos.firebasestorage.app",
  messagingSenderId: "286815477418",
  appId: "1:286815477418:web:6aad314d72dcfe94ebbad3",
  measurementId: "G-Q1F5BZZD7J"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios de Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// --- 2. EXPORTAMOS UNA INSTANCIA PARA CADA NUEVO PROVEEDOR ---
export const facebookProvider = new FacebookAuthProvider();
export const githubProvider = new GithubAuthProvider();
// -----------------------------------------------------------