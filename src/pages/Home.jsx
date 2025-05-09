import { Container, Typography, Box, IconButton, Grid } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeaturedNews, getAllNews, getPublicidad } from '../services/newsService';
import NoticiaCard from '../components/NoticiaCard';
import RadioIcon from '@mui/icons-material/Radio';

const Home = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [noticiasDestacadas, setNoticiasDestacadas] = useState([]);
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publicidad, setPublicidad] = useState({ imagen: '', url: '' });

  useEffect(() => {
    const cargarNoticias = async () => {
      try {
        const destacadas = await getFeaturedNews();
        const todas = await getAllNews();
        const pub = await getPublicidad();
        setNoticiasDestacadas(destacadas);
        setNoticias(todas);
        setPublicidad(pub);
      } catch (error) {
        console.error('Error al cargar noticias:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarNoticias();
  }, []);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? noticiasDestacadas.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev === noticiasDestacadas.length - 1 ? 0 : prev + 1));
  };

  const handleUrlSubmit = (event) => {
    event.preventDefault();
    const url = event.target.url.value;
    console.log('Intentando guardar URL:', url);
    if (validateImageUrl(url)) {
      setPreviewImage(url);
      setValue('imagen', url);
      event.target.url.value = '';
      setError('');
      console.log('URL válida, guardada en previewImage e imagen:', url);
    } else {
      setError('URL de imagen no válida');
      console.log('URL inválida:', url);
    }
  };

  const onSubmit = async (data) => {
    try {
      const processedData = {
        ...data,
        contenido: data.contenido.replace(/<img[^>]+>/g, match => {
          if (!match.includes('style=')) {
            return match.replace('>', ' style=\"max-width: 100%; margin: 1rem 0;\">');
          }
          return match;
        })
      };
      // ... resto igual
    } catch (error) {
      console.error('Error al procesar el formulario:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        backgroundColor: '#121212', 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <Typography variant="h5" color="white">
          Cargando noticias...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#121212', minHeight: '100vh', pt: 2 }}>
      {/* Hero Slider */}
      {noticiasDestacadas.length > 0 && (
        <Box sx={{ position: 'relative', mb: 4 }}>
          <Box
            sx={{
              position: 'relative',
              height: { xs: '300px', sm: '400px', md: '500px' },
              overflow: 'hidden',
            }}
          >
            {noticiasDestacadas.map((noticia, index) => (
              <Box
                key={noticia.id}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: index === activeSlide ? 1 : 0,
                  transition: 'opacity 0.5s ease-in-out',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <img
                    src={noticia.imagen || 'https://placehold.co/1200x500/222/666?text=Noticia'}
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
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                      color: 'white',
                      padding: 4,
                    }}
                  >
                    <Typography variant="h3" component="h1" gutterBottom>
                      {noticia.titulo}
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {noticia.categoria}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          {noticiasDestacadas.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevSlide}
                sx={{
                  position: 'absolute',
                  left: 20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)',
                  },
                }}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                onClick={handleNextSlide}
                sx={{
                  position: 'absolute',
                  right: 20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)',
                  },
                }}
              >
                <ChevronRight />
              </IconButton>

              <Box
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 1,
                }}
              >
                {noticiasDestacadas.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: index === activeSlide ? 'white' : 'rgba(255,255,255,0.5)',
                      cursor: 'pointer',
                    }}
                    onClick={() => setActiveSlide(index)}
                  />
                ))}
              </Box>
            </>
          )}
        </Box>
      )}

      {/* Sección de Radio */}
      <Box
        sx={{
          background: 'linear-gradient(90deg, #ff512f 0%, #dd2476 100%)',
          borderRadius: 2,
          p: { xs: 1.5, md: 2 },
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 12px rgba(221, 36, 118, 0.10)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          minHeight: 64,
          maxWidth: '100%',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, width: '100%' }}>
          <RadioIcon sx={{ fontSize: 36, color: 'white', flexShrink: 0, filter: 'drop-shadow(0 2px 8px #dd2476)' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center', flex: 1 }}>
            Radio en Vivo: Música, noticias y programas 24/7. ¡Dale play!
          </Typography>
          <Box
            sx={{
              background: 'rgba(0,0,0,0.10)',
              borderRadius: 2,
              p: 0.5,
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 1px 4px rgba(221, 36, 118, 0.08)',
              minWidth: 180,
              maxWidth: 260,
              width: { xs: '100%', sm: 'auto' },
              justifyContent: 'center',
            }}
          >
            <audio
              controls
              style={{ width: '100%' }}
              src="https://stream.zeno.fm/7h6w5r6y8yzuv"
            >
              Tu navegador no soporta el elemento de audio.
            </audio>
          </Box>
        </Box>
      </Box>

      {/* Grid de Noticias y Banner */}
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', alignItems: 'flex-start', position: 'relative', minHeight: '100vh' }}>
          {/* Noticias */}
          <Box sx={{ flex: 3, minWidth: 0, pr: 2, position: 'relative' }}>
            <Typography variant="h4" component="h2" gutterBottom color="white" sx={{ mb: 4 }}>
              Todas las Noticias ({noticias.length})
            </Typography>
            {noticias.length === 0 ? (
              <Typography variant="h6" color="white" align="center">
                No hay noticias disponibles
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {noticias.map((noticia) => (
                  <Grid item xs={12} sm={6} md={4} key={noticia.id}>
                    <NoticiaCard
                      noticia={noticia}
                      onClick={() => navigate(`/noticias/${noticia.id}`)}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
          {/* Banner vertical de publicidad dinámico */}
          <Box sx={{
            width: 160,
            position: 'sticky',
            top: 100,
            alignSelf: 'flex-start',
            display: { xs: 'none', md: 'block' },
            pl: 2,
            zIndex: 100
          }}>
            {publicidad.imagen ? (
              <a href={publicidad.url || '#'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                <Box sx={{
                  width: 160,
                  height: 600,
                  bgcolor: '#fff',
                  color: '#222',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  fontWeight: 600,
                  fontSize: 22,
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                    cursor: 'pointer'
                  }
                }}>
                  <img
                    src={publicidad.imagen}
                    alt="Publicidad"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                  />
                </Box>
              </a>
            ) : (
              <Box sx={{
                width: 160,
                height: 600,
                bgcolor: '#fff',
                color: '#222',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                fontWeight: 600,
                fontSize: 22,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  cursor: 'pointer'
                }
              }}>
                Publicidad
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;