import { useState } from 'react';
import { sucursalesApi } from '@/api/sucursales';
import type { Sucursal } from '@/types/sucursal';
import { useCrud } from '@/hooks/useCrud';
import { DataTable } from '@/components/table/DataTable';
import { CrudModal } from '@/components/modal/CrudModal';
import { ConfirmModal } from '@/components/modal/ConfirmModal';
import ProtectedButton from '@/components/ProtectedButton';
import type { Field } from '@/components/modal/CrudModal';
import { useAuth } from '@/hooks/useAuth';

export default function Sucursales() {
  // 1. Eliminamos 'as any'. TS detecta automáticamente que sucursalesApi 
  // cumple con CrudService<Sucursal>
  const { data, loading, error, createItem, updateItem, deleteItem } = useCrud<Sucursal>(sucursalesApi);
  const { user } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<Sucursal | null>(null);

  const puedeEditar = user?.permisos.includes('editar_sucursales');
  const puedeEliminar = user?.permisos.includes('eliminar_sucursales');
  const mostrarAcciones = puedeEditar || puedeEliminar;

  const fields: Field<Sucursal>[] = [
    { name: 'nombre', label: 'Nombre de Sucursal', required: true },
    { name: 'direccion', label: 'Dirección', required: true },
    { name: 'telefono', label: 'Teléfono', required: true },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Sucursales</h1>
        
        <ProtectedButton permisos={['crear_sucursales']}>
          <button
            onClick={() => { setSelected(null); setModalOpen(true); }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors shadow-sm font-medium"
          >
            Nueva Sucursal
          </button>
        </ProtectedButton>
      </div>

      {/* El error ya se usa aquí, así que no marcará amarillo */}
      {error && (
        <p className="text-red-600 bg-red-50 p-3 rounded border border-red-200 mb-4">
          {error}
        </p>
      )}

      <DataTable<Sucursal>
        columns={[
          { key: 'nombre', label: 'Nombre' },
          { key: 'direccion', label: 'Dirección' },
          { key: 'telefono', label: 'Teléfono' },
        ]}
        data={data}
        loading={loading}
        renderActions={mostrarAcciones ? (sucursal) => (
          <div className="flex gap-3">
            <ProtectedButton permisos={['editar_sucursales']}>
              <button
                onClick={() => { setSelected(sucursal); setModalOpen(true); }}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Editar
              </button>
            </ProtectedButton>

            <ProtectedButton permisos={['eliminar_sucursales']}>
              <button
                onClick={() => { setSelected(sucursal); setConfirmOpen(true); }}
                className="text-red-600 hover:text-red-800 font-medium transition-colors"
              >
                Eliminar
              </button>
            </ProtectedButton>
          </div>
        ) : undefined}
      />

      <CrudModal<Sucursal>
        open={modalOpen}
        title={selected ? 'Editar Sucursal' : 'Nueva Sucursal'}
        initialData={selected || undefined}
        fields={fields}
        onSubmit={(form) => {
            // Eliminamos el 'as any' del payload usando desestructuración limpia
            // Extraemos los campos que NO queremos enviar al backend
            const { id_sucursal, mesas, ...payload } = form as Partial<Sucursal & { mesas: any }>; 

            if (selected) {
                updateItem(selected.id_sucursal, payload);
            } else {
                createItem(payload);
            }
            setModalOpen(false);
        }}
        onClose={() => { setModalOpen(false); setSelected(null); }}
      />

      <ConfirmModal
        open={confirmOpen}
        title="Eliminar Sucursal"
        message={`¿Estás seguro de eliminar la sucursal "${selected?.nombre}"?`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (selected) deleteItem(selected.id_sucursal);
          setConfirmOpen(false);
        }}
      />
    </div>
  );
}