import { Link } from "react-router-dom";
import ProtectedButton from "./ProtectedButton";
import { useAuth } from '@/hooks/useAuth';

const Sidebar = () => { // 👈 2. ASEGÚRATE DE QUE SEA UN COMPONENTE FUNCIONAL
  const { user } = useAuth(); // 👈 3. EXTRAE EL USUARIO AQUÍ

  return (

// components/Sidebar.tsx
<nav>
  {/* El Admin y el Empleado verán esto porque ambos tienen el permiso en el Seed */}
  <ProtectedButton permisos={['ver_sucursales']}>
    <Link to="/sucursales">Sucursales</Link>
  </ProtectedButton>

  <ProtectedButton permisos={['ver_mesas']}>
    <Link to="/mesas">Mesas</Link>
  </ProtectedButton>

  {/* 🍕 NUEVO: Menú de Platos */}
  <ProtectedButton permisos={['ver_platos']}>
    <Link to="/platos" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors">
      <span>Menú de Platos</span>
    </Link>
  </ProtectedButton>


  {/* 📖 NUEVO: Gestión de Recetas */}
    <ProtectedButton permisos={['ver_recetas']}>
      <Link to="/recetas" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors">
        <span>Recetas</span>
      </Link>
    </ProtectedButton>


    <ProtectedButton permisos={['ver_pedidos']}>
      <Link to="/pedidos" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors">
        <span>Pedidos</span>
      </Link>
    </ProtectedButton>

    {/* NUEVO: Item de Facturas */}
    <ProtectedButton permisos={['ver_facturas']}>
      <Link to="/facturas" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors">
        <span>
          {user?.rol.toLowerCase() === 'cliente' ? 'Mis Facturas' : 'Facturación'}
        </span>
      </Link>
    </ProtectedButton>


{/* 📦 NUEVO: Inventario de Ingredientes */}
      <ProtectedButton permisos={['ver_ingredientes']}>
        <Link to="/ingredientes" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors">
          <span>Inventario</span>
        </Link>
      </ProtectedButton>
      <div className="my-4 border-t border-gray-800" />

  

{/* 📝 Gestión de Ventas y Mesas */}
      <ProtectedButton permisos={['ver_pedidos']}>
        <Link to="/pedidos" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors">
          <span className="text-lg">🍽️</span>
          <span>Pedidos y Mesas</span>
        </Link>
      </ProtectedButton>

      {/* 📅 Módulo de Reservas */}
      <ProtectedButton permisos={['ver_reservas']}>
        <Link to="/reservas" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors">
          <span className="text-lg">📅</span>
          <span>Reservas</span>
        </Link>
      </ProtectedButton>

      <div className="my-4 border-t border-gray-800" />


      


  {/* Solo el Admin verá esto porque solo él tiene este permiso */}
  <ProtectedButton permisos={['gestionar_usuarios']}>
    <Link to="/usuarios">Usuarios</Link>
  </ProtectedButton>
</nav>
  );
} 
export default Sidebar;