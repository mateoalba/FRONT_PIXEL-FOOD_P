import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface RoleRouteProps {
  roles?: string[];      // Opcional
  permisos?: string[];   // Opcional
}

const RoleRoute = ({ roles, permisos }: RoleRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 1. Verificación por ROL (si se especifican roles)
  if (roles && !roles.includes(user.rol)) {
    return <Navigate to="/unauthorized" replace />; // O a home
  }

  // 2. Verificación por PERMISOS (si se especifican permisos)
  // Si se pasan permisos, el usuario debe tener al menos UNO de ellos (lógica .some)
  if (permisos && !permisos.some(p => user.permisos?.includes(p))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;