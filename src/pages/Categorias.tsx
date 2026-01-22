import { useState } from 'react';
import { categoriasApi } from '@/api/categorias';
import type { Categoria } from '@/types';
import { useCrud } from '@/hooks/useCrud';
import { DataTable } from '@/components/table/DataTable';
import { CrudModal } from '@/components/modal/CrudModal';
import { ConfirmModal } from '@/components/modal/ConfirmModal';
import ProtectedButton from '@/components/ProtectedButton';
import type { Field } from '@/components/modal/CrudModal';
import { useAuth } from '@/hooks/useAuth'; // 1. Importamos el hook de auth

export default function Categorias() {
  const { data, loading, error, createItem, updateItem, deleteItem } = useCrud<Categoria>(categoriasApi);
  const { user } = useAuth(); // 2. Obtenemos al usuario actual

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<Categoria | null>(null);

  // 3. Lógica para ocultar la columna "Acciones"
  const puedeEditar = user?.permisos.includes('editar_categorias');
  const puedeEliminar = user?.permisos.includes('eliminar_categorias');
  const mostrarColumnaAcciones = puedeEditar || puedeEliminar;

  const fields: Field<Categoria>[] = [
    { name: 'nombre', label: 'Nombre', required: true },
    { name: 'descripcion', label: 'Descripción', required: true },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Categorías</h1>
        <ProtectedButton permisos={['crear_categorias']}>
          <button
            onClick={() => { setSelected(null); setModalOpen(true); }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Nueva categoría
          </button>
        </ProtectedButton>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <DataTable<Categoria>
        columns={[
          { key: 'nombre', label: 'Nombre' },
          { key: 'descripcion', label: 'Descripción' },
        ]}
        data={data}
        loading={loading}
        // 4. Si mostrarColumnaAcciones es false, pasamos undefined
        // Esto hace que el DataTable no dibuje el <th>Acciones</th>
        renderActions={mostrarColumnaAcciones ? (cat) => (
          <div className="flex gap-3">
            <ProtectedButton permisos={['editar_categorias']}>
              <button
                onClick={() => { setSelected(cat); setModalOpen(true); }}
                className="text-blue-600 hover:underline"
              >
                Editar
              </button>
            </ProtectedButton>

            <ProtectedButton permisos={['eliminar_categorias']}>
              <button
                onClick={() => { setSelected(cat); setConfirmOpen(true); }}
                className="text-red-600 hover:underline"
              >
                Eliminar
              </button>
            </ProtectedButton>
          </div>
        ) : undefined} 
      />

      <CrudModal<Categoria>
        open={modalOpen}
        title={selected ? 'Editar categoría' : 'Nueva categoría'}
        initialData={selected || undefined}
        fields={fields}
        onSubmit={(form) => {
          if (selected) {
            const { id_categoria, ...payload } = form;
            updateItem(selected.id_categoria, payload);
          } else {
            createItem(form);
          }
          setModalOpen(false);
        }}
        onClose={() => setModalOpen(false)}
      />

      <ConfirmModal
        open={confirmOpen}
        title="Eliminar categoría"
        message={`¿Seguro que deseas eliminar "${selected?.nombre}"?`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (selected) deleteItem(selected.id_categoria);
          setConfirmOpen(false);
        }}
      />
    </div>
  );
}