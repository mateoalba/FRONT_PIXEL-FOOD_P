import { useState } from 'react';
import { ingredientesApi } from '@/api/ingredientes';
import type { Ingrediente } from '@/types';
import { useCrud } from '@/hooks/useCrud';
import { DataTable } from '@/components/table/DataTable';
import { CrudModal, type Field } from '@/components/modal/CrudModal';
import { ConfirmModal } from '@/components/modal/ConfirmModal';
import ProtectedButton from '@/components/ProtectedButton';
import { useAuth } from '@/hooks/useAuth';

export default function Ingredientes() {
  // 1. Usamos el tipo exacto de la API para que reconozca métodos extra y quitamos el 'as any'
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

  // Permisos granulares
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
    <div className="p-6">
      {/* 2. Solución al error amarillo: Usamos la variable error para informar al usuario */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700 shadow-sm">
          <p className="font-bold">Aviso:</p>
          <p>{error}</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Inventario de Ingredientes</h1>
        <ProtectedButton permisos={['crear_ingredientes']}>
          <button
            onClick={() => { setSelected(null); setModalOpen(true); }}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-shadow shadow-md font-medium"
          >
            Nuevo Ingrediente
          </button>
        </ProtectedButton>
      </div>

      <DataTable<Ingrediente>
        columns={[
          { key: 'nombre', label: 'Ingrediente' },
          { key: 'unidad_medida', label: 'Unidad' },
          { 
            key: 'stock', 
            label: 'Stock Actual',
            render: (item) => (
              <span className={`font-bold ${item.stock <= 5 ? 'text-red-600' : 'text-gray-700'}`}>
                {item.stock} {item.unidad_medida}
              </span>
            )
          },
        ]}
        data={data}
        loading={loading}
        renderActions={mostrarAcciones ? (item) => (
          <div className="flex gap-3">
            {(puedeEditarTodo || puedeEditarStock) && (
              <button
                onClick={() => { setSelected(item); setModalOpen(true); }}
                className="text-emerald-600 hover:text-emerald-900 font-medium transition-colors"
              >
                {puedeEditarTodo ? 'Editar' : 'Actualizar Stock'}
              </button>
            )}

            <ProtectedButton permisos={['eliminar_ingredientes']}>
              <button
                onClick={() => { setSelected(item); setConfirmOpen(true); }}
                className="text-red-600 hover:text-red-900 font-medium transition-colors"
              >
                Eliminar
              </button>
            </ProtectedButton>
          </div>
        ) : undefined}
      />

      <CrudModal<Ingrediente>
        open={modalOpen}
        title={selected ? (puedeEditarTodo ? 'Editar Ingrediente' : 'Actualizar Stock') : 'Nuevo Ingrediente'}
        initialData={selected || undefined}
        fields={fields}
        
onSubmit={async (form) => {
    try {
        if (selected) {
            // 1. Limpiamos el ID y relaciones
            const { id_ingrediente, recetas, ...payload } = form as any;

            // 2. CONVERSIÓN CRÍTICA
            const finalPayload = {
                ...payload,
                stock: Number(form.stock) 
            };

            if (!puedeEditarTodo && puedeEditarStock) {
                // --- CAMBIO AQUÍ ---
                // En lugar de 'service.updateStock', usamos 'ingredientesApi.updateStock'
                // Asegúrate de que ingredientesApi esté importado arriba en tu archivo
                await ingredientesApi.updateStock(selected.id_ingrediente, Number(form.stock));
                
                // Refresh es vital porque usamos la API directamente
                await refresh();
            } else {
                await updateItem(selected.id_ingrediente, finalPayload);
            }
        } else {
            const newPayload = { 
                ...form, 
                stock: Number(form.stock) 
            };
            await createItem(newPayload as any);
        }
        setModalOpen(false);
    } catch (e) {
        console.error("Error en la operación:", e);
    }
}}

        onClose={() => { setModalOpen(false); setSelected(null); }}
      />

      <ConfirmModal
        open={confirmOpen}
        title="Eliminar Ingrediente"
        message={`¿Estás seguro de eliminar "${selected?.nombre}"? Esto afectará a las recetas que lo usen.`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (selected) deleteItem(selected.id_ingrediente);
          setConfirmOpen(false);
        }}
      />
    </div>
  );
}