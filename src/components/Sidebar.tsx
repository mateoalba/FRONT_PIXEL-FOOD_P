import { Link, useLocation } from "react-router-dom";
import ProtectedButton from "./ProtectedButton";
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, UtensilsCrossed, ClipboardList, 
  Box, Users, CalendarCheck, BookOpen, Layers, 
  UserCog, Store, Package, FileText, Home 
} from "lucide-react";

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const activeClass = (path: string) => {
    const isActive = location.pathname === path;
    return isActive 
      ? "bg-[#E53935] text-white border-2 border-black shadow-[4px_4px_0px_#000]" 
      : "text-slate-300 hover:bg-slate-700 hover:text-white transition-all";
  };

  return (
    <nav className="flex flex-col h-screen w-64 bg-[#1A2226] border-r-4 border-black shrink-0 overflow-hidden">
      
      {/* HEADER DEL SIDEBAR: BOTÓN IZQUIERDA + TEXTO DERECHA EXPANDIDO */}
      <div className="p-5 bg-[#11181C] border-b-4 border-black flex items-center gap-3">
        
        {/* BOTÓN HOME */}
        <Link 
          to="/home" 
          title="Regresar al Inicio"
          className="bg-[#263238] hover:bg-[#35e558] text-white border-2 border-black p-2 transition-all shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none shrink-0"
        >
          <Home className="w-6 h-6" strokeWidth={3} />
        </Link>

        {/* TÍTULO: OCUPA EL ESPACIO RESTANTE Y JUSTIFICA A LA DERECHA */}
        <div className="flex-1">
          <h2 className="pixel-font text-[15px] text-yellow-500 tracking-tighter uppercase font-black italic leading-[1.3] text-right">
            Panel de <br /> Control
          </h2>
        </div>
      </div>

      {/* CONTENEDOR CON SCROLL INVISIBLE */}
      <div className="grow overflow-y-auto p-4 space-y-4 no-scrollbar" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
        
        {/* SECCIÓN: OPERACIONES */}
        <div className="space-y-2">
          <p className="text-[9px] font-black text-slate-500 uppercase px-2 italic">Operaciones</p>
          
          <Link to="/admin" className={`flex items-center gap-3 px-3 py-3 font-bold text-xs ${activeClass('/admin')}`}>
            <LayoutDashboard className="w-5 h-5" />
            <span>RESUMEN</span>
          </Link>

          <ProtectedButton permisos={['ver_pedidos']}>
            <Link to="/admin/pedidos" className={`flex items-center gap-3 px-3 py-3 font-bold text-xs ${activeClass('/admin/pedidos')}`}>
              <ClipboardList className="w-5 h-5" />
              <span>PEDIDOS</span>
            </Link>
          </ProtectedButton>

          <ProtectedButton permisos={['ver_mesas']}>
            <Link to="/admin/mesas" className={`flex items-center gap-3 px-3 py-3 font-bold text-xs ${activeClass('/admin/mesas')}`}>
              <Store className="w-5 h-5" />
              <span>MESAS</span>
            </Link>
          </ProtectedButton>

          <ProtectedButton permisos={['ver_recetas']}>
            <Link to="/admin/recetas" className={`flex items-center gap-3 px-3 py-3 font-bold text-xs ${activeClass('/admin/recetas')}`}>
              <BookOpen className="w-5 h-5" />
              <span>RECETAS</span>
            </Link>
          </ProtectedButton>

          <ProtectedButton permisos={['ver_categorias']}>
            <Link to="/admin/categorias" className={`flex items-center gap-3 px-3 py-3 font-bold text-xs ${activeClass('/admin/categorias')}`}>
              <Layers className="w-5 h-5" />
              <span>CATEGORIAS</span>
            </Link>
          </ProtectedButton>

          <ProtectedButton permisos={['ver_reservas']}>
            <Link to="/admin/reservas" className={`flex items-center gap-3 px-3 py-3 font-bold text-xs ${activeClass('/admin/reservas')}`}>
              <CalendarCheck className="w-5 h-5" />
              <span>RESERVAS</span>
            </Link>
          </ProtectedButton>
        </div>

        {/* SECCIÓN: LOGÍSTICA */}
        <div className="space-y-2 pt-4">
          <p className="text-[9px] font-black text-slate-500 uppercase px-2 italic">Logística</p>

          <ProtectedButton permisos={['gestionar_usuarios']}>
            <Link to="/admin/usuarios" className={`flex items-center gap-3 px-3 py-3 font-bold text-xs ${activeClass('/admin/usuarios')}`}>
              <UserCog className="w-5 h-5" />
              <span>USUARIOS</span>
            </Link>
          </ProtectedButton>

          <ProtectedButton permisos={['ver_platos']}>
            <Link to="/admin/platos" className={`flex items-center gap-3 px-3 py-3 font-bold text-xs ${activeClass('/admin/platos')}`}>
              <UtensilsCrossed className="w-5 h-5" />
              <span>GESTIÓN MENÚ</span>
            </Link>
          </ProtectedButton>

          <ProtectedButton permisos={['ver_sucursales']}>
            <Link to="/admin/sucursales" className={`flex items-center gap-3 px-3 py-3 font-bold text-xs ${activeClass('/admin/sucursales')}`}>
              <Box className="w-5 h-5" />
              <span>SUCURSALES</span>
            </Link>
          </ProtectedButton>

          <ProtectedButton permisos={['ver_ingredientes']}>
            <Link to="/admin/ingredientes" className={`flex items-center gap-3 px-3 py-3 font-bold text-xs ${activeClass('/admin/ingredientes')}`}>
              <Package className="w-5 h-5" />
              <span>STOCK</span>
            </Link>
          </ProtectedButton>

          <ProtectedButton permisos={['ver_facturas']}>
            <Link to="/admin/facturas" className={`flex items-center gap-3 px-3 py-3 font-bold text-xs ${activeClass('/admin/facturas')}`}>
              <FileText className="w-5 h-5" />
              <span>FACTURAS</span>
            </Link>
          </ProtectedButton>
        </div>
      </div>

      {/* USER FOOTER */}
      <div className="mt-auto p-4 bg-[#11181C] border-t-4 border-black">
        <div className="flex items-center gap-3 border-2 border-black bg-slate-800 p-2 shadow-[3px_3px_0px_#000]">
          <div className="w-8 h-8 bg-purple-500 border-2 border-black flex items-center justify-center shrink-0">
             <Users className="w-4 h-4 text-white" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] font-bold text-white truncate uppercase">{user?.nombre || 'Admin'}</p>
            <p className="text-[8px] text-green-400 font-bold uppercase tracking-tighter italic">Online</p>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Sidebar;