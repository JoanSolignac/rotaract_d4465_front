import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../shared/hooks/useAuth.js';

const PublicRoute = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const authPages = ['/login', '/signup'];

  if (isAuthenticated && authPages.includes(location.pathname)) {
    return <Navigate to="/panel" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
