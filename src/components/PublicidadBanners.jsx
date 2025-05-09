import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { getPublicidad, getPublicidadHorizontal } from '../services/newsService';

const PublicidadBanners = () => {
  const [publicidadVertical, setPublicidadVertical] = useState({ imagen: '', url: '' });
  const [publicidadHorizontal, setPublicidadHorizontal] = useState({ imagen: '', url: '' });

  useEffect(() => {
    const cargarPublicidad = async () => {
      try {
        const pubVertical = await getPublicidad();
        const pubHorizontal = await getPublicidadHorizontal();
        setPublicidadVertical(pubVertical);
        setPublicidadHorizontal(pubHorizontal);
      } catch (error) {
        console.error('Error al cargar publicidad:', error);
      }
    };
    cargarPublicidad();
  }, []);

  return (
    <>
      {/* Banner Horizontal */}
      <Box sx={{ 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        background: '#fff', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)', 
        marginBottom: 3 
      }}>
        {publicidadHorizontal.imagen ? (
          <a href={publicidadHorizontal.url || '#'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', width: 728, height: 90, display: 'block' }}>
            <Box sx={{ 
              width: 728, 
              height: 90, 
              background: '#fff', 
              color: '#222', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              borderRadius: 2, 
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)', 
              overflow: 'hidden' 
            }}>
              <img src={publicidadHorizontal.imagen} alt="Publicidad Horizontal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
          </a>
        ) : (
          <Box sx={{ 
            width: 728, 
            height: 90, 
            background: '#fff', 
            color: '#222', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            borderRadius: 2, 
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)', 
            fontWeight: 600, 
            fontSize: 20 
          }}>
            Publicidad
          </Box>
        )}
      </Box>

      {/* Banner Vertical */}
      <Box sx={{ 
        width: 160,
        position: 'sticky',
        top: 100,
        alignSelf: 'flex-start',
        display: { xs: 'none', md: 'block' },
        pl: 2,
        zIndex: 100
      }}>
        {publicidadVertical.imagen ? (
          <a href={publicidadVertical.url || '#'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
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
                src={publicidadVertical.imagen} 
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
    </>
  );
};

export default PublicidadBanners; 