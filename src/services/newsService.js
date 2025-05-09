import { db } from '../firebase/config';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  orderBy,
  setDoc
} from 'firebase/firestore';

const NEWS_COLLECTION = 'noticias';
const CONFIG_COLLECTION = 'configuracion';
const LOGO_DOC = 'logo';

// Obtener todas las noticias (ordenadas por fecha descendente)
export const getAllNews = async () => {
  const newsRef = collection(db, NEWS_COLLECTION);
  const q = query(newsRef, orderBy('fecha', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Obtener noticias destacadas (máximo 3)
export const getFeaturedNews = async () => {
  const allNews = await getAllNews();
  return allNews.filter(n => n.destacada).slice(0, 3);
};

// Obtener noticias por categoría
export const getNewsByCategory = async (category) => {
  const allNews = await getAllNews();
  return category === 'Todas' ? allNews : allNews.filter(n => n.categoria === category);
};

// Agregar una nueva noticia
export const addNews = async (noticia) => {
  const newsRef = collection(db, NEWS_COLLECTION);
  const noticiaObj = {
    ...noticia,
    fecha: new Date().toISOString(),
  };
  const docRef = await addDoc(newsRef, noticiaObj);
  return { id: docRef.id, ...noticiaObj };
};

// Actualizar una noticia
export const updateNews = async (id, noticia) => {
  const noticiaRef = doc(db, NEWS_COLLECTION, id);
  await updateDoc(noticiaRef, noticia);
  const updatedDoc = await getDoc(noticiaRef);
  return { id, ...updatedDoc.data() };
};

// Eliminar una noticia
export const deleteNews = async (id) => {
  const noticiaRef = doc(db, NEWS_COLLECTION, id);
  await deleteDoc(noticiaRef);
};

// Función para validar el tipo de archivo
export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Tipo de archivo no válido. Solo se permiten imágenes JPG, PNG o GIF.');
  }
  
  const maxSize = 2 * 1024 * 1024; // Reducido a 2MB para evitar problemas con Firestore
  if (file.size > maxSize) {
    throw new Error('La imagen es demasiado grande. El tamaño máximo permitido es 2MB.');
  }
  
  return true;
};

// Función para convertir una imagen a base64
export const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result;
      if (base64String.length > 10 * 1024 * 1024) { // 10MB es el límite de Firestore
        reject(new Error('La imagen convertida es demasiado grande para Firestore'));
      } else {
        resolve(base64String);
      }
    };
    reader.onerror = error => reject(error);
  });
};

// Función para procesar el contenido y extraer las imágenes
export const processContentImages = (content) => {
  const imageRegex = /<img[^>]+src="([^">]+)"/g;
  const images = [];
  let match;
  
  while ((match = imageRegex.exec(content)) !== null) {
    images.push(match[1]);
  }
  
  return images;
};

// Función para validar una URL de imagen
export const validateImageUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Función para convertir múltiples imágenes a base64
export const convertImagesToBase64 = async (files) => {
  const promises = files.map(file => {
    validateImageFile(file);
    return convertImageToBase64(file);
  });
  
  try {
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error('Error al convertir imágenes:', error);
    throw error;
  }
};

// Función para obtener los comentarios de una noticia
export const getCommentsByNewsId = (newsId) => {
    const comments = localStorage.getItem(`comments_${newsId}`);
    return comments ? JSON.parse(comments) : [];
};

// Función para agregar un comentario
export const addComment = (newsId, comment) => {
    try {
        const comments = getCommentsByNewsId(newsId);
        const newComment = {
            ...comment,
            id: Date.now(),
            fecha: new Date().toISOString(),
        };
        comments.unshift(newComment);
        localStorage.setItem(`comments_${newsId}`, JSON.stringify(comments));
        return newComment;
    } catch (error) {
        console.error('Error al agregar comentario:', error);
        throw error;
    }
};

// Función para actualizar un comentario
export const updateComment = (newsId, commentId, updatedComment) => {
    try {
        const comments = getCommentsByNewsId(newsId);
        const index = comments.findIndex(c => c.id === commentId);
        if (index !== -1) {
            comments[index] = { ...comments[index], ...updatedComment };
            localStorage.setItem(`comments_${newsId}`, JSON.stringify(comments));
            return comments[index];
        }
        return null;
    } catch (error) {
        console.error('Error al actualizar comentario:', error);
        throw error;
    }
};

