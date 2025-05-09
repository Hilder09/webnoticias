import { Box, Typography } from '@mui/material';

const NoticiaCard = ({ noticia, onClick }) => (
  <Box
    onClick={onClick}
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
);

export default NoticiaCard; 