import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * Protects routes based on user role
 * - Admin routes: requires isAdmin=true
 * - Customer routes: requires isAdmin=false
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !user.isAdmin) {
    // Customer trying to access admin route
    return <Navigate to="/" replace />;
  }

  if (!requireAdmin && user.isAdmin) {
    // Admin trying to access customer route
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;

