import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Box, CircularProgress, Button, Chip, IconButton, Divider } from '@mui/material';
import { ArrowBack, ZoomIn, Visibility, Close } from '@mui/icons-material';
import { getAllNews } from '../services/newsService';
import { registrarVisita } from '../services/visitasService';
import Comentarios from '../components/Comentarios';

const NoticiaDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchNoticia = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener todas las noticias
        const noticias = await getAllNews();
        console.log('Noticias disponibles:', noticias);

        if (!Array.isArray(noticias) || noticias.length === 0) {
          console.error('No hay noticias disponibles o el resultado no es un array:', noticias);
          throw new Error('No hay noticias disponibles');
        }

        // Validar y convertir el ID
        if (!id) {
          throw new Error('ID de noticia no proporcionado');
        }

        // Buscar la noticia por ID (como string)
        const noticiaEncontrada = noticias.find(n => n.id === id);
        console.log('Noticia encontrada:', noticiaEncontrada);

        if (!noticiaEncontrada) {
          throw new Error(`No se encontró la noticia con ID ${id}`);
        }

        setNoticia(noticiaEncontrada);
        // Registrar la visita
        registrarVisita(id);
      } catch (error) {
        console.error('Error al cargar la noticia:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticia();
  }, [id]);

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
    setShowImageModal(true);
  };

  const renderContentWithImages = (content) => {
    const parts = content.split(/(<img[^>]*>)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('<img')) {
        const srcMatch = part.match(/src="([^"]*)"/);
        if (srcMatch) {
          const src = srcMatch[1];
          return (
            <Box
              key={index}
              sx={{
                position: 'relative',
                width: '100%',
                height: '400px',
                borderRadius: '8px',
                overflow: 'hidden',
                my: 3,
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                '&:hover': {
                  '& .zoom-overlay': {
                    opacity: 1,
                  },
                  '& img': {
                    transform: 'scale(1.05)',
                  }
                },
              }}
              onClick={() => handleImageClick(src)}
            >
              <img
                src={src}
                alt="Imagen de la noticia"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                }}
              />
              <Box
                className="zoom-overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                }}
              >
                <ZoomIn sx={{ fontSize: 40, color: 'white' }} />
              </Box>
            </Box>
          );
        }
      }
      return <Typography key={index} variant="body1" paragraph color="white">{part}</Typography>;
    });
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !noticia) {
    return (
      <Container>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            backgroundColor: '#1e1e1e',
            mt: 4
          }}
        >
          <Typography variant="h5" component="h1" gutterBottom color="error">
            {error || 'Noticia no encontrada'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/noticias')}
            sx={{ mt: 2 }}
          >
            Volver a Noticias
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ 
          mb: 2,
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        Volver
      </Button>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, md: 3 }, 
          backgroundColor: '#1e1e1e',
          borderRadius: '8px'
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Chip 
            label={noticia.categoria} 
            color="primary" 
            size="small"
            sx={{ mb: 2 }}
          />
        </Box>
        
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          color="white"
          sx={{
            fontSize: { xs: '1.5rem', md: '2rem' },
            fontWeight: 'bold',
            lineHeight: 1.2
          }}
        >
          {noticia.titulo}
        </Typography>
        
        <Typography 
          variant="subtitle2" 
          color="gray" 
          gutterBottom
          sx={{ mb: 2 }}
        >
          Publicado el {new Date(noticia.fecha).toLocaleDateString()}
        </Typography>

        {/* Imagen Principal */}
        <Box 
          sx={{
            position: 'relative',
            width: '100%',
            height: '400px',
            overflow: 'hidden',
            borderRadius: '8px',
            mb: 3,
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            '&:hover': {
              '& .zoom-overlay': {
                opacity: 1,
              },
              '& img': {
                transform: 'scale(1.05)',
              }
            },
          }}
          onClick={() => handleImageClick(noticia.imagen)}
        >
          {console.log('URL de la imagen:', noticia.imagen)}
          <img
            src={noticia.imagen || 'https://placehold.co/800x400?text=Sin+Imagen'}
            alt={noticia.titulo}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
            }}
            onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x400?text=Sin+Imagen'; }}
          />
          <Box
            className="zoom-overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            <ZoomIn sx={{ fontSize: 40, color: 'white' }} />
          </Box>
        </Box>
        
        <Box sx={{ color: 'white' }}>
          {renderContentWithImages(noticia.contenido)}
        </Box>

        <Divider sx={{ my: 4, backgroundColor: 'rgba(255,255,255,0.1)' }} />
        
        <Button
          startIcon={<Visibility />}
          onClick={() => handlePreview(noticia)}
          sx={{
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }
          }}
        >
          Previsualizar
        </Button>
        
        <Comentarios noticiaId={noticia.id} />
      </Paper>

      {/* Modal para ver la imagen en grande */}
      {showImageModal && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
          }}
          onClick={() => setShowImageModal(false)}
        >
          <img
            src={selectedImage}
            alt="Imagen ampliada"
            style={{
              maxWidth: '90%',
              maxHeight: '90vh',
              objectFit: 'contain',
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <IconButton
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)',
              },
            }}
            onClick={() => setShowImageModal(false)}
          >
            <Close />
          </IconButton>
        </Box>
      )}
    </Container>
  );
};

export default NoticiaDetalle; 