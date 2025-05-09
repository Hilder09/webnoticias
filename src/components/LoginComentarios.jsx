import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  Divider,
  CircularProgress
} from '@mui/material';
import { Facebook, Google } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const LoginComentarios = ({ onLoginSuccess }) => {
  const { loginWithGoogle, loginWithFacebook, error: authError, initialized } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFacebookLogin = async () => {
    if (!initialized) {
      setError('El sistema de autenticación se está inicializando. Por favor, espera un momento.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      console.log('Iniciando login con Facebook...');
      const user = await loginWithFacebook();
      onLoginSuccess?.(user);
    } catch (err) {
      console.error('Error en login con Facebook:', err);
      // El error lo maneja el contexto
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!initialized) {
      setError('El sistema de autenticación se está inicializando. Por favor, espera un momento.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      console.log('Iniciando login con Google...');
      const user = await loginWithGoogle();
      onLoginSuccess?.(user);
    } catch (err) {
      console.error('Error en login con Google:', err);
      // El error lo maneja el contexto
    } finally {
      setLoading(false);
    }
  };

  if (!initialized) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="white">
          Inicializando...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {(error || authError) && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            backgroundColor: 'rgba(211, 47, 47, 0.1)',
            color: '#ff8a80'
          }}
          onClose={() => setError('')}
        >
          {error || authError}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<Facebook />}
          onClick={handleFacebookLogin}
          disabled={loading}
          sx={{
            backgroundColor: '#1877F2',
            '&:hover': {
              backgroundColor: '#0d6efd'
            },
            '&.Mui-disabled': {
              backgroundColor: 'rgba(24, 119, 242, 0.5)'
            }
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              <span>Iniciando sesión...</span>
            </Box>
          ) : (
            'Continuar con Facebook'
          )}
        </Button>

        <Button
          fullWidth
          variant="contained"
          startIcon={<Google />}
          onClick={handleGoogleLogin}
          disabled={loading}
          sx={{
            backgroundColor: '#DB4437',
            '&:hover': {
              backgroundColor: '#c23321'
            },
            '&.Mui-disabled': {
              backgroundColor: 'rgba(219, 68, 55, 0.5)'
            }
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              <span>Iniciando sesión...</span>
            </Box>
          ) : (
            'Continuar con Google'
          )}
        </Button>

        <Divider sx={{ 
          my: 1, 
          color: 'rgba(255,255,255,0.5)',
          '&::before, &::after': {
            borderColor: 'rgba(255,255,255,0.1)',
          }
        }}>
          <Typography color="rgba(255,255,255,0.5)" variant="body2">
            O continúa como invitado
          </Typography>
        </Divider>

        <Typography 
          variant="body2" 
          align="center" 
          sx={{ 
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.75rem'
          }}
        >
          Al iniciar sesión, aceptas nuestros términos y condiciones.
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginComentarios; 