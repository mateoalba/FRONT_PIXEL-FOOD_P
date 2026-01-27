import { useState } from 'react';
import { categoriasApi } from '@/api/categorias';
import type { Categoria } from '@/types';
import { useCrud } from '@/hooks/useCrud';
import { CrudModal } from '@/components/modal/CrudModal';
import { ConfirmModal } from '@/components/modal/ConfirmModal';
import ProtectedButton from '@/components/ProtectedButton';
import type { Field } from '@/components/modal/CrudModal';
import { Tag, Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';

export default function Categorias() {
  const { data, loading, error, createItem, updateItem, deleteItem } = useCrud<Categoria>(categoriasApi);

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<Categoria | null>(null);

  const fields: Field<Categoria>[] = [
    { name: 'nombre', label: 'Nombre', required: true },
    { name: 'descripcion', label: 'Descripción', required: true },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-[#263238] via-[#37474F] to-[#455A64] pb-10 font-sans">
      
      {/* HEADER ESTILO FIGMA (Copiado de Mesas) */}
      <div className="bg-[#263238] border-b-4 border-black mb-8" style={{ boxShadow: '0px 4px 0px #000000' }}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#E53935] border-4 border-black flex items-center justify-center" style={{ boxShadow: '4px 4px 0px #000000' }}>
                <Tag className="w-8 h-8 text-white" strokeWidth={3} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl text-white font-black uppercase leading-relaxed">
                  Gestión de Categorías
                </h1>
                <p className="text-yellow-400 font-bold uppercase text-sm tracking-widest">PIXEL-FOOD - Control de Clasificación</p>
              </div>
            </div>
            
            <ProtectedButton permisos={['crear_categorias']}>
              <button
                onClick={() => { setSelected(null); setModalOpen(true); }}
            className="bg-[#FB8C00] hover:bg-[#f57c00] text-white border-4 border-black font-black uppercase px-6 py-2 hover:translate-x-1 hover:translate-y-1 transition-transform flex items-center gap-2"
                style={{ boxShadow: '4px 4px 0px #000000' }}
              >
                <Plus className="w-5 h-5" /> Nueva Categoría
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

        {/* Contenedor Principal Estilo Mesas */}
        <div className="bg-white border-4 border-black" style={{ boxShadow: '8px 8px 0px #000000' }}>
          <div className="bg-linear-to-r from-orange-50 to-yellow-50 border-b-4 border-black p-6">
            <h2 className="text-[#263238] font-black uppercase text-xl">Listado de Categorías</h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#E53935]"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((category) => (
                  <div 
                    key={category.id_categoria} 
                    className="border-4 border-black bg-white p-6 hover:translate-x-1 hover:translate-y-1 transition-all relative group"
                    style={{ boxShadow: '4px 4px 0px #000000' }}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 border-4 border-black flex items-center justify-center bg-[#FB8C00] text-white shadow-[3px_3px_0px_#000000]">
                        <Tag className="w-6 h-6" strokeWidth={3} />
                      </div>
                      <div>
                        <h3 className="font-black text-lg text-[#263238] uppercase italic leading-none">{category.nombre}</h3>
                        <p className="text-[11px] font-bold text-gray-500 leading-tight mt-2 uppercase">{category.descripcion}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t-2 border-dashed border-gray-200">
                      <span className="bg-[#263238] text-white px-3 py-1 border-2 border-black font-black uppercase text-[10px] shadow-[2px_2px_0px_#000000]">
                        Módulo Activo
                      </span>
                      
                      <div className="flex gap-2">
                        <ProtectedButton permisos={['editar_categorias']}>
                          <button 
                            className="p-2 border-2 border-black font-black bg-white hover:bg-yellow-400 transition-colors shadow-[2px_2px_0px_#000000]"
                            onClick={() => { setSelected(category); setModalOpen(true); }}
                          >
                            <Pencil className="w-4 h-4 text-black" strokeWidth={3} />
                          </button>
                        </ProtectedButton>

                        <ProtectedButton permisos={['eliminar_categorias']}>
                          <button 
                            className="p-2 border-2 border-black font-black bg-white text-[#E53935] hover:bg-[#E53935] hover:text-white transition-colors shadow-[2px_2px_0px_#000000]"
                            onClick={() => { setSelected(category); setConfirmOpen(true); }}
                          >
                            <Trash2 className="w-4 h-4" strokeWidth={3} />
                          </button>
                        </ProtectedButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      <CrudModal<Categoria>
        open={modalOpen}
        title={selected ? 'EDITAR CATEGORÍA' : 'NUEVA CATEGORÍA'}
        initialData={selected || undefined}
        fields={fields}
        onSubmit={(form) => {
          if (selected) {
            const { id_categoria, ...payload } = form as any;
            updateItem(selected.id_categoria, payload);
          } else {
            createItem(form);
          }
          setModalOpen(false);
          setSelected(null);
        }}
        onClose={() => { setModalOpen(false); setSelected(null); }}
      />

      <ConfirmModal
        open={confirmOpen}
        title="¡ALERTA DE ELIMINACIÓN!"
        message={`¿Estás seguro de que deseas eliminar la categoría "${selected?.nombre}"?`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (selected) deleteItem(selected.id_categoria);
          setConfirmOpen(false);
        }}
      />
    </div>
  );
}