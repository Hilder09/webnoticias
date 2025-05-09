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
  Chip,
  Pagination,
  useTheme,
  useMediaQuery,
  CardActionArea
} from '@mui/material';
import { getAllNews } from '../services/newsService';

const NoticiaCard = ({ noticia, navigate, variant = 'small' }) => {
  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/noticias/${noticia.id}`);
  };

  const tiempoTranscurrido = (fecha) => {
    const ahora = new Date();
    const fechaNoticia = new Date(fecha);
    const diferencia = ahora - fechaNoticia;
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    
    if (horas < 24) {
      return `hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
    } else {
      return fechaNoticia.toLocaleDateString();
    }
  };

  const cardStyles = {
    small: {
      card: {
        height: '120px',
      },
      image: {
        height: '70px',
      },
      title: {
        fontSize: '0.65rem',
      }
    },
    medium: {
      card: {
        height: '180px',
      },
      image: {
        height: '100px',
      },
      title: {
        fontSize: '0.75rem',
      }
    },
    large: {
      card: {
        height: '240px',
      },
      image: {
        height: '140px',
      },
      title: {
        fontSize: '0.85rem',
      }
    }
  };

  return (
    <Card 
      sx={{ 
        width: '100%',
        ...cardStyles[variant].card,
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: '#1e1e1e',
        borderRadius: '4px',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        boxShadow: 'none',
        border: '1px solid rgba(255,255,255,0.1)',
        '&:hover': {
          backgroundColor: '#2a2a2a',
          borderColor: 'rgba(255,255,255,0.2)',
          transform: 'translateY(-2px)',
        }
      }}
    >
      <CardActionArea onClick={handleClick} sx={{ height: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box
            sx={{ 
              position: 'relative',
              width: '100%',
              height: cardStyles[variant].image.height,
              overflow: 'hidden',
            }}
          >
            <img
              src={noticia.imagen}
              alt={noticia.titulo}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
              }}
            />
          </Box>
          <Box sx={{ p: 0.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography 
              variant="caption" 
              color="primary"
              sx={{ 
                textTransform: 'uppercase',
                fontWeight: 'bold',
                fontSize: '0.5rem',
                mb: 0.2,
                display: 'block'
              }}
            >
              {noticia.categoria}
            </Typography>
            <Typography 
              variant="h6" 
              component="h2" 
              color="white"
              sx={{ 
                fontWeight: 'bold',
                fontSize: cardStyles[variant].title.fontSize,
                lineHeight: 1.2,
                mb: 'auto',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                maxHeight: '2.4em'
              }}
            >
              {noticia.titulo}
            </Typography>
            <Typography 
              variant="caption" 
              color="gray"
              sx={{ 
                fontSize: '0.5rem',
                display: 'block',
                mt: 0.2
              }}
            >
              {tiempoTranscurrido(noticia.fecha)}
            </Typography>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
};

const Inicio = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [noticias, setNoticias] = useState([]);
  const [noticiasDestacadas, setNoticiasDestacadas] = useState([]);
  const [pagina, setPagina] = useState(1);
  const noticiasPorPagina = 12;

  useEffect(() => {
    const cargarNoticias = () => {
      const todasLasNoticias = getAllNews();
      setNoticias(todasLasNoticias);
      
      const destacadas = [...todasLasNoticias]
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 6);
      setNoticiasDestacadas(destacadas);
    };

    cargarNoticias();
  }, []);

  const noticiasPaginadas = noticias.slice(
    (pagina - 1) * noticiasPorPagina,
    pagina * noticiasPorPagina
  );

  const totalPaginas = Math.ceil(noticias.length / noticiasPorPagina);

  return (
    <Box sx={{ 
      backgroundColor: '#121212',
      minHeight: '100vh',
      pt: 2
    }}>
      <Container 
        maxWidth={false} 
        sx={{ 
          px: { xs: 1, sm: 2, md: 4 },
          maxWidth: '1800px'
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h5" 
            component="h2" 
            color="white" 
            sx={{ 
              mb: 2,
              fontSize: { xs: '1.2rem', sm: '1.4rem' },
              fontWeight: 'bold',
              borderBottom: '2px solid #333',
              pb: 1
            }}
          >
            Noticias Destacadas
          </Typography>
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(4, 1fr)',
                md: 'repeat(6, 1fr)',
                lg: 'repeat(12, 1fr)'
              },
              gap: 1,
              '& > .grid-item': {
                width: '100%'
              }
            }}
          >
            {noticiasDestacadas.slice(0, 1).map((noticia) => (
              <Box key={noticia.id} sx={{ gridColumn: { xs: 'span 2', sm: 'span 4', md: 'span 6', lg: 'span 6' } }}>
                <NoticiaCard noticia={noticia} navigate={navigate} variant="large" />
              </Box>
            ))}
            {noticiasDestacadas.slice(1, 3).map((noticia) => (
              <Box key={noticia.id} sx={{ gridColumn: { xs: 'span 2', sm: 'span 2', md: 'span 3', lg: 'span 3' } }}>
                <NoticiaCard noticia={noticia} navigate={navigate} variant="medium" />
              </Box>
            ))}
            {noticiasDestacadas.slice(3).map((noticia) => (
              <Box key={noticia.id} sx={{ gridColumn: { xs: 'span 1', sm: 'span 1', md: 'span 2', lg: 'span 2' } }}>
                <NoticiaCard noticia={noticia} navigate={navigate} variant="small" />
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h5" 
            component="h2" 
            color="white" 
            sx={{ 
              mb: 2,
              fontSize: { xs: '1.2rem', sm: '1.4rem' },
              fontWeight: 'bold',
              borderBottom: '2px solid #333',
              pb: 1
            }}
          >
            Últimas Noticias
          </Typography>
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(4, 1fr)',
                md: 'repeat(6, 1fr)',
                lg: 'repeat(12, 1fr)'
              },
              gap: 1,
              '& > .grid-item': {
                width: '100%'
              }
            }}
          >
            {noticiasPaginadas.map((noticia) => (
              <Box 
                key={noticia.id} 
                sx={{ 
                  gridColumn: { xs: 'span 1', sm: 'span 1', md: 'span 2', lg: 'span 2' }
                }}
              >
                <NoticiaCard 
                  noticia={noticia} 
                  navigate={navigate} 
                  variant="small"
                />
              </Box>
            ))}
          </Box>
        </Box>

        {totalPaginas > 1 && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={totalPaginas}
              page={pagina}
              onChange={(e, value) => setPagina(value)}
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: 'white',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(144, 202, 249, 0.2)',
                  },
                },
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Inicio; 