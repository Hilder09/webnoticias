import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Alert,
  Snackbar,
  Paper
} from '@mui/material';
import { Send as SendIcon, Delete as DeleteIcon, Edit as EditIcon, Person as PersonIcon } from '@mui/icons-material';
import Register from '../components/Auth/Register';
import Login from '../components/Auth/Login';

const ZonaInteractiva = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    // Cargar mensajes
    const savedMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    setMessages(savedMessages);

    // Verificar si hay usuario logueado
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  const handleSendMessage = () => {
    if (!currentUser) {
      setShowLogin(true);
      return;
    }

    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        userId: currentUser.id,
        userName: currentUser.nombre,
        timestamp: new Date().toISOString()
      };

      const updatedMessages = [...messages, message];
      setMessages(updatedMessages);
      localStorage.setItem('messages', JSON.stringify(updatedMessages));
      setNewMessage('');
    }
  };

  const handleDeleteMessage = (messageId) => {
    const updatedMessages = messages.filter(msg => msg.id !== messageId);
    setMessages(updatedMessages);
    localStorage.setItem('messages', JSON.stringify(updatedMessages));
  };

  const handleEditClick = (message) => {
    setEditingMessage(message);
    setEditText(message.text);
    setOpenEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      const updatedMessages = messages.map(msg =>
        msg.id === editingMessage.id
          ? { ...msg, text: editText }
          : msg
      );
      setMessages(updatedMessages);
      localStorage.setItem('messages', JSON.stringify(updatedMessages));
      setOpenEditDialog(false);
    }
  };

  const handleRegister = (userData) => {
    setCurrentUser(userData);
  };

  const handleLogin = (userData) => {
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, backgroundColor: '#1e1e1e', color: 'white', mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Zona Interactiva
          </Typography>
          {currentUser ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1">
                Bienvenido, {currentUser.nombre}
              </Typography>
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={handleLogout}
                size="small"
              >
                Cerrar Sesión
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={() => setShowLogin(true)}
              >
                Iniciar Sesión
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => setShowRegister(true)}
              >
                Registrarse
              </Button>
            </Box>
          )}
        </Box>

        {!currentUser && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Para participar en la conversación, por favor inicia sesión o regístrate
          </Alert>
        )}

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder={currentUser ? "Escribe tu mensaje..." : "Inicia sesión para comentar"}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!currentUser}
            sx={{
              mb: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                },
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            disabled={!currentUser || !newMessage.trim()}
          >
            Enviar Mensaje
          </Button>
        </Box>

        <Box>
          {messages.map((message) => (
            <Card 
              key={message.id} 
              sx={{ 
                mb: 2, 
                backgroundColor: '#2d2d2d',
                color: 'white'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {message.userName}
                  </Typography>
                  {currentUser && message.userId === currentUser.id && (
                    <Box>
                      <IconButton 
                        size="small" 
                        onClick={() => handleEditClick(message)}
                        sx={{ color: 'primary.main', mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteMessage(message.id)}
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {message.text}
                </Typography>
                <Typography variant="caption" color="gray">
                  {new Date(message.timestamp).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Paper>

      <Register
        open={showRegister}
        onClose={() => setShowRegister(false)}
        onRegister={handleRegister}
      />

      <Login
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
      />

      <Dialog 
        open={openEditDialog} 
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: 'white' }}>Editar mensaje</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
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
          <Button onClick={() => setOpenEditDialog(false)} sx={{ color: 'gray' }}>
            Cancelar
          </Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ZonaInteractiva; 