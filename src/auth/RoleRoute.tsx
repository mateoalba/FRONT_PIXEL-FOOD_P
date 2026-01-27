import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface RoleRouteProps {
  roles?: string[];      // Ejemplo: ["Administrador", "Mesero"]
  permisos?: string[];   // Ejemplo: ["ver_ventas"]
}

const RoleRoute = ({ roles, permisos }: RoleRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  // Si no hay usuario, directo al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 1. Verificación por ROL (Normalizado a minúsculas para evitar errores)
  if (roles) {
    const userRolNormalizado = user.rol.toLowerCase();
    const tieneRol = roles.some(rol => rol.toLowerCase() === userRolNormalizado);
    
    if (!tieneRol) {
      console.warn(`Acceso denegado: El rol '${user.rol}' no está en la lista permitida.`);
      return <Navigate to="/home" replace />;
    }
  }

  // 2. Verificación por PERMISOS
  // Usamos encadenamiento opcional ?. por si user.permisos es null
  if (permisos) {
    const tienePermiso = permisos.some(p => user.permisos?.includes(p));
    
    if (!tienePermiso) {
      console.warn("Acceso denegado: El usuario no cuenta con los permisos necesarios.");
      return <Navigate to="/home" replace />;
    }
  }

  return <Outlet />;
};

export default RoleRoute;