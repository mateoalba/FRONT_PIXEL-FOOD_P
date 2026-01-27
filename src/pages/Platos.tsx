import { useState, useEffect } from 'react';
import { platosApi } from '@/api/platos';
import { categoriasApi } from '@/api/categorias';
import type { Plato } from '@/types/plato';
import type { Categoria } from '@/types/categoria';
import { useCrud } from '@/hooks/useCrud';
import { DataTable } from '@/components/table/DataTable';
import { CrudModal, type Field } from '@/components/modal/CrudModal';
import { ConfirmModal } from '@/components/modal/ConfirmModal';
import { RecetasModal } from '@/components/modal/RecetasModal';
import ProtectedButton from '@/components/ProtectedButton';
import { useAuth } from '@/hooks/useAuth';
import { 
  Plus, 
  ChefHat, 
  Edit, 
  Trash2, 
  AlertCircle, 
  LayoutGrid 
} from 'lucide-react';

export default function Platos() {
  const { data, loading, error, createItem, updateItem, deleteItem } = useCrud<Plato>(platosApi);
  const { user } = useAuth();
  
  const puedeEditarTodo = user?.permisos.includes('editar_platos') && user?.rol?.toLowerCase() !== 'empleado';
  const esEmpleado = user?.rol?.toLowerCase() === 'empleado';

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [recetaOpen, setRecetaOpen] = useState(false);
  const [selected, setSelected] = useState<Plato | null>(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoriasApi.getAll();
        setCategorias(res);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
      }
    };
    fetchCats();
  }, []);

  const fields: Field<Plato>[] = [
    { 
      name: 'nombre', 
      label: 'Nombre del Plato', 
      type: 'text', 
      required: true,
      disabled: !!(selected && !puedeEditarTodo) 
    },
    { 
      name: 'descripcion', 
      label: 'Descripción', 
      type: 'text', 
      required: true,
      disabled: !!(selected && !puedeEditarTodo)
    },
    { 
      name: 'precio', 
      label: 'Precio', 
      type: 'number', 
      required: true,
      min: 0.01,
      disabled: !!(selected && !puedeEditarTodo)
    },
    { 
      name: 'disponible', 
      label: '¿Está Disponible?', 
      type: 'select', 
      disabled: false, 
      options: [
        { label: 'Sí (Disponible)', value: true as any },
        { label: 'No (Agotado)', value: false as any }
      ] 
    },
    {
      name: 'id_categoria' as any, 
      label: 'Categoría',
      type: 'select',
      required: true,
      disabled: !!(selected && !puedeEditarTodo),
      options: categorias.map(c => ({ label: c.nombre, value: c.id_categoria }))
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-[#263238] via-[#37474F] to-[#455A64] pb-10 font-sans">
      
      {/* HEADER ESTILO CATEGORÍAS */}
      <div className="bg-[#263238] border-b-4 border-black mb-8" style={{ boxShadow: '0px 4px 0px #000000' }}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#E53935] border-4 border-black flex items-center justify-center" style={{ boxShadow: '4px 4px 0px #000000' }}>
                <LayoutGrid className="w-8 h-8 text-white" strokeWidth={3} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl text-white font-black uppercase leading-relaxed">
                  Gestión de Menú
                </h1>
                <p className="text-yellow-400 font-bold uppercase text-sm tracking-widest">PIXEL-FOOD - Control de Platos</p>
              </div>
            </div>
            
            <ProtectedButton permisos={['crear_platos']}>
              <button
                onClick={() => { setSelected(null); setModalOpen(true); }}
                className="bg-[#FB8C00] hover:bg-[#f57c00] text-white border-4 border-black font-black uppercase px-6 py-2 hover:translate-x-1 hover:translate-y-1 transition-transform flex items-center gap-2"
                style={{ boxShadow: '4px 4px 0px #000000' }}
              >
                <Plus className="w-5 h-5" strokeWidth={4} /> Nuevo Plato
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

        {/* CONTENEDOR DE TABLA ESTILO CATEGORÍAS */}
        <div className="bg-white border-4 border-black" style={{ boxShadow: '8px 8px 0px #000000' }}>
          <div className="bg-linear-to-r from-orange-50 to-yellow-50 border-b-4 border-black p-6">
            <h2 className="text-[#263238] font-black uppercase text-xl">Listado Maestro de Platos</h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#E53935]"></div>
              </div>
            ) : (
              <div className="overflow-hidden">
                <DataTable<Plato>
                  data={data}
                  loading={loading}
                  columns={[
                    { 
                      key: 'nombre', 
                      label: 'Nombre',
                      render: (p) => (
                        <div className="flex flex-col">
                          <span className="font-black text-[#263238] uppercase italic">{p.nombre}</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase truncate max-w-50">{p.descripcion}</span>
                        </div>
                      )
                    },
                    { 
                      key: 'precio', 
                      label: 'Precio', 
                      render: (p) => <span className="font-black text-[#1E88E5] text-lg">${Number(p.precio).toFixed(2)}</span> 
                    },
                    { 
                      key: 'categoria', 
                      label: 'Categoría', 
                      render: (p) => (
                        <span 
                          className="bg-[#FB8C00] text-white px-2 py-1 border-2 border-black font-black uppercase text-[10px] inline-block shadow-[2px_2px_0px_#000000]" 
                        >
                          {p.categoria?.nombre || 'General'}
                        </span>
                      )
                    },
                    { 
                      key: 'disponible', 
                      label: 'Estado', 
                      render: (p) => (
                        <span className={`px-3 py-1 border-2 border-black font-black text-[10px] uppercase inline-block shadow-[2px_2px_0px_#000000] ${
                          p.disponible ? 'bg-[#43A047] text-white' : 'bg-[#E53935] text-white'
                        }`}>
                          {p.disponible ? 'Disponible' : 'Agotado'}
                        </span>
                      ) 
                    }
                  ]}
                  renderActions={(plato) => (
                    <div className="flex flex-wrap gap-2">
                      <ProtectedButton permisos={['ver_recetas']}>
                        <button 
                          onClick={() => { setSelected(plato); setRecetaOpen(true); }} 
                          className="p-2 border-2 border-black font-black bg-white hover:bg-purple-400 transition-colors shadow-[2px_2px_0px_#000000]"
                          title="Ver Receta"
                        >
                          <ChefHat className="w-4 h-4 text-black" strokeWidth={3} />
                        </button>
                      </ProtectedButton>

                      <button 
                          onClick={() => { setSelected(plato); setModalOpen(true); }} 
                          className="p-2 border-2 border-black font-black bg-white hover:bg-yellow-400 transition-colors shadow-[2px_2px_0px_#000000]"
                          title={esEmpleado ? 'Disponibilidad' : 'Editar'}
                      >
                          <Edit className="w-4 h-4 text-black" strokeWidth={3} />
                      </button>

                      <ProtectedButton permisos={['eliminar_platos']}>
                        <button 
                          onClick={() => { setSelected(plato); setConfirmOpen(true); }} 
                          className="p-2 border-2 border-black font-black bg-white text-[#E53935] hover:bg-[#E53935] hover:text-white transition-colors shadow-[2px_2px_0px_#000000]"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={3} />
                        </button>
                      </ProtectedButton>
                    </div>
                  )}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALES */}
      <RecetasModal 
        open={recetaOpen} 
        plato={selected} 
        onClose={() => { setRecetaOpen(false); setSelected(null); }} 
      />

      <CrudModal<Plato>
        open={modalOpen}
        title={esEmpleado ? 'ACTUALIZAR DISPONIBILIDAD' : (selected ? 'EDITAR PLATO' : 'CREAR NUEVO PLATO')}
        initialData={selected || undefined}
        fields={fields}
        onSubmit={(form) => {
          const { id_plato, categoria, recetas, ...payload } = form as any;
          const finalPayload = esEmpleado 
            ? { disponible: String(payload.disponible) === 'true' }
            : {
                ...payload,
                precio: Number(payload.precio),
                disponible: String(payload.disponible) === 'true' 
              };

          if (selected) {
            updateItem(selected.id_plato, finalPayload);
          } else {
            createItem(finalPayload);
          }
          setModalOpen(false);
          setSelected(null);
        }}
        onClose={() => { setModalOpen(false); setSelected(null); }}
      />

      <ConfirmModal
        open={confirmOpen}
        title="¡ALERTA DE ELIMINACIÓN!"
        message={`¿Estás seguro de que deseas borrar "${selected?.nombre}" del sistema? Esta acción no se puede deshacer.`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (selected) deleteItem(selected.id_plato);
          setConfirmOpen(false);
        }}
      />
    </div>
  );
}