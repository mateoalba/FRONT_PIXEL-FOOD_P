import { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertCircle,
  LayoutGrid,
  MapPin
} from 'lucide-react';

import { mesasApi } from '@/api/mesas';
import { sucursalesApi } from '@/api/sucursales';
import type { Mesa } from '@/types/mesa';
import type { Sucursal } from '@/types/sucursal';
import { useCrud } from '@/hooks/useCrud';
import { CrudModal, type Field } from '@/components/modal/CrudModal';
import { ConfirmModal } from '@/components/modal/ConfirmModal';
import ProtectedButton from '@/components/ProtectedButton';
import { useAuth } from '@/hooks/useAuth';

export default function Mesas() {
  const { data, loading, error, createItem, updateItem, deleteItem } = useCrud<Mesa>(mesasApi);
  const { user } = useAuth();

  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<Mesa | null>(null);

  const puedeEditar = user?.permisos.includes('editar_mesas');
  const puedeEliminar = user?.permisos.includes('eliminar_mesas');

  useEffect(() => {
    const cargarSucursales = async () => {
      try {
        const lista = await sucursalesApi.getAll();
        setSucursales(lista);
      } catch (err) {
        console.error("Error cargando sucursales", err);
      }
    };
    cargarSucursales();
  }, []);

  // Mapeo de colores exactos del Figma
  const getTableStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'libre':
        return 'bg-[#43A047]';
      case 'reservada':
        return 'bg-[#FBC02D]';
      case 'ocupada':
        return 'bg-[#E53935]';
      default:
        return 'bg-gray-400';
    }
  };

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
    <div className="min-h-screen bg-linear-to-br from-[#263238] via-[#37474F] to-[#455A64] pb-10">
      {/* HEADER ESTILO FIGMA */}
      <div className="bg-[#263238] border-b-4 border-black mb-8" style={{ boxShadow: '0px 4px 0px #000000' }}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#E53935] border-4 border-black flex items-center justify-center" style={{ boxShadow: '4px 4px 0px #000000' }}>
                <LayoutGrid className="w-8 h-8 text-white" strokeWidth={3} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl text-white font-black uppercase leading-relaxed">
                  Gestión de Mesas
                </h1>
                <p className="text-yellow-400 font-bold uppercase text-sm tracking-widest">PIXEL-FOOD - Control de Aforo</p>
              </div>
            </div>
            
            <ProtectedButton permisos={['crear_mesas']}>
              <button
                onClick={() => { setSelected(null); setModalOpen(true); }}
                className="bg-white hover:bg-gray-100 text-[#263238] border-4 border-black font-black uppercase px-6 py-2 hover:translate-x-1 hover:translate-y-1 transition-transform flex items-center gap-2"
                style={{ boxShadow: '4px 4px 0px #000000' }}
              >
                <Plus className="w-5 h-5" /> Nueva Mesa
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

        <div className="bg-white border-4 border-black" style={{ boxShadow: '8px 8px 0px #000000' }}>
          <div className="bg-linear-to-r from-green-50 to-blue-50 border-b-4 border-black p-6">
            <h2 className="text-[#263238] font-black uppercase text-xl">Estado de Mesas</h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#E53935]"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {data.map((mesa) => (
                  <div
                    key={mesa.id_mesa}
                    className="p-6 border-4 border-black hover:translate-x-1 hover:translate-y-1 transition-all bg-white relative group"
                    style={{ boxShadow: '4px 4px 0px #000000' }}
                  >
                    {/* Indicador de número circular */}
                    <div className={`w-12 h-12 ${getTableStatusColor(mesa.estado)} border-4 border-black mx-auto mb-4 flex items-center justify-center text-white font-black text-xl`} style={{ boxShadow: '3px 3px 0px #000000' }}>
                      {mesa.numero}
                    </div>

                    <p className="text-center font-black text-[#263238] mb-1 uppercase">
                      Mesa {mesa.numero}
                    </p>
                    <p className="text-center text-[10px] font-bold text-gray-500 mb-2 uppercase flex items-center justify-center gap-1">
                      <Users className="w-3 h-3" /> {mesa.capacidad} Pers.
                    </p>
                    <p className="text-center text-[10px] font-black uppercase tracking-tighter">
                      {mesa.estado}
                    </p>
                    <p className="text-center text-[9px] text-gray-400 mt-1 flex items-center justify-center gap-1">
                      <MapPin className="w-2 h-2" /> {mesa.sucursal?.nombre || 'General'}
                    </p>

                    {/* Botones de acción flotantes al hacer hover */}
                    {(puedeEditar || puedeEliminar) && (
                      <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity p-2 border-2 border-black">
                        {puedeEditar && (
                          <button
                            onClick={() => { setSelected(mesa); setModalOpen(true); }}
                            className="w-full py-1 bg-[#263238] text-white border-2 border-black font-black text-[10px] uppercase shadow-[2px_2px_0px_#000]"
                          >
                            <Edit3 className="w-3 h-3 inline mr-1" /> Editar
                          </button>
                        )}
                        {puedeEliminar && (
                          <button
                            onClick={() => { setSelected(mesa); setConfirmOpen(true); }}
                            className="w-full py-1 bg-[#E53935] text-white border-2 border-black font-black text-[10px] uppercase shadow-[2px_2px_0px_#000]"
                          >
                            <Trash2 className="w-3 h-3 inline mr-1" /> Borrar
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* LEYENDA FIGMA */}
            <div className="mt-10 p-4 bg-gray-50 border-4 border-black" style={{ boxShadow: '4px 4px 0px #000000' }}>
              <p className="font-black text-[#263238] mb-3 uppercase text-xs">Leyenda de Disponibilidad:</p>
              <div className="flex gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#43A047] border-2 border-black" style={{ boxShadow: '2px 2px 0px #000000' }}></div>
                  <span className="text-[10px] font-black text-[#263238] uppercase">Libre</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#FBC02D] border-2 border-black" style={{ boxShadow: '2px 2px 0px #000000' }}></div>
                  <span className="text-[10px] font-black text-[#263238] uppercase">Reservada</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#E53935] border-2 border-black" style={{ boxShadow: '2px 2px 0px #000000' }}></div>
                  <span className="text-[10px] font-black text-[#263238] uppercase">Ocupada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALES --- */}
      <CrudModal<Mesa>
        open={modalOpen}
        title={selected ? 'EDITAR CONFIGURACIÓN' : 'REGISTRAR MESA'}
        initialData={selected || undefined}
        fields={fields}
        onSubmit={(form) => {
          const { id_mesa, sucursal, ...payload } = form as any;
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
        title="¿ELIMINAR ESTE REGISTRO?"
        message={`Esta acción removerá la mesa ${selected?.numero} del sistema permanentemente.`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (selected) deleteItem(selected.id_mesa);
          setConfirmOpen(false);
          setSelected(null);
        }}
      />
    </div>
  );
}