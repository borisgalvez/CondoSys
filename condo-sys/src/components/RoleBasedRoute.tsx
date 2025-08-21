import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface RoleBasedRouteProps {
  allowedRoles: string[];
}

export default function RoleBasedRoute({ allowedRoles }: RoleBasedRouteProps) {
  const { user } = useAuth();

  /* if (!user ) {
    return <Navigate to="/login" replace />;
  } */

  return allowedRoles.includes(user?user:localStorage.getItem("role")+'') ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace />
  );
}