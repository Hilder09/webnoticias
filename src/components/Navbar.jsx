import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Menu, MenuItem, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon, Person as PersonIcon, Close as CloseIcon } from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getLogo } from '../services/newsService';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [logo, setLogo] = useState('');
  const menuItems = [
    { text: 'Inicio', path: '/' },
    { text: 'Noticias', path: '/noticias' },
    { text: 'Deportes', path: '/deportes' },
    { text: 'Zona Interactiva', path: '/zona-interactiva' },
  ];
  const location = useLocation();

  useEffect(() => {
    const fetchLogo = async () => {
      const url = await getLogo();
      setLogo(url);
    };
    fetchLogo();
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleClose();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/noticias?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: '#121212', minHeight: 56, justifyContent: 'center' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: '56px', alignItems: 'center' }}>
          {/* Logo a la izquierda */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            {logo ? (
              <img src={logo} alt="Logo" style={{ height: 40, maxWidth: 120, objectFit: 'contain' }} />
            ) : (
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', letterSpacing: 2 }}>
                NOTICIAS
              </Typography>
            )}
          </Box>
          {/* Menú de navegación centrado */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                component={Link}
                to={item.path}
                sx={{ color: 'white', mx: 2, fontSize: '1.25rem', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
          {/* Botones de acción a la derecha */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {showSearch ? (
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <TextField
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Buscar noticias..."
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                    },
                    '& .MuiInputBase-input': { 
                      color: 'white',
                      width: '200px'
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleSearch} edge="end">
                          <SearchIcon sx={{ color: 'white' }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <IconButton 
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery('');
                  }}
                  sx={{ ml: 1 }}
                >
                  <CloseIcon sx={{ color: 'white' }} />
                </IconButton>
              </Box>
            ) : (
              <IconButton 
                color="inherit" 
                onClick={() => setShowSearch(true)}
                sx={{ mr: 1 }}
              >
                <SearchIcon />
              </IconButton>
            )}
            {user && isAdmin ? (
              <>
                <IconButton
                  color="inherit"
                  onClick={handleMenu}
                  sx={{ mr: 1 }}
                >
                  <PersonIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      backgroundColor: '#1e1e1e',
                      color: 'white',
                      '& .MuiMenuItem-root:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    },
                  }}
                >
                  <MenuItem onClick={() => { handleClose(); navigate('/admin'); }}>
                    Panel de Administración
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    Cerrar Sesión
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                color="inherit"
                component={Link}
                to="/login"
              >
                Iniciar Sesión
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 