// Clave para almacenar las visitas en localStorage
const VISITAS_KEY = 'visitas_noticias';
const VISITAS_TOTALES_KEY = 'visitas_totales';

// Inicializar el almacenamiento si no existe
const initializeStorage = () => {
  if (!localStorage.getItem(VISITAS_KEY)) {
    localStorage.setItem(VISITAS_KEY, JSON.stringify({}));
  }
  if (!localStorage.getItem(VISITAS_TOTALES_KEY)) {
    localStorage.setItem(VISITAS_TOTALES_KEY, '0');
  }
};

// Registrar una visita a una noticia específica
export const registrarVisita = (noticiaId) => {
  initializeStorage();
  
  // Incrementar contador total
  const visitasTotales = parseInt(localStorage.getItem(VISITAS_TOTALES_KEY)) || 0;
  localStorage.setItem(VISITAS_TOTALES_KEY, (visitasTotales + 1).toString());

  // Incrementar contador por noticia
  const visitas = JSON.parse(localStorage.getItem(VISITAS_KEY));
  visitas[noticiaId] = (visitas[noticiaId] || 0) + 1;
  localStorage.setItem(VISITAS_KEY, JSON.stringify(visitas));
};

// Obtener el total de visitas
export const getVisitasTotales = () => {
  initializeStorage();
  return parseInt(localStorage.getItem(VISITAS_TOTALES_KEY)) || 0;
};

// Obtener visitas por noticia
export const getVisitasPorNoticia = (noticiaId) => {
  initializeStorage();
  const visitas = JSON.parse(localStorage.getItem(VISITAS_KEY));
  return visitas[noticiaId] || 0;
};

// Obtener todas las visitas
export const getAllVisitas = () => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(VISITAS_KEY));
};

// Obtener las noticias más visitadas
export const getNoticiasPopulares = (limit = 5) => {
  const visitas = getAllVisitas();
  return Object.entries(visitas)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([noticiaId, visitas]) => ({
      noticiaId: parseInt(noticiaId),
      visitas
    }));
}; 