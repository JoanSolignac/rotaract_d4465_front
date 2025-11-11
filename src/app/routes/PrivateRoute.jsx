import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../shared/hooks/useAuth.js';

const PrivateRoute = () => {
  const { isAuthenticated, status } = useAuth();

  if (status === 'pending') {
    return (
      <div className="route-guard__loading" role="status" aria-live="polite">
        Validando credenciales…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
