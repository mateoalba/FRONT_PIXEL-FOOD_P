import { useState, useEffect } from 'react';
import { Plus, ShoppingCart, LayoutGrid, Loader2 } from 'lucide-react';
import { useCrud } from '@/hooks/useCrud';
import { categoriasApi } from '@/api/categorias';
import { platosApi } from '@/api/platos';
import type { Plato, Categoria } from '@/types';

interface MenuPageProps {
  onNavigate: (page: string) => void;
  cart: any[];
  setCart: (cart: any[]) => void;
}

export default function MenuPage({ onNavigate, cart, setCart }: MenuPageProps) {
  // 1. Cargar Datos desde tus APIs
  const { data: categorias, loading: loadingCats } = useCrud<Categoria>(categoriasApi);
  const { data: platos, loading: loadingPlatos } = useCrud<Plato>(platosApi);
  
  // AJUSTE DE TIPO: Usamos string | null para coincidir con tus capturas de error
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 2. Seleccionar la primera categoría automáticamente al cargar
  useEffect(() => {
    if (categorias.length > 0 && selectedCategory === null) {
      // Coincidimos con el tipo string que viene de la API
      setSelectedCategory(String(categorias[0].id_categoria));
    }
  }, [categorias, selectedCategory]);

  const addToCart = (plato: Plato) => {
    const existingItem = cart.find((item) => item.id === plato.id_plato);
    if (existingItem) {
      setCart(cart.map((item) =>
        item.id === plato.id_plato ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { 
        id: plato.id_plato, 
        name: plato.nombre, 
        price: Number(plato.precio), 
        quantity: 1,
        image: '' 
      }]);
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (loadingCats || loadingPlatos) {
    return (
      <div className="min-h-screen bg-[#263238] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
        <p className="text-white font-black mt-4 uppercase italic">Cargando Menú...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#263238] via-[#37474F] to-[#455A64] pb-20">
      
      {/* HEADER */}
      <div className="bg-[#263238] border-b-4 border-black sticky top-0 z-50 shadow-[0px_4px_0px_#000]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-[#E53935] p-2 border-2 border-black shadow-[3px_3px_0px_#000]">
                <LayoutGrid className="text-white w-6 h-6" strokeWidth={3} />
             </div>
             <div>
                <h1 className="text-xl md:text-2xl text-white font-black uppercase italic leading-none">Pixel Food</h1>
                <p className="text-yellow-400 font-bold text-[10px] uppercase tracking-tighter">Categorías Actualizadas</p>
             </div>
          </div>

          <button
            onClick={() => onNavigate('orders')}
            className="bg-[#E53935] hover:bg-[#C62828] text-white border-4 border-black px-4 py-2 font-black uppercase flex items-center gap-2 transition-all shadow-[4px_4px_0px_#000] active:shadow-none"
          >
            <ShoppingCart className="h-5 w-5" strokeWidth={3} />
            <span className="hidden sm:inline">Pedido</span>
            {totalItems > 0 && (
              <span className="bg-yellow-400 text-black px-2 py-0.5 border-2 border-black text-xs">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        
        {/* SELECTOR DE CATEGORÍAS */}
        <div className="flex flex-wrap gap-3 mb-10 bg-white p-3 border-4 border-black shadow-[8px_8px_0px_#000]">
          {categorias.map((cat) => (
            <button
              key={cat.id_categoria}
              onClick={() => setSelectedCategory(String(cat.id_categoria))}
              className={`px-6 py-2 font-black uppercase border-2 transition-all ${
                selectedCategory === String(cat.id_categoria)
                  ? 'bg-[#FB8C00] text-white border-black shadow-[3px_3px_0px_#000]'
                  : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200'
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>

        {/* LISTADO DE PLATOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {platos
            .filter(plato => String(plato.id_categoria) === selectedCategory)
            .map((plato) => (
              <div
                key={plato.id_plato}
                className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-transform overflow-hidden flex flex-col"
              >
                <div className="relative h-44 bg-linear-to-b from-gray-100 to-gray-200 border-b-4 border-black flex items-center justify-center text-5xl">
                   🍔
                   {!plato.disponible && (
                     <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="bg-white text-red-600 border-4 border-red-600 px-4 py-1 font-black uppercase -rotate-12">
                          Agotado
                        </span>
                     </div>
                   )}
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="text-lg font-black text-[#263238] uppercase italic leading-tight">
                      {plato.nombre}
                    </h3>
                    <span className="text-xl font-black text-[#E53935] whitespace-nowrap">
                      ${Number(plato.precio).toFixed(2)}
                    </span>
                  </div>

                  <p className="text-gray-500 font-bold text-[11px] uppercase mb-6 line-clamp-2 flex-1">
                    {plato.descripcion}
                  </p>

                  <button
                    disabled={!plato.disponible}
                    onClick={() => addToCart(plato)}
                    className={`w-full py-3 border-4 border-black font-black uppercase flex items-center justify-center gap-2 transition-all shadow-[4px_4px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1 ${
                      plato.disponible 
                        ? 'bg-[#43A047] hover:bg-[#388E3C] text-white cursor-pointer' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400 shadow-none'
                    }`}
                  >
                    <Plus className="w-5 h-5" strokeWidth={4} />
                    Añadir
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Estado vacío */}
        {platos.filter(p => String(p.id_categoria) === selectedCategory).length === 0 && (
          <div className="text-center py-32 border-4 border-dashed border-black/20 rounded-xl">
             <p className="text-white/30 font-black uppercase text-2xl italic">No hay platos disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
}