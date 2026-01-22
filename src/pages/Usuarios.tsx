import { useState, useEffect } from 'react';
import { usuariosApi } from '@/api/usuarios';
import { rolesApi } from '@/api/roles';
import type { Usuario, Rol } from '@/types';
import { useCrud } from '@/hooks/useCrud';
import { DataTable } from '@/components/table/DataTable';
import { CrudModal } from '@/components/modal/CrudModal';
import { ConfirmModal } from '@/components/modal/ConfirmModal';
import ProtectedButton from '@/components/ProtectedButton';
import type { Field } from '@/components/modal/CrudModal';
import { useAuth } from '@/hooks/useAuth'; // 1. Importamos el hook de auth

export default function Usuarios() {
  const { data, loading, error, createItem, updateItem, deleteItem } = useCrud<Usuario>(usuariosApi);
  const { user: currentUser } = useAuth(); // 2. Obtenemos el usuario logueado

  const [roles, setRoles] = useState<Rol[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<Usuario | null>(null);

  // 3. Lógica para determinar si se muestra la columna de acciones
  // En tu caso, el permiso maestro es 'gestionar_usuarios'
  const mostrarAcciones = currentUser?.permisos.includes('gestionar_usuarios');

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await rolesApi.getAll();
        setRoles(res);
      } catch (err) {
        console.error('Error cargando roles', err);
      }
    };
    fetchRoles();
  }, []);

  const createFields: Field<Usuario>[] = [
    { name: 'nombre', label: 'Nombre', required: true },
    { name: 'apellido', label: 'Apellido', required: true },
    { name: 'correo', label: 'Correo', required: true },
    { name: 'telefono', label: 'Teléfono' },
    { name: 'direccion', label: 'Dirección' },
    { name: 'contrasena', label: 'Contraseña', required: true, type: 'password' },
  ];

  const editFields: Field<Usuario>[] = [
    { name: 'nombre', label: 'Nombre', required: true },
    { name: 'apellido', label: 'Apellido', required: true },
    { name: 'correo', label: 'Correo', required: true },
    { name: 'telefono', label: 'Teléfono' },
    { name: 'direccion', label: 'Dirección' },
    {
      name: 'rol_id',
      label: 'Rol',
      required: true,
      type: 'select',
      options: roles.map(r => ({ label: r.nombre, value: r.id_rol })),
    },
    { name: 'contrasena', label: 'Contraseña', type: 'password' },
  ];

  const cleanPayload = (payload: Partial<Usuario>): Partial<Usuario> => {
    const cleaned: Partial<Usuario> = {};
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        (cleaned as any)[key] = value;
      }
    });
    return cleaned;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Gestión de Usuarios</h1>
        
        <ProtectedButton permisos={['gestionar_usuarios']}>
          <button
            onClick={() => { setSelected(null); setModalOpen(true); }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Nuevo usuario
          </button>
        </ProtectedButton>
      </div>

      {loading && <p className="text-gray-500 italic">Cargando lista de usuarios...</p>}
      {error && <p className="text-red-600 bg-red-50 p-2 rounded border border-red-200">{error}</p>}

      <DataTable<Usuario>
        columns={[
          { key: 'nombre', label: 'Nombre' },
          { key: 'apellido', label: 'Apellido' },
          { key: 'correo', label: 'Correo' },
          { key: 'telefono', label: 'Teléfono' },
          { key: 'rol', label: 'Rol' },
        ]}
        data={data}
        loading={loading}
        // 4. Si el usuario logueado no puede gestionar, renderActions es undefined
        // y la columna "Acciones" desaparece de la tabla.
        renderActions={mostrarAcciones ? (targetUser) => (
          <div className="flex gap-2">
            <ProtectedButton permisos={['gestionar_usuarios']}>
              <button
                onClick={() => { setSelected(targetUser); setModalOpen(true); }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Editar
              </button>
            </ProtectedButton>

            <ProtectedButton permisos={['gestionar_usuarios']}>
              <button
                onClick={() => { setSelected(targetUser); setConfirmOpen(true); }}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Eliminar
              </button>
            </ProtectedButton>
          </div>
        ) : undefined}
      />

      <CrudModal<Usuario>
        open={modalOpen}
        title={selected ? 'Editar usuario' : 'Nuevo usuario'}
        initialData={selected || undefined}
        fields={selected ? editFields : createFields}
        onSubmit={(form) => {
          if (selected) {
            const { _id, rol, ...payload } = form;
            updateItem(selected._id, cleanPayload(payload));
          } else {
            createItem(cleanPayload(form));
          }
          setModalOpen(false);
        }}
        onClose={() => setModalOpen(false)}
      />

      <ConfirmModal
        open={confirmOpen}
        title="Eliminar usuario"
        message={`¿Seguro que deseas eliminar a "${selected?.nombre}"?`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (selected) deleteItem(selected._id);
          setConfirmOpen(false);
        }}
      />
    </div>
  );
}