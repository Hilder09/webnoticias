import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBYUM2lDisj61wdGpcegeHfDE_ZIPhDJFc",
  authDomain: "pagina-noticias-55959.firebaseapp.com",
  projectId: "pagina-noticias-55959",
  storageBucket: "pagina-noticias-55959.appspot.com",
  messagingSenderId: "957034266127",
  appId: "1:957034266127:web:d88f23cfeefb7862d2ed7a",
  measurementId: "G-TZRFJNZJT1"
};

// Inicializar Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase inicializado correctamente');
} catch (error) {
  console.error('Error al inicializar Firebase:', error);
}

// Inicializar servicios de Firebase
const auth = getAuth(app);

// Configuración adicional para desarrollo local
if (window.location.hostname === 'localhost') {
  console.log('Ejecutando en localhost - Configuración de desarrollo');
  // Aquí puedes agregar configuración específica para desarrollo
}

// Configurar el dominio de autenticación
auth.useDeviceLanguage(); // Usar el idioma del dispositivo

// Log del estado de autenticación para depuración
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('Usuario autenticado:', {
      email: user.email,
      uid: user.uid,
      providerId: user.providerData[0]?.providerId
    });
  } else {
    console.log('Usuario no autenticado');
  }
});

export { auth };
export const db = getFirestore(app);
export default app; 