// Función para eliminar un comentario
export const deleteComment = (newsId, commentId) => {
    try {
        const comments = getCommentsByNewsId(newsId);
        const filteredComments = comments.filter(c => c.id !== commentId);
        localStorage.setItem(`comments_${newsId}`, JSON.stringify(filteredComments));
    } catch (error) {
        console.error('Error al eliminar comentario:', error);
        throw error;
    }
};

// Función para inicializar datos de ejemplo
export const initializeExampleData = () => {
    console.log('Iniciando inicialización de datos de ejemplo');
    
    const exampleNews = [
        {
            id: 1,
            titulo: "Los detalles del fallo por la Conmoción en Catatumbo",
            categoria: "Nacional",
            contenido: "Importantes detalles sobre el fallo relacionado con la Conmoción en Catatumbo y sus implicaciones...",
            imagen: "https://placehold.co/800x600/222/666?text=Nacional",
            fecha: new Date().toISOString(),
            destacada: true
        },
        {
            id: 2,
            titulo: "Nuevas medidas económicas anunciadas por el gobierno",
            categoria: "Economía",
            contenido: "El gobierno nacional ha anunciado un paquete de medidas económicas...",
            imagen: "https://placehold.co/800x600/222/666?text=Economia",
            fecha: new Date().toISOString(),
            destacada: true
        },
        {
            id: 3,
            titulo: "Avances en la investigación científica local",
            categoria: "Ciencia",
            contenido: "Investigadores locales han logrado importantes avances...",
            imagen: "https://placehold.co/800x600/222/666?text=Ciencia",
            fecha: new Date().toISOString(),
            destacada: true
        },
        {
            id: 4,
            titulo: "Resultados deportivos del fin de semana",
            categoria: "Deportes",
            contenido: "Resumen completo de los resultados deportivos más importantes...",
            imagen: "https://placehold.co/800x600/222/666?text=Deportes",
            fecha: new Date().toISOString(),
            destacada: false
        },
        {
            id: 5,
            titulo: "Nuevos proyectos culturales en la ciudad",
            categoria: "Cultura",
            contenido: "La ciudad se prepara para recibir nuevos proyectos culturales...",
            imagen: "https://placehold.co/800x600/222/666?text=Cultura",
            fecha: new Date().toISOString(),
            destacada: false
        },
        {
            id: 6,
            titulo: "Actualización sobre el estado del tiempo",
            categoria: "Clima",
            contenido: "Pronóstico detallado del tiempo para los próximos días...",
            imagen: "https://placehold.co/800x600/222/666?text=Clima",
            fecha: new Date().toISOString(),
            destacada: false
        }
    ];

    try {
        localStorage.setItem('news', JSON.stringify(exampleNews));
        console.log('Datos de ejemplo guardados en localStorage:', exampleNews);
        return exampleNews;
    } catch (error) {
        console.error('Error al inicializar datos de ejemplo:', error);
        return [];
    }
};

// Llamar a la función de inicialización al cargar el servicio
initializeExampleData();

// --- Configuración general (logo) ---

export const getLogo = async () => {
  const logoRef = doc(db, CONFIG_COLLECTION, LOGO_DOC);
  const logoSnap = await getDoc(logoRef);
  if (logoSnap.exists()) {
    return logoSnap.data().url || '';
  }
  return '';
};

export const setLogo = async (url) => {
  const logoRef = doc(db, CONFIG_COLLECTION, LOGO_DOC);
  try {
    await updateDoc(logoRef, { url });
  } catch (e) {
    // Si el documento no existe, lo creamos
    await setDoc(logoRef, { url });
  }
};

export const createLogo = async (url) => {
  const logoRef = doc(db, CONFIG_COLLECTION, LOGO_DOC);
  await setDoc(logoRef, { url });
};

// Publicidad: obtener y guardar banner vertical
export const getPublicidad = async () => {
  const docRef = doc(db, 'publicidades', 'banner-vertical');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data(); // { imagen, url }
  } else {
    return { imagen: '', url: '' };
  }
};

export const setPublicidad = async (data) => {
  const docRef = doc(db, 'publicidades', 'banner-vertical');
  await setDoc(docRef, data, { merge: true });
};

// Publicidad: obtener y guardar banner horizontal
export const getPublicidadHorizontal = async () => {
  const docRef = doc(db, 'publicidades', 'banner-horizontal');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data(); // { imagen, url }
  } else {
    return { imagen: '', url: '' };
  }
};

export const setPublicidadHorizontal = async (data) => {
  const docRef = doc(db, 'publicidades', 'banner-horizontal');
  await setDoc(docRef, data, { merge: true });
}; 