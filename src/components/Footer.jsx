import { Box, Container, Grid, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Grid container columns={12} columnSpacing={4}>
          <Grid xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Noticias Web
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tu fuente confiable de noticias locales, nacionales e internacionales.
            </Typography>
          </Grid>
          <Grid xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Enlaces Rápidos
            </Typography>
            <Box>
              <Link href="/" color="inherit" display="block">
                Inicio
              </Link>
              <Link href="/noticias" color="inherit" display="block">
                Noticias
              </Link>
              <Link href="/contacto" color="inherit" display="block">
                Contacto
              </Link>
            </Box>
          </Grid>
          <Grid xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contacto
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: info@noticiasweb.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Teléfono: +123 456 7890
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Dirección: Calle Principal 123, Ciudad
            </Typography>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            {new Date().getFullYear()}
            {' Noticias Web. Todos los derechos reservados.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 