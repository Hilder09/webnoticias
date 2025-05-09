import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Alert,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Tabs,
  Tab,
  Paper,
  Chip,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Star as StarIcon,
  Category as CategoryIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { getAllNews, addNews, updateNews, deleteNews, convertImageToBase64, validateImageFile, validateImageUrl, convertImagesToBase64, getLogo, setLogo, createLogo, getPublicidad, setPublicidad, getPublicidadHorizontal, setPublicidadHorizontal } from '../services/newsService';
import { useAuth } from '../contexts/AuthContext';
import { getVisitasTotales, getNoticiasPopulares, getVisitasPorNoticia } from '../services/visitasService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const [noticias, setNoticias] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingNoticia, setEditingNoticia] = useState(null);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [contentImages, setContentImages] = useState([]);
  const [imageTab, setImageTab] = useState(0);
  const { register, handleSubmit, reset, control, formState: { errors }, setValue, watch } = useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [visitasTotales, setVisitasTotales] = useState(0);
  const [noticiasPopulares, setNoticiasPopulares] = useState([]);
  const [logo, setLogoState] = useState('');
  const [openLogoDialog, setOpenLogoDialog] = useState(false);
  const [logoInput, setLogoInput] = useState('');
  const [logoTab, setLogoTab] = useState(0);
  const [logoError, setLogoError] = useState('');
  const [publicidad, setPublicidadState] = useState({ imagen: '', url: '' });
  const [pubPreview, setPubPreview] = useState('');
  const [pubUrl, setPubUrl] = useState('');
  const [pubError, setPubError] = useState('');
  const [pubLoading, setPubLoading] = useState(false);
  const [publicidadH, setPublicidadH] = useState({ imagen: '', url: '' });
  const [pubHPreview, setPubHPreview] = useState('');
  const [pubHUrl, setPubHUrl] = useState('');
  const [pubHError, setPubHError] = useState('');
  const [pubHLoading, setPubHLoading] = useState(false);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/login');
      return;
    }
    loadNoticias();
    // Cargar estadísticas de visitas
    setVisitasTotales(getVisitasTotales());
    const populares = getNoticiasPopulares(5);
    setNoticiasPopulares(populares);
    // Cargar logo al iniciar
    const fetchLogo = async () => {
      const url = await getLogo();
      setLogoState(url);
    };
    fetchLogo();
    // Cargar publicidad
    const fetchPublicidad = async () => {
      const pub = await getPublicidad();
      setPublicidadState(pub);
      setPubPreview(pub.imagen || '');
      setPubUrl(pub.url || '');
    };
    fetchPublicidad();
    // Cargar publicidad horizontal
    const fetchPublicidadH = async () => {
      const pub = await getPublicidadHorizontal();
      setPublicidadH(pub);
      setPubHPreview(pub.imagen || '');
      setPubHUrl(pub.url || '');
    };
    fetchPublicidadH();
  }, [user, isAdmin, navigate]);

  useEffect(() => {
    setValue('imagen', previewImage || '');
  }, [previewImage, setValue]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setError('Error al cerrar sesión');
    }
  };

  const loadNoticias = async () => {
    const newsData = await getAllNews();
    setNoticias(newsData);
  };

  const handleOpenDialog = (noticia = null) => {
    setEditingNoticia(noticia);
    if (noticia) {
      reset(noticia);
      setPreviewImage(noticia.imagen || '');
    } else {
      reset({
        titulo: '',
        contenido: '',
        categoria: 'Nacional',
        imagen: '',
        destacada: false
      });
      setPreviewImage('');
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingNoticia(null);
    setPreviewImage('');
    reset();
  };

  const handleImageUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      console.log('Archivo seleccionado:', {
        nombre: file.name,
        tipo: file.type,
        tamaño: file.size
      });

      validateImageFile(file);
      const base64Image = await convertImageToBase64(file);
      
      console.log('Imagen convertida a base64:', {
        tamaño: base64Image.length,
        tipo: base64Image.substring(0, 20) + '...'
      });

      setPreviewImage(base64Image);
      setValue('imagen', base64Image);
      setError('');
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      setError(error.message);
    }
  };

  const handleContentImageUpload = async (event) => {
    try {
      const files = Array.from(event.target.files);
      console.log('Archivos de contenido seleccionados:', files.map(f => ({
        nombre: f.name,
        tipo: f.type,
        tamaño: f.size
      })));

      const base64Images = await convertImagesToBase64(files);
      console.log('Imágenes de contenido convertidas:', base64Images.map(img => ({
        tamaño: img.length,
        tipo: img.substring(0, 20) + '...'
      })));

      setContentImages(prev => [...prev, ...base64Images]);
      
      const currentContent = watch('contenido') || '';
      const imageTags = base64Images.map(image => 
        `<img src="${image}" alt="Imagen" style="max-width: 100%; margin: 1rem 0;" />`
      ).join('\n');
      
      setValue('contenido', currentContent + '\n' + imageTags);
      setError('');
    } catch (error) {
      console.error('Error al procesar las imágenes de contenido:', error);
      setError(error.message);
    }
  };

  const insertImageInContent = (imageUrl) => {
    const currentContent = watch('contenido') || '';
    const imageTag = `<img src="${imageUrl}" alt="Imagen" style="max-width: 100%; margin: 1rem 0;" />`;
    setValue('contenido', currentContent + '\n' + imageTag);
  };

  const handleUrlSubmit = (event) => {
    event.preventDefault();
    let url = '';
    if (event.target.form) {
      url = event.target.form.url.value;
    } else if (event.target.url) {
      url = event.target.url.value;
    }
    if (validateImageUrl(url)) {
      setPreviewImage(url);
      setValue('imagen', url);
      if (event.target.form) event.target.form.url.value = '';
      else if (event.target.url) event.target.url.value = '';
      setError('');
    } else {
      setError('URL de imagen no válida');
    }
  };

  const onSubmit = async (data) => {
    try {
      console.log('Valor de previewImage:', previewImage);
      console.log('Valor de data.imagen:', data.imagen);
      // Procesar el contenido para asegurar que las imágenes se guarden correctamente
      const processedData = {
        ...data,
        contenido: data.contenido.replace(/<img[^>]+>/g, match => {
          // Asegurar que las imágenes tengan el estilo correcto
          if (!match.includes('style=')) {
            return match.replace('>', ' style=\"max-width: 100%; margin: 1rem 0;\">');
          }
          return match;
        })
      };

      console.log('Noticia a guardar en Firestore:', processedData);

      if (editingNoticia) {
        await updateNews(editingNoticia.id, processedData);
      } else {
        await addNews(processedData);
      }
      window.dispatchEvent(new Event('noticias-updated'));
      handleCloseDialog();
      loadNoticias();
    } catch (err) {
      setError('Error al guardar la noticia');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNews(id);
      window.dispatchEvent(new Event('noticias-updated'));
      loadNoticias();
    } catch (err) {
      setError('Error al eliminar la noticia');
    }
  };

  const categorias = ['Nacional', 'Internacional', 'Local', 'Deportes', 'Tecnología', 'Cultura'];

  const getNoticiasPorCategoria = () => {
    const conteo = {};
    noticias.forEach(noticia => {
      conteo[noticia.categoria] = (conteo[noticia.categoria] || 0) + 1;
    });
    return conteo;
  };

  const getNoticiasDestacadas = () => {
    return noticias.filter(noticia => noticia.destacada).length;
  };

  // Función para filtrar noticias
  const noticiasFiltradas = noticias.filter(noticia => {
    const matchSearch = noticia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       noticia.contenido.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = selectedCategoria === '' || noticia.categoria === selectedCategoria;
    return matchSearch && matchCategoria;
  });

  // Función para guardar el logo en Firestore
  const handleSaveLogo = async () => {
    try {
      if (!logoInput) {
        setLogoError('Debes seleccionar una imagen o poner una URL');
        return;
      }
      // Si es base64 o URL
      if (logoTab === 0) {
        // Subida de archivo
        await setLogo(logoInput);
        setLogoState(logoInput);
      } else {
        // URL
        if (!validateImageUrl(logoInput)) {
          setLogoError('URL de imagen no válida');
          return;
        }
        await setLogo(logoInput);
        setLogoState(logoInput);
      }
      setOpenLogoDialog(false);
      setLogoInput('');
      setLogoError('');
    } catch (e) {
      setLogoError('Error al guardar el logo');
    }
  };

  // Función para subir imagen y convertir a base64
  const handleLogoFile = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;
      validateImageFile(file);
      const base64 = await convertImageToBase64(file);
      setLogoInput(base64);
      setLogoError('');
    } catch (e) {
      setLogoError(e.message);
    }
  };

  // Manejar subida de imagen de publicidad
  const handlePubImage = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;
      validateImageFile(file);
      const base64Image = await convertImageToBase64(file);
      setPubPreview(base64Image);
      setPublicidadState((prev) => ({ ...prev, imagen: base64Image }));
      setPubError('');
    } catch (error) {
      setPubError(error.message);
    }
  };

  // Guardar publicidad
  const handleSavePublicidad = async () => {
    if (!pubPreview || !pubUrl) {
      setPubError('Debes poner una imagen y un enlace');
      return;
    }
    setPubLoading(true);
    try {
      await setPublicidad({ imagen: pubPreview, url: pubUrl });
      setPubError('');
    } catch (error) {
      setPubError('Error al guardar la publicidad');
    }
    setPubLoading(false);
  };

  // Manejar subida de imagen de publicidad horizontal
  const handlePubHImage = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;
      validateImageFile(file);
      const base64Image = await convertImageToBase64(file);
      setPubHPreview(base64Image);
      setPublicidadH((prev) => ({ ...prev, imagen: base64Image }));
      setPubHError('');
    } catch (error) {
      setPubHError(error.message);
    }
  };

  // Guardar publicidad horizontal
  const handleSavePublicidadH = async () => {
    if (!pubHPreview || !pubHUrl) {
      setPubHError('Debes poner una imagen y un enlace');
      return;
    }
    setPubHLoading(true);
    try {
      await setPublicidadHorizontal({ imagen: pubHPreview, url: pubHUrl });
      setPubHError('');
    } catch (error) {
      setPubHError('Error al guardar la publicidad');
    }
    setPubHLoading(false);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header con información del usuario */}
      <Paper 
        elevation={3}
        sx={{ 
          p: 3, 
          mb: 4, 
          backgroundColor: 'rgba(30, 30, 30, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" component="h1" color="white" gutterBottom>
              Panel de Administración
            </Typography>
            <Typography variant="subtitle1" color="gray">
              Bienvenido, {user?.email}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Logo editable */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.08)',
                  border: '2px solid #2196f3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s',
                  boxShadow: '0 2px 8px rgba(33,150,243,0.12)',
                  '&:hover': {
                    boxShadow: '0 4px 16px #2196f3',
                  }
                }}
                onClick={() => setOpenLogoDialog(true)}
                title="Cambiar logo"
              >
                {logo ? (
                  <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <DashboardIcon sx={{ fontSize: 32, color: '#2196f3' }} />
                )}
              </Box>
            </Box>
            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Dashboard Stats */}
      <Grid container columns={12} columnSpacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'rgba(30, 30, 30, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <DashboardIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" color="white" gutterBottom>
              Total de Noticias
            </Typography>
            <Typography variant="h4" color="primary">
              {noticias.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'rgba(30, 30, 30, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <StarIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h6" color="white" gutterBottom>
              Noticias Destacadas
            </Typography>
            <Typography variant="h4" color="secondary">
              {getNoticiasDestacadas()}
            </Typography>
          </Paper>
        </Grid>
        <Grid xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'rgba(30, 30, 30, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <CategoryIcon sx={{ fontSize: 40, color: '#4caf50', mb: 2 }} />
            <Typography variant="h6" color="white" gutterBottom>
              Categorías Activas
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {Object.entries(getNoticiasPorCategoria()).map(([categoria, cantidad]) => (
                <Chip
                  key={categoria}
                  label={`${categoria}: ${cantidad}`}
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    }
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Grid>
        <Grid xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'rgba(30, 30, 30, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <VisibilityIcon sx={{ fontSize: 40, color: '#4caf50', mb: 2 }} />
            <Typography variant="h6" color="white" gutterBottom>
              Visitas Totales
            </Typography>
            <Typography variant="h4" sx={{ color: '#4caf50' }}>
              {visitasTotales}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Sistema de Filtrado */}
      <Paper 
        sx={{ 
          p: 2, 
          mb: 3,
          backgroundColor: 'rgba(30, 30, 30, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Grid container columns={12} columnSpacing={2} alignItems="center">
          <Grid xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SearchIcon sx={{ color: 'gray' }} />
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar noticias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'gray',
                  },
                }}
              />
            </Box>
          </Grid>
          <Grid xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterListIcon sx={{ color: 'gray' }} />
              <FormControl fullWidth size="small">
                <Select
                  value={selectedCategoria}
                  onChange={(e) => setSelectedCategoria(e.target.value)}
                  displayEmpty
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                    '& .MuiSelect-icon': {
                      color: 'gray',
                    },
                  }}
                >
                  <MenuItem value="">Todas las categorías</MenuItem>
                  {categorias.map((categoria) => (
                    <MenuItem key={categoria} value={categoria}>
                      {categoria}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategoria('');
              }}
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              Limpiar filtros
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="gray">
            {noticiasFiltradas.length} {noticiasFiltradas.length === 1 ? 'noticia encontrada' : 'noticias encontradas'}
          </Typography>
          {(searchTerm || selectedCategoria) && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {searchTerm && (
                <Chip
                  label={`Búsqueda: ${searchTerm}`}
                  onDelete={() => setSearchTerm('')}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    color: 'white',
                    '& .MuiChip-deleteIcon': {
                      color: 'white',
                      '&:hover': { color: 'primary.main' },
                    },
                  }}
                />
              )}
              {selectedCategoria && (
                <Chip
                  label={`Categoría: ${selectedCategoria}`}
                  onDelete={() => setSelectedCategoria('')}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    color: 'white',
                    '& .MuiChip-deleteIcon': {
                      color: 'white',
                      '&:hover': { color: 'primary.main' },
                    },
                  }}
                />
              )}
            </Box>
          )}
        </Box>
      </Paper>

      {/* Botón de Nueva Noticia y Mensajes de Error */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" color="white">
          Gestión de Noticias
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
          }}
        >
          Nueva Noticia
        </Button>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 4,
            backgroundColor: 'rgba(211, 47, 47, 0.1)',
            color: '#ff8a80',
            border: '1px solid rgba(211, 47, 47, 0.3)'
          }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {/* Lista de Noticias */}
      <Paper 
        sx={{ 
          backgroundColor: 'rgba(30, 30, 30, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {noticiasFiltradas.length > 0 ? (
          noticiasFiltradas.map((noticia, index) => (
            <Box
              key={noticia.id}
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: index < noticiasFiltradas.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)'
                }
              }}
            >
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ minWidth: '120px' }}>
                  <Typography variant="caption" color="gray">
                    {new Date(noticia.fecha).toLocaleDateString()}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography 
                    variant="subtitle1" 
                    color="white"
                    sx={{
                      fontWeight: 'medium',
                      mb: 0.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {noticia.titulo}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={noticia.categoria}
                      size="small"
                      sx={{
                        height: '20px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        '& .MuiChip-label': {
                          px: 1,
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                    {noticia.destacada && (
                      <Chip
                        icon={<StarIcon sx={{ fontSize: '14px', color: 'white !important' }} />}
                        label="Destacada"
                        size="small"
                        sx={{
                          height: '20px',
                          backgroundColor: 'rgba(244, 67, 54, 0.2)',
                          color: 'white',
                          '& .MuiChip-label': {
                            px: 1,
                            fontSize: '0.75rem'
                          },
                          '& .MuiChip-icon': {
                            color: 'white',
                            ml: 0.5
                          }
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                <Tooltip title="Editar">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleOpenDialog(noticia)}
                    sx={{ 
                      backgroundColor: 'rgba(33, 150, 243, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(33, 150, 243, 0.2)',
                      }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(noticia.id)}
                    sx={{ 
                      backgroundColor: 'rgba(244, 67, 54, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(244, 67, 54, 0.2)',
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          ))
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="gray">
              No se encontraron noticias con los filtros seleccionados
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Top Noticias */}
      <Grid columnSpan={12}>
        <Paper
          sx={{
            p: 3,
            backgroundColor: 'rgba(30, 30, 30, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <TrendingUpIcon sx={{ color: '#ff9800', fontSize: 30 }} />
            <Typography variant="h6" color="white">
              Noticias Más Visitadas
            </Typography>
          </Box>

          {noticiasPopulares.map(({ noticiaId, visitas }) => {
            const noticia = noticias.find(n => n.id === noticiaId);
            if (!noticia) return null;

            return (
              <Box
                key={noticiaId}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)'
                  }
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" color="white" sx={{ mb: 0.5 }}>
                    {noticia.titulo}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={noticia.categoria}
                      size="small"
                      sx={{
                        height: '20px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        '& .MuiChip-label': {
                          px: 1,
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                    <Typography variant="caption" color="gray">
                      {new Date(noticia.fecha).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VisibilityIcon sx={{ color: '#ff9800', fontSize: 20 }} />
                  <Typography variant="subtitle2" sx={{ color: '#ff9800' }}>
                    {visitas} visitas
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Paper>
      </Grid>

      {/* Sección de Publicidad */}
      <Paper sx={{ p: 3, mb: 4, mt: 4 }}>
        <Typography variant="h6" gutterBottom>Publicidad (Banner Vertical)</Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'flex-start' }}>
          <Box>
            <Box sx={{ mb: 2 }}>
              <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
                Subir Imagen
                <input type="file" accept="image/*" hidden onChange={handlePubImage} />
              </Button>
            </Box>
            <TextField
              label="URL de la imagen (opcional)"
              value={pubPreview}
              onChange={e => { setPubPreview(e.target.value); setPublicidadState(prev => ({ ...prev, imagen: e.target.value })); }}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Enlace de destino (URL)"
              value={pubUrl}
              onChange={e => setPubUrl(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleSavePublicidad} disabled={pubLoading}>
              Guardar Publicidad
            </Button>
            {pubError && <Alert severity="error" sx={{ mt: 2 }}>{pubError}</Alert>}
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Vista previa:</Typography>
            <Box sx={{ width: 160, height: 600, bgcolor: '#fff', color: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, boxShadow: 2, fontWeight: 600, fontSize: 22 }}>
              {pubPreview ? <img src={pubPreview} alt="Publicidad" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 'Publicidad'}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Sección de Publicidad Horizontal */}
      <Paper sx={{ p: 3, mb: 4, mt: 4 }}>
        <Typography variant="h6" gutterBottom>Publicidad (Banner Horizontal)</Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'flex-start' }}>
          <Box>
            <Box sx={{ mb: 2 }}>
              <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
                Subir Imagen
                <input type="file" accept="image/*" hidden onChange={handlePubHImage} />
              </Button>
            </Box>
            <TextField
              label="URL de la imagen (opcional)"
              value={pubHPreview}
              onChange={e => { setPubHPreview(e.target.value); setPublicidadH(prev => ({ ...prev, imagen: e.target.value })); }}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Enlace de destino (URL)"
              value={pubHUrl}
              onChange={e => setPubHUrl(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleSavePublicidadH} disabled={pubHLoading}>
              Guardar Publicidad
            </Button>
            {pubHError && <Alert severity="error" sx={{ mt: 2 }}>{pubHError}</Alert>}
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Vista previa:</Typography>
            <Box sx={{ width: 728, height: 90, bgcolor: '#fff', color: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, boxShadow: 2, fontWeight: 600, fontSize: 22 }}>
              {pubHPreview ? <img src={pubHPreview} alt="Publicidad Horizontal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 'Publicidad'}
            </Box>
          </Box>
        </Box>
      </Paper>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#1e1e1e',
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>
          {editingNoticia ? 'Editar Noticia' : 'Nueva Noticia'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              margin="dense"
              label="Título"
              fullWidth
              {...register('titulo', { required: 'El título es requerido' })}
              error={!!errors.titulo}
              helperText={errors.titulo?.message}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiOutlinedInput-input': { color: 'white' },
              }}
            />

            <Box sx={{ mt: 2, mb: 2 }}>
              <Tabs 
                value={imageTab} 
                onChange={(e, newValue) => setImageTab(newValue)}
                sx={{ mb: 2 }}
              >
                <Tab 
                  icon={<CloudUploadIcon />} 
                  label="Subir imagen" 
                  sx={{ color: 'white' }} 
                />
                <Tab 
                  icon={<LinkIcon />} 
                  label="URL de imagen" 
                  sx={{ color: 'white' }} 
                />
              </Tabs>

              {imageTab === 0 ? (
                <>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      fullWidth
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                        '&:hover': {
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      Subir Imagen Principal
                    </Button>
                  </label>
                </>
              ) : (
                <Box sx={{ mt: 1 }}>
                  <TextField
                    fullWidth
                    name="url"
                    label="URL de la imagen"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-input': { color: 'white' },
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleUrlSubmit(e);
                      }
                    }}
                  />
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={handleUrlSubmit}
                  >
                    Usar URL
                  </Button>
                </Box>
              )}

              {previewImage && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      objectFit: 'contain',
                      borderRadius: '8px',
                    }}
                  />
                </Box>
              )}
            </Box>
            
            <TextField
              margin="dense"
              label="Contenido"
              fullWidth
              multiline
              rows={4}
              {...register('contenido', { required: 'El contenido es requerido' })}
              error={!!errors.contenido}
              helperText={errors.contenido?.message}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiOutlinedInput-input': { color: 'white' },
              }}
            />

            <Box sx={{ mt: 2, mb: 2 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="content-image-upload"
                type="file"
                multiple
                onChange={handleContentImageUpload}
              />
              <label htmlFor="content-image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<ImageIcon />}
                  fullWidth
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                    '&:hover': {
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  Subir Imágenes para el Contenido
                </Button>
              </label>

              {contentImages.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="white" sx={{ mb: 1 }}>
                    Imágenes disponibles:
                  </Typography>
                  <Grid container columns={12} columnSpacing={1}>
                    {contentImages.map((image, index) => (
                      <Grid xs={4} key={index}>
                        <Box
                          sx={{
                            position: 'relative',
                            cursor: 'pointer',
                            '&:hover': {
                              opacity: 0.8,
                            },
                          }}
                          onClick={() => insertImageInContent(image)}
                        >
                          <img
                            src={image}
                            alt={`Imagen ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100px',
                              objectFit: 'cover',
                              borderRadius: '4px',
                            }}
                          />
                          <Box
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
                              color: 'white',
                              opacity: 0,
                              transition: 'opacity 0.2s',
                              '&:hover': {
                                opacity: 1,
                              },
                            }}
                          >
                            <Typography variant="caption">
                              Click para insertar
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Box>

            <FormControl 
              fullWidth 
              margin="dense"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiSelect-select': { color: 'white' },
              }}
            >
              <InputLabel>Categoría</InputLabel>
              <Controller
                name="categoria"
                control={control}
                defaultValue="Nacional"
                render={({ field }) => (
                  <Select {...field} label="Categoría">
                    {categorias.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            <FormControlLabel
              control={
                <Controller
                  name="destacada"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <Checkbox 
                      {...field}
                      checked={field.value}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-checked': {
                          color: 'primary.main',
                        },
                      }}
                    />
                  )}
                />
              }
              label="Noticia destacada"
              sx={{ mt: 2, color: 'white' }}
            />

            {/* Campo oculto para imagen */}
            <input type="hidden" {...register('imagen')} value={previewImage || ''} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} sx={{ color: 'white' }}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained">
              {editingNoticia ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Diálogo para cambiar logo */}
      <Dialog open={openLogoDialog} onClose={() => setOpenLogoDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Cambiar Logo</DialogTitle>
        <DialogContent>
          <Tabs value={logoTab} onChange={(_, v) => { setLogoTab(v); setLogoError(''); setLogoInput(''); }} sx={{ mb: 2 }}>
            <Tab label="Subir Imagen" />
            <Tab label="URL de Imagen" />
          </Tabs>
          {logoTab === 0 ? (
            <>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="logo-upload"
                type="file"
                onChange={handleLogoFile}
              />
              <label htmlFor="logo-upload">
                <Button variant="outlined" component="span" fullWidth sx={{ mb: 2 }}>
                  Seleccionar Imagen
                </Button>
              </label>
              {logoInput && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img src={logoInput} alt="Preview Logo" style={{ maxWidth: 80, maxHeight: 80, borderRadius: '50%' }} />
                </Box>
              )}
            </>
          ) : (
            <TextField
              fullWidth
              label="URL de la imagen"
              value={logoInput}
              onChange={e => setLogoInput(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}
          {logoError && <Alert severity="error" sx={{ mt: 2 }}>{logoError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogoDialog(false)}>Cancelar</Button>
          <Button onClick={handleSaveLogo} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard; 