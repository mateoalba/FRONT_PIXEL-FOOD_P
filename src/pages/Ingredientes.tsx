import { useState } from 'react';
import { ingredientesApi } from '@/api/ingredientes';
import type { Ingrediente } from '@/types';
import { useCrud } from '@/hooks/useCrud';
import { CrudModal, type Field } from '@/components/modal/CrudModal';
import { ConfirmModal } from '@/components/modal/ConfirmModal';
import ProtectedButton from '@/components/ProtectedButton';
import { useAuth } from '@/hooks/useAuth';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  AlertCircle, 
  ChevronRight,
  TrendingDown
} from 'lucide-react';

export default function Ingredientes() {
  const { 
    data, 
    loading, 
    error, 
    createItem, 
    updateItem, 
    deleteItem, 
    refresh,
  } = useCrud<Ingrediente, typeof ingredientesApi>(ingredientesApi);

  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<Ingrediente | null>(null);

  const puedeEditarTodo = user?.permisos.includes('editar_ingredientes');
  const puedeEditarStock = user?.permisos.includes('editar_stock_ingredientes');
  const puedeEliminar = user?.permisos.includes('eliminar_ingredientes');
  const mostrarAcciones = puedeEditarTodo || puedeEditarStock || puedeEliminar;

  const fields: Field<Ingrediente>[] = [
    { 
      name: 'nombre', 
      label: 'Nombre Ingrediente', 
      required: true, 
      disabled: !!(selected && !puedeEditarTodo) 
    },
    { 
      name: 'unidad_medida', 
      label: 'Unidad (kg, l, unidad)', 
      required: true,
      disabled: !!(selected && !puedeEditarTodo) 
    },
    { 
      name: 'stock', 
      label: 'Cantidad en Stock', 
      type: 'number', 
      required: true 
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-[#263238] via-[#37474F] to-[#455A64] pb-10">
      
      {/* HEADER ESTILO FIGMA */}
      <div className="bg-[#263238] border-b-4 border-black mb-8" style={{ boxShadow: '0px 4px 0px #000000' }}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#00897B] border-4 border-black flex items-center justify-center" style={{ boxShadow: '4px 4px 0px #000000' }}>
                <Package className="w-8 h-8 text-white" strokeWidth={3} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl text-white font-black uppercase leading-relaxed italic">
                  Inventario de Ingredientes
                </h1>
                <p className="text-yellow-400 font-bold uppercase text-sm tracking-widest">PIXEL-FOOD - Control de Insumos</p>
              </div>
            </div>
            
          <ProtectedButton permisos={['crear_ingredientes']}>
            <button
              onClick={() => { setSelected(null); setModalOpen(true); }}
              // Cambiamos bg-[#FB8C00] por bg-[#00897B] y el hover por un tono más oscuro
              className="bg-[#00897B] hover:bg-[#00796B] text-white border-4 border-black font-black uppercase px-6 py-2 hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-2 active:shadow-none active:translate-x-1 active:translate-y-1"
              style={{ boxShadow: '4px 4px 0px #000000' }}
            >
              <Plus className="w-5 h-5" strokeWidth={4} /> 
              Nuevo Ingrediente
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

        {/* CONTENEDOR DE TABLA ESTILO FIGMA */}
        <div className="bg-white border-4 border-black overflow-hidden" style={{ boxShadow: '8px 8px 0px #000000' }}>
          <div className="bg-linear-to-r from-teal-50 to-cyan-50 border-b-4 border-black p-4">
            <h2 className="text-[#263238] font-black uppercase flex items-center gap-2">
              <ChevronRight className="w-5 h-5 text-[#00897B]" strokeWidth={4} /> 
              Lista Maestra de Insumos
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-4 border-black bg-gray-50">
                  <th className="p-4 font-black uppercase text-[#263238] text-sm tracking-tighter">Ingrediente</th>
                  <th className="p-4 font-black uppercase text-[#263238] text-sm tracking-tighter">Unidad</th>
                  <th className="p-4 font-black uppercase text-[#263238] text-sm tracking-tighter">Stock Actual</th>
                  <th className="p-4 font-black uppercase text-[#263238] text-sm tracking-tighter text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-10 text-center">
                      <div className="animate-spin inline-block w-8 h-8 border-4 border-[#00897B] border-b-transparent rounded-full"></div>
                    </td>
                  </tr>
                ) : data.map((ingredient) => (
                  <tr key={ingredient.id_ingrediente} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 border-2 border-black flex items-center justify-center group-hover:bg-[#00897B] transition-colors">
                           <Package className="w-4 h-4 text-[#263238] group-hover:text-white" />
                        </div>
                        <span className="font-black text-[#263238] uppercase text-sm">{ingredient.nombre}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-gray-500 uppercase text-xs">
                      {ingredient.unidad_medida}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 border-2 border-black font-black text-sm shadow-[2px_2px_0px_#000000] ${
                          ingredient.stock <= 5 ? 'bg-[#FFCDD2] text-[#E53935]' : 'bg-[#C8E6C9] text-[#2E7D32]'
                        }`}>
                          {ingredient.stock}
                        </span>
                        {ingredient.stock <= 5 && (
                          <TrendingDown className="w-4 h-4 text-[#E53935] animate-pulse" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {mostrarAcciones && (
                        <div className="flex justify-end gap-2">
                          {(puedeEditarTodo || puedeEditarStock) && (
                            <button
                              onClick={() => { setSelected(ingredient); setModalOpen(true); }}
                              className="p-2 bg-white border-2 border-black hover:bg-yellow-400 transition-colors shadow-[2px_2px_0px_#000000]"
                              title={puedeEditarTodo ? 'Editar' : 'Actualizar Stock'}
                            >
                              <Edit className="w-4 h-4 text-[#263238]" strokeWidth={3} />
                            </button>
                          )}
                          <ProtectedButton permisos={['eliminar_ingredientes']}>
                            <button
                              onClick={() => { setSelected(ingredient); setConfirmOpen(true); }}
                              className="p-2 bg-white border-2 border-black hover:bg-[#E53935] hover:text-white transition-all shadow-[2px_2px_0px_#000000]"
                            >
                              <Trash2 className="w-4 h-4" strokeWidth={3} />
                            </button>
                          </ProtectedButton>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CrudModal<Ingrediente>
        open={modalOpen}
        title={selected ? (puedeEditarTodo ? 'EDITAR INGREDIENTE' : 'ACTUALIZAR STOCK') : 'NUEVO INGREDIENTE'}
        initialData={selected || undefined}
        fields={fields}
        onSubmit={async (form) => {
          try {
            if (selected) {
              const { id_ingrediente, recetas, ...payload } = form as any;
              const finalPayload = { ...payload, stock: Number(form.stock) };

              if (!puedeEditarTodo && puedeEditarStock) {
                await ingredientesApi.updateStock(selected.id_ingrediente, Number(form.stock));
                await refresh();
              } else {
                await updateItem(selected.id_ingrediente, finalPayload);
              }
            } else {
              const newPayload = { ...form, stock: Number(form.stock) };
              await createItem(newPayload as any);
            }
            setModalOpen(false);
          } catch (e) {
            console.error("Error:", e);
          }
        }}
        onClose={() => { setModalOpen(false); setSelected(null); }}
      />

      <ConfirmModal
        open={confirmOpen}
        title="¿ELIMINAR INGREDIENTE?"
        message={`¿Estás seguro de eliminar "${selected?.nombre}"? Esta acción afectará a las recetas vinculadas.`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (selected) deleteItem(selected.id_ingrediente);
          setConfirmOpen(false);
        }}
      />
    </div>
  );
}