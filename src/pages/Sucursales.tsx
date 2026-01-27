import { useState } from 'react';
import { sucursalesApi } from '@/api/sucursales';
import type { Sucursal } from '@/types/sucursal';
import { useCrud } from '@/hooks/useCrud';
import { CrudModal } from '@/components/modal/CrudModal';
import { ConfirmModal } from '@/components/modal/ConfirmModal';
import ProtectedButton from '@/components/ProtectedButton';
import type { Field } from '@/components/modal/CrudModal';
import { useAuth } from '@/hooks/useAuth';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Phone,
  Navigation,
  AlertCircle
} from 'lucide-react';

export default function Sucursales() {
  const { data, loading, error, createItem, updateItem, deleteItem } = useCrud<Sucursal>(sucursalesApi);
  const { user } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<Sucursal | null>(null);

  const puedeEditar = user?.permisos.includes('editar_sucursales');
  const puedeEliminar = user?.permisos.includes('eliminar_sucursales');

  const fields: Field<Sucursal>[] = [
    { name: 'nombre', label: 'Nombre de Sucursal', required: true },
    { name: 'direccion', label: 'Dirección', required: true },
    { name: 'telefono', label: 'Teléfono', required: true },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-[#263238] via-[#37474F] to-[#455A64] pb-10">
      
      {/* HEADER ESTILO PIXEL-FOOD */}
      <div className="bg-[#263238] border-b-4 border-black mb-8" style={{ boxShadow: '0px 4px 0px #000000' }}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#43A047] border-4 border-black flex items-center justify-center" style={{ boxShadow: '4px 4px 0px #000000' }}>
                <MapPin className="w-8 h-8 text-white" strokeWidth={3} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl text-white font-black uppercase leading-relaxed italic">
                  Gestión de Sucursales
                </h1>
                <p className="text-yellow-400 font-bold uppercase text-sm tracking-widest">PIXEL-FOOD - Red de Locales</p>
              </div>
            </div>
            
            <ProtectedButton permisos={['crear_sucursales']}>
              <button
                onClick={() => { setSelected(null); setModalOpen(true); }}
                className="bg-[#43A047] hover:bg-[#388E3C] text-white border-4 border-black font-black uppercase px-6 py-2 hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-2 active:shadow-none"
                style={{ boxShadow: '4px 4px 0px #000000' }}
              >
                <Plus className="w-5 h-5" strokeWidth={4} /> Nueva Sucursal
              </button>
            </ProtectedButton>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        {error && (
          <div className="bg-white border-4 border-black p-4 mb-6 text-[#E53935] font-black flex items-center gap-2 shadow-[4px_4px_0px_#000000]">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}

        {/* LISTADO DE TARJETAS CON ANIMACIÓN AL PASAR EL MOUSE */}
        <div className="flex flex-col gap-6">
          {loading ? (
             <div className="text-center py-20 text-white font-black uppercase text-xl animate-pulse">
               Cargando sucursales...
             </div>
          ) : data.map((branch) => (
            <div 
              key={branch.id_sucursal} 
              className="bg-white border-4 border-black p-8 flex flex-col md:flex-row justify-between items-center relative group w-full transition-all duration-200 hover:-translate-y-1 hover:translate-x-1"
              style={{ boxShadow: '8px 8px 0px #000000' }}
            >
              {/* Botones de acción - Posición Superior Derecha */}
              <div className="absolute top-3 right-3 flex gap-2">
                {puedeEditar && (
                  <button 
                    onClick={() => { setSelected(branch); setModalOpen(true); }}
                    className="p-1.5 border-2 border-black bg-gray-50 hover:bg-yellow-400 transition-colors shadow-[2px_2px_0px_#000000] active:shadow-none"
                  >
                    <Edit className="w-3.5 h-3.5 text-black" strokeWidth={3} />
                  </button>
                )}
                {puedeEliminar && (
                  <button 
                    onClick={() => { setSelected(branch); setConfirmOpen(true); }}
                    className="p-1.5 border-2 border-black bg-gray-50 hover:bg-red-500 hover:text-white transition-colors shadow-[2px_2px_0px_#000000] active:shadow-none"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-black" strokeWidth={3} />
                  </button>
                )}
              </div>

              {/* Contenido principal */}
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="w-16 h-16 bg-emerald-50 border-4 border-black flex items-center justify-center shrink-0 shadow-[3px_3px_0px_#000000]">
                   <Navigation className="w-8 h-8 text-[#43A047]" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-black text-[#263238] uppercase text-2xl leading-none mb-2">
                    {branch.nombre}
                  </h3>
                  <div className="flex flex-col md:flex-row md:items-center gap-x-6 gap-y-2">
                    <span className="text-gray-600 font-bold text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#43A047]" /> {branch.direccion}
                    </span>
                    <span className="text-gray-600 font-bold text-sm flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#43A047]" /> {branch.telefono}
                    </span>
                  </div>
                </div>
              </div>

              {/* Estado de Sucursal */}
              <div className="mt-6 md:mt-0 md:mr-16">
                 <span className="bg-[#C8E6C9] text-[#2E7D32] border-2 border-black px-4 py-1 font-black text-xs uppercase shadow-[2px_2px_0px_#000000]">
                    Sucursal Activa
                 </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CrudModal<Sucursal>
        open={modalOpen}
        title={selected ? 'EDITAR SUCURSAL' : 'NUEVA SUCURSAL'}
        initialData={selected || undefined}
        fields={fields}
        onSubmit={(form) => {
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
        title="¿ELIMINAR SUCURSAL?"
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