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

export default function Platos() {
  const { data, loading, error, createItem, updateItem, deleteItem } = useCrud<Plato>(platosApi);
  const { user } = useAuth();
  
  // 1. LÓGICA DE PERMISOS GRANULARES (Igual que en Ingredientes)
  // Ajustamos para que verifique el array de permisos y el rol
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

  // 2. CONFIGURACIÓN DE CAMPOS ADAPTADA
  const fields: Field<Plato>[] = [
    { 
      name: 'nombre', 
      label: 'Nombre del Plato', 
      type: 'text', 
      required: true,
      // Se bloquea si estamos EDITANDO y el usuario no tiene permiso total
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
      disabled: false, // SIEMPRE habilitado para que el empleado actualice stock
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

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg inline-block shadow-sm">
          <p className="font-bold">Error en la carga de datos</p>
          <p className="text-sm">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-2 text-xs underline font-semibold">
            Reintentar
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Platos</h1>
          <p className="text-sm text-gray-500">
            Bienvenido, <span className="font-semibold text-blue-600">{user?.nombre || 'Usuario'}</span>.
            {esEmpleado 
              ? ' Solo tienes permiso para cambiar la disponibilidad de los platos.' 
              : ' Administra el menú, precios y categorías.'}
          </p>
        </div>

        <ProtectedButton permisos={['crear_platos']}>
          <button 
            onClick={() => { setSelected(null); setModalOpen(true); }} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md font-medium"
          >
            + Nuevo Plato
          </button>
        </ProtectedButton>
      </div>

      <DataTable<Plato>
        data={data}
        loading={loading}
        columns={[
          { key: 'nombre', label: 'Nombre' },
          { 
            key: 'precio', 
            label: 'Precio', 
            render: (p) => `$${Number(p.precio).toFixed(2)}` 
          },
          { 
            key: 'categoria', 
            label: 'Categoría', 
            render: (p) => p.categoria?.nombre || <span className="text-gray-400 italic text-xs">Sin categoría</span> 
          },
          { 
            key: 'disponible', 
            label: 'Estado', 
            render: (p) => (
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                p.disponible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {p.disponible ? 'Disponible' : 'Agotado'}
              </span>
            ) 
          }
        ]}
        renderActions={(plato) => (
          <div className="flex gap-4">
            <ProtectedButton permisos={['ver_recetas']}>
              <button 
                onClick={() => { setSelected(plato); setRecetaOpen(true); }} 
                className="text-orange-600 hover:text-orange-800 font-bold text-xs uppercase"
              >
                Ingredientes
              </button>
            </ProtectedButton>

            <button 
                onClick={() => { setSelected(plato); setModalOpen(true); }} 
                className="text-blue-600 hover:text-blue-800 font-bold text-xs uppercase"
            >
                {esEmpleado ? 'Disponibilidad' : 'Editar'}
            </button>

            <ProtectedButton permisos={['eliminar_platos']}>
              <button 
                onClick={() => { setSelected(plato); setConfirmOpen(true); }} 
                className="text-red-600 hover:text-red-800 font-bold text-xs uppercase"
              >
                Eliminar
              </button>
            </ProtectedButton>
          </div>
        )}
      />

      <RecetasModal 
        open={recetaOpen} 
        plato={selected} 
        onClose={() => { setRecetaOpen(false); setSelected(null); }} 
      />

      <CrudModal<Plato>
        open={modalOpen}
        title={esEmpleado ? 'Actualizar Disponibilidad' : (selected ? 'Editar Plato' : 'Crear Plato')}
        initialData={selected || undefined}
        fields={fields}
        onSubmit={(form) => {
          const { id_plato, categoria, recetas, ...payload } = form as any;
          
          // 3. SEGURIDAD EN SUBMIT: Si es empleado, solo enviamos el estado
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
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar el plato "${selected?.nombre}"?`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (selected) deleteItem(selected.id_plato);
          setConfirmOpen(false);
        }}
      />
    </div>
  );
}