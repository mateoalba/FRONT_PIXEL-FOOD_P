import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ProtectedButton from '@/components/ProtectedButton';
import { StockAlerts } from '@/components/StockAlerts';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-2">Bienvenido, {user?.nombre || 'Usuario'}</h2>
      <p className="text-gray-600 mb-8">Panel de control del sistema de gestión.</p>

      <ProtectedButton permisos={['ver_ingredientes']}>
        <StockAlerts />
      </ProtectedButton>

      {/* Grid de accesos directos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        
        {/* 🍕 NUEVA TARJETA: PLATOS */}
        <ProtectedButton permisos={['ver_platos']}>
          <Link to="/platos" className="flex flex-col items-center justify-center p-6 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition-all">
            <span className="text-orange-600 font-bold text-center">Menú de Platos</span>
            <span className="text-xs text-orange-400 mt-1">Gestión de la carta</span>
          </Link>
        </ProtectedButton>


        {/* 📖 NUEVA TARJETA: RECETAS */}
        <ProtectedButton permisos={['ver_recetas']}>
          <Link 
            to="/recetas" 
            className="flex flex-col items-center justify-center p-6 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-all"
          >
            <span className="text-indigo-600 font-bold text-center">Recetas</span>
            <span className="text-xs text-indigo-400 mt-1">Maestro de ingredientes</span>
          </Link>
        </ProtectedButton>


        <ProtectedButton permisos={['ver_categorias']}>
          <Link to="/categorias" className="flex flex-col items-center justify-center p-6 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-all">
            <span className="text-blue-600 font-bold text-center">Gestionar Categorías</span>
            <span className="text-xs text-blue-400 mt-1">Productos</span>
          </Link>
        </ProtectedButton>

        <ProtectedButton permisos={['ver_sucursales']}>
          <Link to="/sucursales" className="flex flex-col items-center justify-center p-6 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-all">
            <span className="text-green-600 font-bold text-center">Sucursales</span>
            <span className="text-xs text-green-400 mt-1">Sedes del negocio</span>
          </Link>
        </ProtectedButton>

        <ProtectedButton permisos={['ver_mesas']}>
          <Link to="/mesas" className="flex flex-col items-center justify-center p-6 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-all">
            <span className="text-amber-600 font-bold text-center">Mesas</span>
            <span className="text-xs text-amber-400 mt-1">Disponibilidad</span>
          </Link>
        </ProtectedButton>

        <ProtectedButton permisos={['ver_ingredientes']}>
          <Link 
            to="/ingredientes" 
            className="flex flex-col items-center justify-center p-6 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-all"
          >
            <span className="text-emerald-600 font-bold text-center">Inventario</span>
            <span className="text-xs text-emerald-400 mt-1">Stock de ingredientes</span>
          </Link>
        </ProtectedButton>

        <ProtectedButton permisos={['ver_pedidos']}>
          <Link to="/pedidos" className="flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-all">
            <span className="text-red-600 font-bold text-center">Pedidos</span>
            <span className="text-xs text-red-400 mt-1">Gestión de pedidos</span>
          </Link>
        </ProtectedButton>


        {/* NUEVO: Botón de Facturas */}
        <ProtectedButton permisos={['ver_facturas']}>
          <Link to="/facturas" className="flex flex-col items-center justify-center p-6 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-all">
            <span className="text-green-600 font-bold text-center">
              {user?.rol.toLowerCase() === 'cliente' ? 'Mis Facturas' : 'Facturación'}
            </span>
            <span className="text-xs text-green-400 mt-1">
              {user?.rol.toLowerCase() === 'cliente' ? 'Consulta tus pagos' : 'Historial de ventas'}
            </span>
          </Link>
        </ProtectedButton>



        <ProtectedButton permisos={['gestionar_usuarios']}>
          <Link to="/usuarios" className="flex flex-col items-center justify-center p-6 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-all">
            <span className="text-purple-600 font-bold text-center">Usuarios</span>
            <span className="text-xs text-purple-400 mt-1">Roles y permisos</span>
          </Link>
        </ProtectedButton>

      </div>
    </div>
  );
};

export default Home;