import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Configurar persistencia al inicio
  useEffect(() => {
    const setupAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
        console.log('Persistencia de autenticación configurada');
        setInitialized(true);
      } catch (error) {
        console.error('Error al configurar la persistencia:', error);
        setError('Error al inicializar la autenticación');
      }
    };
    setupAuth();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (!initialized) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Estado de autenticación cambiado:', user ? 'Usuario autenticado' : 'No autenticado');
      if (user) {
        console.log('Información del usuario:', {
          email: user.email,
          isAdmin: user.email === 'webnoticias@admin.com'
        });
      }
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [initialized]);

  // Iniciar sesión con email y contraseña
  const login = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      return result.user;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError(error.message);
      throw error;
    }
  };

  // Iniciar sesión con Google
  const loginWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      return result.user;
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      setError(error.message);
      throw error;
    }
  };

  // Iniciar sesión con Facebook
  const loginWithFacebook = async () => {
    if (!initialized) {
      setError('El sistema de autenticación no está listo');
      return;
    }

    try {
      setError(null);
      console.log('Iniciando proceso de login con Facebook...');
      
      const provider = new FacebookAuthProvider();
      
      // Configurar los permisos requeridos
      provider.addScope('email');
      provider.addScope('public_profile');
      
      // Forzar re-autenticación
      provider.setCustomParameters({
        'auth_type': 'reauthenticate',
        'display': 'popup'
      });

      console.log('Abriendo popup de Facebook...');
      const result = await signInWithPopup(auth, provider);
      
      console.log('Login con Facebook exitoso:', {
        user: result.user.email,
        provider: result.providerId,
        token: result.credential?.accessToken ? 'Token recibido' : 'No token'
      });

      setUser(result.user);
      return result.user;
    } catch (error) {
      console.error('Error detallado al iniciar sesión con Facebook:', {
        code: error.code,
        message: error.message,
        email: error.email,
        credential: error.credential
      });

      let errorMessage;
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Ventana cerrada. Por favor, intenta nuevamente.';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Ventana bloqueada. Por favor, permite ventanas emergentes y reintenta.';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Operación cancelada. Por favor, intenta nuevamente.';
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'Ya existe una cuenta con este email. Intenta otro método de inicio de sesión.';
          break;
        case 'auth/configuration-not-found':
          errorMessage = 'Error de configuración. Por favor, contacta al administrador. (FB-001)';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Error de conexión. Verifica tu internet y reintenta.';
          break;
        default:
          errorMessage = `Error inesperado: ${error.message}`;
      }
      
      setError(errorMessage);
      throw error;
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setError(error.message);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    initialized,
    login,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    isAdmin: user?.email === 'webnoticias@admin.com'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 