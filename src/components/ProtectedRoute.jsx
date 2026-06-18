import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Placeholder for admin check logic
  // For production, you might have an 'admins' table or 'role' in raw_user_meta_data
  // if (adminOnly && !user.user_metadata?.isAdmin) {
  //   return <Navigate to="/" replace />;
  // }

  return <Outlet />;
};

export default ProtectedRoute;
