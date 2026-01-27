import { useState, useEffect } from 'react';
import { usuariosApi } from '@/api/usuarios';
import { rolesApi } from '@/api/roles';
import type { Usuario, Rol } from '@/types';
import { useCrud } from '@/hooks/useCrud';
import { DataTable } from '@/components/table/DataTable';
import { CrudModal, type Field } from '@/components/modal/CrudModal';
import { ConfirmModal } from '@/components/modal/ConfirmModal';
import ProtectedButton from '@/components/ProtectedButton';
import { useAuth } from '@/hooks/useAuth';
import { 
  Plus, 
  Users, 
  Edit, 
  Trash2, 
  AlertCircle 
} from 'lucide-react';

export default function Usuarios() {
  const { data, loading, error, createItem, updateItem, deleteItem } = useCrud<Usuario>(usuariosApi);
  const { user: currentUser } = useAuth();

  const [roles, setRoles] = useState<Rol[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<Usuario | null>(null);

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
    <div className="min-h-screen bg-linear-to-br from-[#263238] via-[#37474F] to-[#455A64] pb-10 font-sans">
      
      {/* HEADER IDÉNTICO AL DE PLATOS */}
      <div className="bg-[#263238] border-b-4 border-black mb-8" style={{ boxShadow: '0px 4px 0px #000000' }}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#D32F2F] border-4 border-black flex items-center justify-center" style={{ boxShadow: '4px 4px 0px #000000' }}>
                <Users className="w-8 h-8 text-white" strokeWidth={3} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl text-white font-black uppercase leading-relaxed">
                  Gestión de Usuarios
                </h1>
                <p className="text-yellow-400 font-bold uppercase text-sm tracking-widest">PIXEL-FOOD - Control de Accesos</p>
              </div>
            </div>
            
            <ProtectedButton permisos={['gestionar_usuarios']}>
              <button
                onClick={() => { setSelected(null); setModalOpen(true); }}
                className="bg-[#9C27B0] hover:bg-[#7B1FA2] text-white border-4 border-black font-black uppercase px-6 py-2 hover:translate-x-1 hover:translate-y-1 transition-transform flex items-center gap-2"
                style={{ boxShadow: '4px 4px 0px #000000' }}
              >
                <Plus className="w-5 h-5" strokeWidth={4} /> Nuevo Usuario
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

        {/* CONTENEDOR DE TABLA ESTILO PLATOS */}
        <div className="bg-white border-4 border-black" style={{ boxShadow: '8px 8px 0px #000000' }}>
          <div className="bg-linear-to-r from-purple-50 to-blue-50 border-b-4 border-black p-6">
            <h2 className="text-[#263238] font-black uppercase text-xl">Listado de Personal y Clientes</h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#E53935]"></div>
              </div>
            ) : (
              <div className="overflow-hidden">
                <DataTable<Usuario>
                  data={data}
                  loading={loading}
                  columns={[
                    { 
                      key: 'nombre', 
                      label: 'Usuario',
                      render: (u) => (
                        <div className="flex flex-col">
                          <span className="font-black text-[#263238] uppercase italic">{u.nombre} {u.apellido}</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">{u.correo}</span>
                        </div>
                      )
                    },
                    { 
                      key: 'rol', 
                      label: 'Rol / Cargo', 
                      render: (u) => {
                        const nombreRol = typeof u.rol === 'object' ? (u.rol as any)?.nombre : u.rol;
                        const name = (nombreRol || 'Cliente').toLowerCase();
                        let color = 'bg-[#43A047]'; 
                        if (name.includes('admin')) color = 'bg-[#E53935]';
                        if (name.includes('gerente') || name.includes('empleado')) color = 'bg-[#FB8C00]';

                        return (
                          <span className={`${color} text-white px-2 py-1 border-2 border-black font-black uppercase text-[10px] inline-block shadow-[2px_2px_0px_#000000]`}>
                            {nombreRol || 'Cliente'}
                          </span>
                        );
                      }
                    },
                    { 
                      key: 'telefono', 
                      label: 'Contacto',
                      render: (u) => <span className="font-bold text-gray-600">{u.telefono || 'Sin teléfono'}</span>
                    }
                  ]}
                  renderActions={mostrarAcciones ? (u) => (
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => { setSelected(u); setModalOpen(true); }} 
                        className="p-2 border-2 border-black font-black bg-white hover:bg-yellow-400 transition-colors shadow-[2px_2px_0px_#000000]"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4 text-black" strokeWidth={3} />
                      </button>

                      <button 
                        onClick={() => { setSelected(u); setConfirmOpen(true); }} 
                        className="p-2 border-2 border-black font-black bg-white text-[#E53935] hover:bg-[#E53935] hover:text-white transition-colors shadow-[2px_2px_0px_#000000]"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={3} />
                      </button>
                    </div>
                  ) : undefined}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALES */}
      <CrudModal<Usuario>
        open={modalOpen}
        title={selected ? 'EDITAR USUARIO' : 'CREAR NUEVO USUARIO'}
        initialData={selected || undefined}
        fields={selected ? editFields : createFields}
        onSubmit={(form) => {
          if (selected) {
            const { _id, rol, ...payload } = form as any;
            updateItem(selected._id, cleanPayload(payload));
          } else {
            createItem(cleanPayload(form));
          }
          setModalOpen(false);
          setSelected(null);
        }}
        onClose={() => { setModalOpen(false); setSelected(null); }}
      />

      <ConfirmModal
        open={confirmOpen}
        title="¡ZONA DE PELIGRO!"
        message={`¿Estás seguro de que deseas eliminar a "${selected?.nombre}"? Esta acción revocará todos sus accesos de forma permanente.`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (selected) deleteItem(selected._id);
          setConfirmOpen(false);
        }}
      />
    </div>
  );
}