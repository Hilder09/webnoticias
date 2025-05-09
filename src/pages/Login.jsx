import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Button,
  Typography,
  Box,
  Alert,
  TextField,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, error: authError, initialized } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!initialized) {
      setError('El sistema de autenticación se está inicializando. Por favor, espera un momento.');
      return;
    }

    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      console.log('Iniciando login de administrador...');
      const user = await login(email, password);
      console.log('Login exitoso:', {
        email: user.email,
        isAdmin: user.email === 'webnoticias@admin.com'
      });
      
      if (user.email !== 'webnoticias@admin.com') {
        setError('Esta cuenta no tiene permisos de administrador.');
        return;
      }
      
      navigate('/admin');
    } catch (err) {
      console.error('Error en login de administrador:', err);
      let mensajeError = 'Error al iniciar sesión. ';
      
      switch (err.code) {
        case 'auth/invalid-email':
          mensajeError += 'El correo electrónico no es válido.';
          break;
        case 'auth/user-not-found':
          mensajeError += 'No existe una cuenta con este correo.';
          break;
        case 'auth/wrong-password':
          mensajeError += 'Contraseña incorrecta.';
          break;
        case 'auth/too-many-requests':
          mensajeError += 'Demasiados intentos fallidos. Por favor, intenta más tarde.';
          break;
        default:
          mensajeError += 'Verifica tus credenciales e intenta nuevamente.';
      }
      
      setError(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!initialized) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
          <Typography color="white" sx={{ mt: 2 }}>
            Inicializando sistema de autenticación...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%', 
            backgroundColor: '#1e1e1e',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Typography 
            component="h1" 
            variant="h5" 
            align="center" 
            gutterBottom 
            color="white"
            sx={{ mb: 3 }}
          >
            Acceso Administrativo
          </Typography>
          
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

          <Box 
            component="form" 
            onSubmit={handleAdminLogin}
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2 
            }}
          >
            <TextField
              required
              fullWidth
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                },
              }}
            />

            <TextField
              required
              fullWidth
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2,
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#115293'
                },
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(25, 118, 210, 0.5)'
                }
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  <span>Iniciando sesión...</span>
                </Box>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 