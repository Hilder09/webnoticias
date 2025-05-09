import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  if (!user || !isAdmin) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute; 