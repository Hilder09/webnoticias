import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  TextField,
  MenuItem,
  Pagination,
  InputAdornment,
  IconButton,
  Chip
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { getAllNews } from '../services/newsService';

const Noticias = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [noticias, setNoticias] = useState([]);
  const [categoria, setCategoria] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const noticiasPorPagina = 6;

  useEffect(() => {
    const cargarNoticias = async () => {
      const todasLasNoticias = await getAllNews();
      setNoticias(todasLasNoticias);
    };

    cargarNoticias();

    // Recargar cuando cambie el localStorage (evento storage)
    const handleStorage = (e) => {
      if (e.key === 'news') {
        cargarNoticias();
      }
    };
    window.addEventListener('storage', handleStorage);

    // Recargar cuando se lance el evento personalizado
    const handleNoticiasUpdated = () => {
      cargarNoticias();
    };
    window.addEventListener('noticias-updated', handleNoticiasUpdated);

    // Reiniciar búsqueda al cambiar de ruta
    setBusqueda('');
    setCategoria('Todas');
    setPagina(1);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('noticias-updated', handleNoticiasUpdated);
    };
  }, [location.pathname]);

  // Obtener el término de búsqueda de la URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setBusqueda(searchQuery);
    }
  }, [location.search]);

  const categorias = ['Todas', 'Nacional', 'Internacional', 'Local', 'Deportes', 'Tecnología', 'Cultura'];

  const noticiasFiltradas = noticias.filter(noticia => {
    const coincideCategoria = categoria === 'Todas' || noticia.categoria === categoria;
    const coincideBusqueda = busqueda === '' || 
      noticia.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      noticia.contenido.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  const noticiasPaginadas = noticiasFiltradas.slice(
    (pagina - 1) * noticiasPorPagina,
    pagina * noticiasPorPagina
  );

  const totalPaginas = Math.ceil(noticiasFiltradas.length / noticiasPorPagina);

  const handleClearSearch = () => {
    setBusqueda('');
    setPagina(1);
    navigate('/noticias');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" color="white">
        Noticias
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          select
          label="Categoría"
          value={categoria}
          onChange={(e) => {
            setCategoria(e.target.value);
            setPagina(1);
          }}
          sx={{ 
            minWidth: 200,
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
            },
            '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
            '& .MuiSelect-select': { color: 'white' },
          }}
        >
          {categorias.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>

        {busqueda && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" color="white" sx={{ mr: 2 }}>
              Resultados para: "{busqueda}"
            </Typography>
            <Button
              variant="outlined"
              onClick={handleClearSearch}
              startIcon={<ClearIcon />}
            >
              Limpiar búsqueda
            </Button>
          </Box>
        )}
      </Box>

      {noticiasFiltradas.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="white">
            No se encontraron noticias que coincidan con tu búsqueda
          </Typography>
          <Button 
            variant="outlined" 
            onClick={handleClearSearch}
            sx={{ mt: 2 }}
          >
            Limpiar búsqueda
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={2} alignItems="stretch">
            {noticiasPaginadas.map((noticia) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={noticia.id} sx={{ display: 'flex' }}>
                <Box
                  onClick={() => navigate(`/noticias/${noticia.id}`)}
                  sx={{
                    position: 'relative',
                    cursor: 'pointer',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    height: '170px',
                    minWidth: '170px',
                    maxWidth: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    transition: 'transform 0.3s ease',
                    background: '#232323',
                    '&:hover': {
                      transform: 'scale(1.04)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      zIndex: 1,
                    }}
                  >
                    <img
                      src={noticia.imagen || `https://placehold.co/300x170/222/666?text=${noticia.categoria}`}
                      alt={noticia.titulo}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                        color: 'white',
                        p: 1,
                        zIndex: 2,
                      }}
                    >
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 'bold',
                          fontSize: '0.85rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          mb: 0.5,
                        }}
                      >
                        {noticia.titulo}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          opacity: 0.8,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontSize: '0.75rem',
                        }}
                      >
                        {noticia.categoria}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
          {totalPaginas > 1 && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={totalPaginas}
                page={pagina}
                onChange={(e, value) => setPagina(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Noticias; 