import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Pagination
} from '@mui/material';
import { getAllNews } from '../services/newsService';

const Deportes = () => {
  const navigate = useNavigate();
  const [noticias, setNoticias] = useState([]);
  const [pagina, setPagina] = useState(1);
  const noticiasPorPagina = 6;

  useEffect(() => {
    const cargarNoticias = async () => {
      try {
        const todasLasNoticias = await getAllNews();
        // Filtrar solo las noticias de la categoría Deportes
        const noticiasDeportes = todasLasNoticias.filter(noticia => 
          noticia.categoria && noticia.categoria.toLowerCase() === 'deportes'
        );
        setNoticias(noticiasDeportes);
      } catch (error) {
        setNoticias([]);
      }
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

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('noticias-updated', handleNoticiasUpdated);
    };
  }, [window.location.pathname]);

  const noticiasPaginadas = noticias.slice(
    (pagina - 1) * noticiasPorPagina,
    pagina * noticiasPorPagina
  );

  const totalPaginas = Math.ceil(noticias.length / noticiasPorPagina);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" color="white">
        Deportes
      </Typography>

      {noticias.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="white">
            No hay noticias de deportes disponibles en este momento
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/noticias')}
            sx={{ mt: 2 }}
          >
            Ver todas las noticias
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

export default Deportes; 