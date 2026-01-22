import type { JSX } from "react";
import { useAuth } from "../hooks/useAuth";

const ProtectedButton = ({
  roles,
  permisos,
  children,
}: {
  roles?: string[];
  permisos?: string[];
  children: JSX.Element;
}) => {
  const { user } = useAuth();

  if (!user) return null;

  if (roles && !roles.map(r => r.toLowerCase()).includes(user.rol.toLowerCase())) return null;

  if (
    permisos &&
    !permisos.some(p => user.permisos?.includes(p))
  ) {
    return null;
  }

  return children;
};

export default ProtectedButton;