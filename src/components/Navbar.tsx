import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  Utensils, 
  Home, 
  Menu as MenuIcon, 
  CalendarCheck, 
  ShoppingCart, 
  Receipt, 
  LayoutDashboard,
  User 
} from 'lucide-react';

// Componente de Badge estilo Pixel
const PixelBadge = ({ children }: { children: React.ReactNode }) => (
  <span className="ml-2 bg-[#FBC02D] text-[#263238] border-2 border-black px-1.5 py-0.5 text-[10px] font-black leading-none shadow-[1px_1px_0px_#000]">
    {children}
  </span>
);

const Navbar = ({ cartItemsCount = 0 }) => {
  const location = useLocation();
  const { user, loading } = useAuth();

  // Función para saber si el link está activo
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // --- LÓGICA DE ROLES AJUSTADA ---
  const rolNombre = user?.rol?.toLowerCase();
  const isAdmin = rolNombre === 'administrador' || rolNombre === 'admin';
  const isEmpleado = rolNombre === 'empleado';
  const isStaff = isAdmin || isEmpleado; // Ambos entran al panel

  // Definición de links básicos
  const navLinks = [
    { name: 'HOME', path: '/home', icon: <Home className="w-5 h-5" strokeWidth={3} /> },
    { name: 'MENU', path: '/menu', icon: <MenuIcon className="w-5 h-5" strokeWidth={3} /> },
    { name: 'RESERVAS', path: '/reservas', icon: <CalendarCheck className="w-5 h-5" strokeWidth={3} /> },
    { name: 'MIS PEDIDOS', path: '/mis-pedidos', icon: <ShoppingCart className="w-5 h-5" strokeWidth={3} />, badge: cartItemsCount },
    { name: 'PAGO', path: '/caja', icon: <Receipt className="w-5 h-5" strokeWidth={3} /> },
  ];

  if (loading) return <div className="h-20 bg-white border-b-4 border-black animate-pulse w-full" />;

  return (
    <header className="bg-white border-b-4 border-black sticky top-0 z-50 w-full">
      {/* CAMBIO: Se eliminó 'container mx-auto' y se puso 'w-full' con padding lateral 'px-6' */}
      <div className="w-full px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* --- LOGO --- */}
          <Link to="/" className="flex items-center gap-3 group">
            <div 
              className="w-12 h-12 bg-[#E53935] border-4 border-black flex items-center justify-center group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" 
              style={{ boxShadow: '4px 4px 0px #000000' }}
            >
              <Utensils className="w-7 h-7 text-white" strokeWidth={3} />
            </div>
            <div>
              <h1 className="pixel-font text-base md:text-lg text-[#263238] leading-relaxed">PIXEL-FOOD</h1>
              <p className="text-xs font-black text-gray-500 hidden md:block uppercase leading-none">Tu Fast-Food Digital </p>
            </div>
          </Link>

          {/* --- NAVIGATION DESKTOP --- */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative flex items-center px-4 py-2 font-black uppercase text-[11px] border-2 transition-all
                  ${isActive(link.path)
                    ? 'bg-[#E53935] text-white border-black shadow-[3px_3px_0px_#000]'
                    : 'text-[#263238] border-transparent hover:border-black hover:bg-gray-100'
                  }`}
              >
                {link.icon}
                <span className="ml-2">{link.name}</span>
                {link.badge !== undefined && link.badge > 0 && (
                  <PixelBadge>{link.badge}</PixelBadge>
                )}
              </Link>
            ))}

          {/* BOTÓN STAFF */}
          {isStaff && (
            <Link
              to="/admin"
              className={`relative flex items-center px-4 py-2 font-black uppercase text-[11px] border-2 transition-all
                ${isActive('/admin')
                  ? 'bg-[#263238] text-white border-black shadow-[3px_3px_0px_#000]'
                  : isAdmin 
                    ? 'bg-yellow-400 text-black border-black shadow-[3px_3px_0px_#000] hover:bg-yellow-500' 
                    : 'bg-[#10B981] text-white border-black shadow-[3px_3px_0px_#000] hover:bg-[#059669]' 
                }`}
            >
              <LayoutDashboard className="w-5 h-5" strokeWidth={3} />
              <span className="ml-2">{isAdmin ? 'ADMIN' : 'EMPLEADO'}</span>
            </Link>
            )}
          </nav>

          {/* --- USER INFO / PROFILE --- */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:block text-right">
              <p className="text-[8px] font-black text-gray-400 uppercase leading-none italic">
                {user?.rol || 'Invitado'}
              </p>
              <p className="text-[10px] font-bold text-green-600 uppercase">
                {user?.nombre || 'Online'}
              </p>
            </div>
            <button className="bg-white border-2 border-black p-2 shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all">
              <User className="w-5 h-5 text-black" strokeWidth={3} />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;