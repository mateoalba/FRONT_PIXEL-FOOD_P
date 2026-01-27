import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";

const AdminLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  // --- LÓGICA DE STAFF UNIFICADA ---
  const rolUser = user?.rol?.toLowerCase();
  const isAdmin = rolUser === 'administrador' || rolUser === 'admin';
  const isEmpleado = rolUser === 'empleado';
  const isStaff = isAdmin || isEmpleado;

  if (!isStaff) {
    console.warn(`Acceso denegado: El rol '${user?.rol}' no tiene permisos de Staff.`);
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="flex h-screen bg-[#F4F7F6] overflow-hidden">
      {/* SIDEBAR OSCURO */}
      <Sidebar />

      {/* ÁREA DE CONTENIDO SIN HEADER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Se eliminó el bloque <header> para que no se repita el título */}
        
        <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFB]">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;