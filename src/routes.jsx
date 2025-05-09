import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Noticias from './pages/Noticias';
import Deportes from './pages/Deportes';
import ZonaInteractiva from './pages/ZonaInteractiva';
import NoticiaDetalle from './pages/NoticiaDetalle';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useState, useEffect } from 'react';
import { getPublicidadHorizontal } from './services/newsService';

const AppRoutes = () => {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';
  const [bannerH, setBannerH] = useState({ imagen: '', url: '' });

  useEffect(() => {
    const fetchBannerH = async () => {
      const pub = await getPublicidadHorizontal();
      setBannerH(pub);
    };
    fetchBannerH();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      {!isAdminPage && (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 24 }}>
          {bannerH.imagen ? (
            <a href={bannerH.url || '#'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', width: 728, height: 90, display: 'block' }}>
              <div style={{ width: 728, height: 90, background: '#fff', color: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', fontWeight: 600, fontSize: 20, overflow: 'hidden' }}>
                <img src={bannerH.imagen} alt="Publicidad Horizontal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </a>
          ) : (
            <div style={{ width: 728, height: 90, background: '#fff', color: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', fontWeight: 600, fontSize: 20 }}>
              Publicidad
            </div>
          )}
        </div>
      )}
      <main style={{ flex: 1, padding: '20px 0' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/deportes" element={<Deportes />} />
          <Route path="/zona-interactiva" element={<ZonaInteractiva />} />
          <Route path="/noticias/:id" element={<NoticiaDetalle />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default AppRoutes; 