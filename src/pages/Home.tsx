import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  Utensils, 
  CalendarCheck, 
  Pizza, 
  Coffee, 
  Drumstick, 
  Flame,
  ClipboardList
} from "lucide-react";
import { useEffect, useState } from 'react';

const Home = () => {
  const { user } = useAuth();
  const [particles, setParticles] = useState<{id: number, left: string, duration: string, size: number, color: string, type: string, delay: string, rotation: string}[]>([]);

  useEffect(() => {
    const types = ['square', 'triangle'];
    const colors = ['#FFFF00', '#00FFFF', '#00FF00', '#FF8C00', '#FF0000']; 
    const newParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 90}%`, 
      duration: `${Math.random() * 3 + 4}s`, 
      delay: `${Math.random() * -10}s`,
      size: Math.floor(Math.random() * 15 + 20),
      color: colors[Math.floor(Math.random() * colors.length)],
      type: types[Math.floor(Math.random() * types.length)],
      rotation: Math.random() > 0.5 ? '360deg' : '-360deg'
    }));
    setParticles(newParticles);
  }, []);

  const categories = [
    { name: 'Hamburguesas', icon: <Pizza className="w-10 h-10" />, color: 'bg-[#E53935]', items: '12 opciones' },
    { name: 'Papas Fritas', icon: <Flame className="w-10 h-10" />, color: 'bg-[#FBC02D]', items: '8 opciones' },
    { name: 'Bebidas', icon: <Coffee className="w-10 h-10" />, color: 'bg-[#43A047]', items: '15 opciones' },
    { name: 'Combos', icon: <Drumstick className="w-10 h-10" />, color: 'bg-[#FB8C00]', items: '10 opciones' },
  ];

  return (
    <div className="w-full min-h-screen bg-white font-sans pb-20 overflow-x-hidden">
      
      <style>{`
        @keyframes fallMain {
          0% { transform: translateY(-10vh) rotate(0deg); }
          100% { transform: translateY(110vh) rotate(var(--rot)); }
        }
        @keyframes swing {
          0%, 100% { transform: translateX(-15px); }
          50% { transform: translateX(15px); }
        }
        @keyframes strong-pulse {
          0%, 100% { transform: scale(0.85); }
          50% { transform: scale(1); }
        }
        .animate-mega-pulse { 
          animation: strong-pulse 4s ease-in-out infinite;
          transform-origin: center center;
        }
      `}</style>

      {/* HEADER / HERO SECTION */}
      <div className="relative w-full bg-[#E53935] text-white border-b-8 border-black overflow-hidden min-h-150 flex items-center justify-center">
        
        {/* BLOQUE DE ANIMACIÓN UNIFICADO */}
        <div className="absolute inset-0 flex items-center justify-center animate-mega-pulse">
          
          {/* MALLA DE FONDO SOBREDIMENSIONADA */}
          <div className="absolute w-[150%] h-[150%] opacity-25 pointer-events-none" style={{
              backgroundImage: `linear-gradient(0deg, transparent 24%, #fff 25%, #fff 26%, transparent 27%, transparent 74%, #fff 75%, #fff 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #fff 25%, #fff 26%, transparent 27%, transparent 74%, #fff 75%, #fff 76%, transparent 77%, transparent)`,
              backgroundSize: '100px 100px'
          }}></div>

          {/* PARTÍCULAS - CAPA TRASERA (z-0) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden h-full w-full z-0">
            {particles.map((p) => (
              <div
                key={p.id}
                className="absolute"
                style={{
                  left: p.left,
                  top: '-50px',
                  animation: `fallMain ${p.duration} linear infinite`,
                  animationDelay: p.delay,
                  // @ts-ignore
                  '--rot': p.rotation
                } as any}
              >
                <div 
                  style={{
                    width: p.size,
                    height: p.size,
                    animation: 'swing 3s ease-in-out infinite',
                    backgroundColor: p.type === 'square' ? p.color : 'transparent',
                    borderLeft: p.type === 'triangle' ? `${p.size / 2}px solid transparent` : '',
                    borderRight: p.type === 'triangle' ? `${p.size / 2}px solid transparent` : '',
                    borderBottom: p.type === 'triangle' ? `${p.size}px solid ${p.color}` : '',
                  }}
                />
              </div>
            ))}
          </div>

          {/* CONTENIDO PRINCIPAL - CAPA DELANTERA (z-10) */}
          <div className="relative z-10 container mx-auto px-6 text-center">
            <div className="inline-flex items-center justify-center w-28 h-28 bg-white border-4 border-black mb-8 shadow-[8px_8px_0px_#000]">
              <Utensils className="w-16 h-16 text-[#E53935]" strokeWidth={3} />
            </div>
            
            <h1 className="pixel-font text-6xl md:text-8xl mb-6 uppercase tracking-tighter" style={{ textShadow: '8px 8px 0px #000' }}>
              PIXEL-FOOD
            </h1>
            
            <p className="text-2xl font-black uppercase mb-12">
              Bienvenido, <span className="text-yellow-300">{user?.nombre || 'Mateo'}</span>
            </p>

            <div className="flex flex-wrap gap-8 justify-center">
              <Link to="/menu" className="pixel-font bg-white text-[#E53935] border-4 border-black px-12 py-5 text-lg shadow-[6px_6px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-2">
                <ClipboardList className="w-6 h-6" strokeWidth={3} /> PEDIDOS
              </Link>
              <Link to="/reservas" className="pixel-font bg-[#FBC02D] text-black border-4 border-black px-12 py-5 text-lg shadow-[6px_6px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-2">
                <CalendarCheck className="w-6 h-6" strokeWidth={3} /> RESERVAR
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORIES GRID */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="pixel-font text-3xl md:text-5xl text-center mb-16 uppercase leading-relaxed">Categorías</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, i) => (
            <div key={i} className="bg-white border-4 border-black p-8 text-center shadow-[8px_8px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-transform cursor-pointer group">
              <div className={`${cat.color} w-24 h-24 border-4 border-black mx-auto mb-6 flex items-center justify-center text-white shadow-[4px_4px_0px_#000]`}>
                {cat.icon}
              </div>
              <h3 className="text-2xl font-black uppercase mb-1">{cat.name}</h3>
              <p className="text-sm font-bold text-gray-400 uppercase">{cat.items}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PROMO SECTION - OFERTA DEL DÍA AMARILLA */}
      <div className="bg-linear-to-r from-[#FBC02D] to-[#F9A825] py-16 border-y-8 border-black relative overflow-hidden">
        {/* Pixel Decorations Corner */}
        <div className="absolute top-4 left-4 w-8 h-8 bg-[#E53935] border-2 border-black"></div>
        <div className="absolute top-4 right-4 w-8 h-8 bg-[#E53935] border-2 border-black"></div>
        <div className="absolute bottom-4 left-8 w-12 h-12 bg-[#E53935] border-2 border-black"></div>
        <div className="absolute bottom-4 right-8 w-12 h-12 bg-[#E53935] border-2 border-black"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-block bg-[#E53935] text-white px-6 py-2 border-4 border-black mb-6 font-black uppercase shadow-[4px_4px_0px_#000]">
            ¡OFERTA ESPECIAL!
          </div>
          <h2 className="pixel-font text-xl md:text-3xl text-[#263238] mb-6 leading-relaxed">
            Combo del día
          </h2>
          <p className="text-xl font-black text-[#263238] mb-8 uppercase">
            2 hamburguesas + papas grandes + 2 bebidas
          </p>
          <div className="text-6xl font-black text-[#E53935] mb-8" style={{ textShadow: '4px 4px 0px #000' }}>
            $15.99
          </div>
          <Link 
            to="/menu"
            className="inline-block bg-[#E53935] text-white border-4 border-black px-12 py-6 text-xl font-black uppercase shadow-[6px_6px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-transform"
          >
            Ordenar Ahora
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;