import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { MoreVert as MoreVertIcon, Send as SendIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import LoginComentarios from './LoginComentarios';

const Comentarios = ({ noticiaId }) => {
  const { user } = useAuth();
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [comentarioSeleccionado, setComentarioSeleccionado] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editando, setEditando] = useState(false);
  const [comentarioEditado, setComentarioEditado] = useState('');

  useEffect(() => {
    cargarComentarios();
  }, [noticiaId]);

  const cargarComentarios = async () => {
    try {
      // Aquí implementaremos la carga de comentarios desde Firebase
      // Por ahora usaremos datos de ejemplo
      const comentariosEjemplo = [
        {
          id: 1,
          texto: '¡Excelente artículo!',
          usuario: {
            id: 'user1',
            nombre: 'Usuario Ejemplo',
            avatar: 'https://via.placeholder.com/40'
          },
          fecha: new Date().toISOString(),
        }
      ];
      setComentarios(comentariosEjemplo);
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
    }
  };

  const handleEnviarComentario = async () => {
    if (!nuevoComentario.trim() || !user) return;

    try {
      const nuevoComentarioObj = {
        id: Date.now(), // Temporal, se reemplazará con el ID de Firebase
        texto: nuevoComentario,
        usuario: {
          id: user.uid,
          nombre: user.displayName || 'Usuario Anónimo',
          avatar: user.photoURL || 'https://via.placeholder.com/40'
        },
        fecha: new Date().toISOString()
      };

      // Aquí implementaremos la lógica para guardar en Firebase
      setComentarios([...comentarios, nuevoComentarioObj]);
      setNuevoComentario('');
    } catch (error) {
      console.error('Error al enviar comentario:', error);
    }
  };

  const handleMenuClick = (event, comentario) => {
    setAnchorEl(event.currentTarget);
    setComentarioSeleccionado(comentario);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setComentarioSeleccionado(null);
  };

  const handleEditar = () => {
    setEditando(true);
    setComentarioEditado(comentarioSeleccionado.texto);
    handleMenuClose();
    setOpenDialog(true);
  };

  const handleEliminar = () => {
    handleMenuClose();
    setOpenDialog(true);
  };

  const confirmarEliminar = async () => {
    try {
      // Aquí implementaremos la eliminación en Firebase
      const nuevosComentarios = comentarios.filter(c => c.id !== comentarioSeleccionado.id);
      setComentarios(nuevosComentarios);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
    }
  };

  const confirmarEdicion = async () => {
    try {
      // Aquí implementaremos la edición en Firebase
      const nuevosComentarios = comentarios.map(c =>
        c.id === comentarioSeleccionado.id
          ? { ...c, texto: comentarioEditado }
          : c
      );
      setComentarios(nuevosComentarios);
      setOpenDialog(false);
      setEditando(false);
    } catch (error) {
      console.error('Error al editar comentario:', error);
    }
  };

  const handleLoginSuccess = (user) => {
    console.log('Usuario autenticado:', user);
    // Puedes realizar acciones adicionales después del login si es necesario
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom color="white">
        Comentarios
      </Typography>

      {user ? (
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Avatar src={user.photoURL} alt={user.displayName} />
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              placeholder="Escribe un comentario..."
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleEnviarComentario}
              disabled={!nuevoComentario.trim()}
              sx={{ mt: 1, float: 'right' }}
            >
              Enviar
            </Button>
          </Box>
        </Box>
      ) : (
        <Paper 
          sx={{ 
            p: 3, 
            mb: 3, 
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Typography 
            variant="h6" 
            color="white" 
            gutterBottom 
            sx={{ mb: 2 }}
          >
            Inicia sesión para comentar
          </Typography>
          <LoginComentarios onLoginSuccess={handleLoginSuccess} />
        </Paper>
      )}

      <Box sx={{ mt: 4 }}>
        {comentarios.map((comentario) => (
          <Paper
            key={comentario.id}
            sx={{
              p: 2,
              mb: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar src={comentario.usuario.avatar} alt={comentario.usuario.nombre} />
                <Box>
                  <Typography variant="subtitle2" color="white">
                    {comentario.usuario.nombre}
                  </Typography>
                  <Typography variant="caption" color="gray">
                    {new Date(comentario.fecha).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
              {user && user.uid === comentario.usuario.id && (
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuClick(e, comentario)}
                  sx={{ color: 'white' }}
                >
                  <MoreVertIcon />
                </IconButton>
              )}
            </Box>
            <Typography color="white" sx={{ ml: 5 }}>
              {comentario.texto}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditar}>Editar</MenuItem>
        <MenuItem onClick={handleEliminar}>Eliminar</MenuItem>
      </Menu>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          style: {
            backgroundColor: '#1e1e1e',
            color: 'white'
          }
        }}
      >
        {editando ? (
          <>
            <DialogTitle>Editar comentario</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={comentarioEditado}
                onChange={(e) => setComentarioEditado(e.target.value)}
                sx={{
                  mt: 2,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                  },
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
              <Button onClick={confirmarEdicion} variant="contained" color="primary">
                Guardar
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>Eliminar comentario</DialogTitle>
            <DialogContent>
              <Typography>¿Estás seguro de que deseas eliminar este comentario?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
              <Button onClick={confirmarEliminar} variant="contained" color="error">
                Eliminar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Comentarios; 