import { platosApi } from '@/api/platos';
import { recetasApi } from '@/api/recetas';
import type { Receta } from '@/types/receta';
import type { Plato } from '@/types/plato';
import { useCrud } from '@/hooks/useCrud';
import { RecetasModal } from '@/components/modal/RecetasModal';
import { ConfirmModal } from '@/components/modal/ConfirmModal';
import { useState, useEffect, useMemo } from 'react';
import ProtectedButton from '@/components/ProtectedButton';
import { useAuth } from '@/hooks/useAuth';
import { 
  ChefHat, 
  Plus, 
  Trash2, 
  Edit3, 
  Package, 
  AlertCircle,
  Eye
} from 'lucide-react';

export default function Recetas() {
  const { data: recetas, loading, error, refresh, deleteItem } = useCrud<Receta>(recetasApi);
  const { user } = useAuth();
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPlato, setSelectedPlato] = useState<Plato | null>(null);

  useEffect(() => {
    platosApi.getAll().then(setPlatos);
  }, []);

  const tableData = useMemo(() => {
    return platos.map(plato => {
      const misIngredientes = recetas.filter(r => 
        r.plato?.id_plato === plato.id_plato
      );
      
      return {
        ...plato,
        resumen: misIngredientes.map(i => ({
          id_receta: i.id_receta,
          nombre: i.ingrediente?.nombre || 'Insumo',
          cantidad: i.cantidad,
          unidad: i.ingrediente?.unidad_medida || ''
        }))
      };
    }).sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [platos, recetas]);

  const handleDeleteAll = async () => {
    if (!selectedPlato) return;
    const itemsToDelete = recetas.filter(r => 
      r.plato?.id_plato === selectedPlato.id_plato
    );
    
    for (const item of itemsToDelete) {
      await deleteItem(item.id_receta);
    }
    setConfirmOpen(false);
    refresh();
  };

  const esAdmin = user?.rol === 'admin';

  return (
    <div className="min-h-screen bg-linear-to-br from-[#263238] via-[#37474F] to-[#455A64] pb-10 font-sans">
      
      {/* HEADER ESTILO FIGMA */}
      <div className="bg-[#263238] border-b-4 border-black mb-8" style={{ boxShadow: '0px 4px 0px #000000' }}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#E53935] border-4 border-black flex items-center justify-center" style={{ boxShadow: '4px 4px 0px #000000' }}>
                <ChefHat className="w-8 h-8 text-white" strokeWidth={3} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl text-white font-black uppercase leading-relaxed">
                  Maestro de Recetas
                </h1>
                <p className="text-yellow-400 font-bold uppercase text-sm tracking-widest">PIXEL-FOOD - Control de Producción</p>
              </div>
            </div>
            
            <ProtectedButton permisos={['crear_recetas']}>
              <button
                onClick={() => { setSelectedPlato(null); setModalOpen(true); }}
                className="bg-[#FB8C00] hover:bg-[#f57c00] text-white border-4 border-black font-black uppercase px-6 py-2 hover:translate-x-1 hover:translate-y-1 transition-transform flex items-center gap-2"
                style={{ boxShadow: '4px 4px 0px #000000' }}
              >
                <Plus className="w-5 h-5" strokeWidth={4} /> Nueva Receta
              </button>
            </ProtectedButton>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {error && (
          <div className="bg-white border-4 border-black p-4 mb-6 text-[#E53935] font-black flex items-center gap-2 shadow-[4px_4px_0px_#000000]">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}

        {/* CONTENEDOR DE LISTADO */}
        <div className="bg-white border-4 border-black" style={{ boxShadow: '8px 8px 0px #000000' }}>
          <div className="bg-linear-to-r from-purple-50 to-pink-50 border-b-4 border-black p-6">
            <h2 className="text-[#263238] font-black uppercase text-xl">Configuración de Ingredientes por Plato</h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#E53935]"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {tableData.map((plato) => (
                  <div 
                    key={plato.id_plato} 
                    className="border-4 border-black bg-white p-6 hover:translate-x-1 hover:translate-y-1 transition-all relative group"
                    style={{ boxShadow: '4px 4px 0px #000000' }}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-14 h-14 bg-[#9C27B0] border-4 border-black flex items-center justify-center shrink-0" style={{ boxShadow: '3px 3px 0px #000000' }}>
                          <ChefHat className="w-8 h-8 text-white" strokeWidth={3} />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <h3 className="font-black text-xl text-[#263238] uppercase italic">{plato.nombre}</h3>
                            <span className="bg-[#E53935] text-white px-2 py-0.5 border-2 border-black font-black text-[10px] uppercase shadow-[2px_2px_0px_#000000]">
                              {plato.categoria?.nombre || 'General'}
                            </span>
                          </div>

                          <div className="mt-4">
                            <p className="text-[10px] text-gray-400 font-black uppercase mb-3 tracking-tighter">Composición de la Receta:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {plato.resumen.map((ing: any) => (
                                <div key={ing.id_receta} className="flex items-center gap-2 bg-gray-50 border-2 border-black p-2 shadow-[2px_2px_0px_#000000]">
                                  <div className="w-6 h-6 bg-[#43A047] border-2 border-black flex items-center justify-center shrink-0">
                                    <Package className="w-3 h-3 text-white" strokeWidth={3} />
                                  </div>
                                  <span className="text-[11px] font-bold text-[#263238] uppercase truncate">
                                    {ing.nombre}: <span className="text-blue-600 font-black">{ing.cantidad} {ing.unidad}</span>
                                  </span>
                                </div>
                              ))}
                              {plato.resumen.length === 0 && (
                                <p className="text-gray-400 italic text-xs font-bold uppercase">⚠️ Sin ingredientes configurados</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ACCIONES */}
                      <div className="flex md:flex-col gap-3 self-center md:self-start">
                        <button 
                          onClick={() => { setSelectedPlato(plato); setModalOpen(true); }}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-black font-black text-[10px] uppercase shadow-[3px_3px_0px_#000000] hover:bg-yellow-400 transition-colors min-w-35"
                        >
                          {esAdmin ? (
                            <>
                              <Edit3 className="w-3 h-3" strokeWidth={3} />
                              Gestionar Receta
                            </>
                          ) : (
                            <>
                              <Eye className="w-3 h-3" strokeWidth={3} />
                              Ver Receta
                            </>
                          )}
                        </button>

                        <ProtectedButton permisos={['eliminar_recetas']}>
                          <button 
                            onClick={() => { setSelectedPlato(plato); setConfirmOpen(true); }}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-[#E53935] border-2 border-[#E53935] font-black text-[10px] uppercase shadow-[3px_3px_0px_#E53935] hover:bg-[#E53935] hover:text-white transition-all min-w-35"
                          >
                            <Trash2 className="w-3 h-3" strokeWidth={3} />
                            Eliminar Todo
                          </button>
                        </ProtectedButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {modalOpen && (
        <RecetasModal
          open={modalOpen}
          onClose={() => { setModalOpen(false); refresh(); }}
          plato={selectedPlato}
        />
      )}

      <ConfirmModal
        open={confirmOpen}
        title="¿ELIMINAR TODA LA RECETA?"
        message={`Se quitarán permanentemente todos los ingredientes de: ${selectedPlato?.nombre}.`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDeleteAll}
      />
    </div>
  );
}