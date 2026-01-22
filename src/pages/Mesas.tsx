import { useState, useEffect } from 'react';
import { mesasApi } from '@/api/mesas';
import { sucursalesApi } from '@/api/sucursales';
import type { Mesa } from '@/types/mesa';
import type { Sucursal } from '@/types/sucursal';
import { useCrud } from '@/hooks/useCrud';
import { DataTable } from '@/components/table/DataTable';
import { CrudModal, type Field } from '@/components/modal/CrudModal';
import { ConfirmModal } from '@/components/modal/ConfirmModal';
import ProtectedButton from '@/components/ProtectedButton';
import { useAuth } from '@/hooks/useAuth';

export default function Mesas() {
  // 1. Hook tipado sin 'as any'. TS infiere CrudService<Mesa>
  const { data, loading, error, createItem, updateItem, deleteItem } = useCrud<Mesa>(mesasApi);
  const { user } = useAuth();

  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<Mesa | null>(null);

  const puedeEditar = user?.permisos.includes('editar_mesas');
  const puedeEliminar = user?.permisos.includes('eliminar_mesas');
  const mostrarAcciones = puedeEditar || puedeEliminar;

  useEffect(() => {
    const cargarSucursales = async () => {
      try {
        const lista = await sucursalesApi.getAll();
        setSucursales(lista);
      } catch (err) {
        console.error("Error cargando sucursales para el select", err);
      }
    };
    cargarSucursales();
  }, []);

  const fields: Field<Mesa>[] = [
    { name: 'numero', label: 'Número de Mesa', type: 'number', min: 1, required: true },
    { name: 'capacidad', label: 'Capacidad (Personas)', type: 'number', min: 1, required: true },
    { 
      name: 'estado', 
      label: 'Estado de la Mesa', 
      type: 'select', 
      required: true,
      options: [
        { label: 'Libre', value: 'Libre' },
        { label: 'Ocupada', value: 'Ocupada' },
        { label: 'Reservada', value: 'Reservada' },
      ]
    },
    {
      name: 'id_sucursal',
      label: 'Asignar a Sucursal',
      type: 'select',
      required: true,
      options: sucursales.map(s => ({
        label: s.nombre,
        value: s.id_sucursal 
      }))
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Mesas</h1>
        <ProtectedButton permisos={['crear_mesas']}>
          <button
            onClick={() => { setSelected(null); setModalOpen(true); }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md font-medium"
          >
            Nueva Mesa
          </button>
        </ProtectedButton>
      </div>

      {/* Uso de la variable error para evitar el aviso amarillo de ESLint */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 shadow-sm" role="alert">
          <p className="font-bold">Error de sistema</p>
          <p>{error}</p>
        </div>
      )}

      <DataTable<Mesa>
        columns={[
          { key: 'numero', label: 'N° Mesa' },
          { key: 'capacidad', label: 'Capacidad' },
          { 
            key: 'estado', 
            label: 'Estado',
            render: (item) => (
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                item.estado === 'Libre' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {item.estado}
              </span>
            )
          },
          { 
            key: 'sucursal', 
            label: 'Sucursal (Ubicación)', 
            render: (item) => item.sucursal?.nombre || 'Sin sucursal' 
          },
        ]}
        data={data}
        loading={loading}
        renderActions={mostrarAcciones ? (mesa) => (
          <div className="flex gap-3">
            <ProtectedButton permisos={['editar_mesas']}>
              <button
                onClick={() => { setSelected(mesa); setModalOpen(true); }}
                className="text-indigo-600 hover:text-indigo-900 font-medium"
              >
                Editar
              </button>
            </ProtectedButton>

            <ProtectedButton permisos={['eliminar_mesas']}>
              <button
                onClick={() => { setSelected(mesa); setConfirmOpen(true); }}
                className="text-red-600 hover:text-red-900 font-medium"
              >
                Eliminar
              </button>
            </ProtectedButton>
          </div>
        ) : undefined} 
      />

      <CrudModal<Mesa>
        open={modalOpen}
        title={selected ? 'Editar Mesa' : 'Registrar Nueva Mesa'}
        initialData={selected || undefined}
        fields={fields}
        onSubmit={(form) => {
          // 2. Desestructuración segura: evitamos enviar el objeto 'sucursal' completo 
          // y nos quedamos con el 'id_sucursal' que pide el backend
          const { id_mesa, sucursal, ...payload } = form as Partial<Mesa & { sucursal: any }>;

          if (selected) {
            updateItem(selected.id_mesa, payload);
          } else {
            createItem(payload);
          }
          setModalOpen(false);
        }}
        onClose={() => { setModalOpen(false); setSelected(null); }}
      />

      <ConfirmModal
        open={confirmOpen}
        title="Eliminar Registro"
        message={`¿Estás seguro de eliminar la mesa número ${selected?.numero}?`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (selected) deleteItem(selected.id_mesa);
          setConfirmOpen(false);
        }}
      />
    </div>
  );
}