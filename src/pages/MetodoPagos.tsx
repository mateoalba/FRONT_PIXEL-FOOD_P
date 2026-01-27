import { useState } from 'react';
import axios from '@/api/axios';
import type { MetodoPago } from '@/types';
import { useCrud } from '@/hooks/useCrud';
import { DataTable } from '@/components/table/DataTable';
import { CrudModal, type Field } from '@/components/modal/CrudModal';
import { ConfirmModal } from '@/components/modal/ConfirmModal';
import { Plus, Edit, Trash2, CreditCard } from 'lucide-react';

const metodoPagoApi = {
  getAll: () => axios.get('/metodo_pago').then(res => res.data),
  create: (data: Partial<MetodoPago>) => axios.post('/metodo_pago', data),
  update: (id: string | number, data: Partial<MetodoPago>) => axios.put(`/metodo_pago/${id}`, data),
  delete: (id: string | number) => axios.delete(`/metodo_pago/${id}`),
};

export default function MetodoPagos() {
  const { data, loading, createItem, updateItem, deleteItem } = useCrud<MetodoPago>(metodoPagoApi);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<MetodoPago | null>(null);

  const fields: Field<MetodoPago>[] = [
    { name: 'tipo', label: 'Nombre del Método', required: true },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-6 h-6 text-[#E11D48]" />
            <h1 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter">
              Configuración de Pagos
            </h1>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest ml-8">
            Administración de métodos de cobro
          </p>
        </div>
        
        <button 
          onClick={() => { setSelected(null); setModalOpen(true); }}
          className="bg-[#E11D48] hover:bg-red-700 text-white px-8 py-3 rounded-2xl font-black uppercase italic flex items-center gap-3 shadow-lg transition-all"
        >
          <Plus className="w-5 h-5 stroke-[3px]" />
          Nuevo Método
        </button>
      </div>

      {/* TABLA: Aquí estaba el error de ReactNode */}
      <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden">
        <DataTable<MetodoPago>
          loading={loading}
          data={data}
          columns={[
            { 
              key: 'tipo', 
              label: 'Método de Pago',
              // ✅ CORRECCIÓN DEFINITIVA: 
              // Usamos una función que devuelve un string o JSX simple
              render: (value: any) => (
                <span className="font-bold text-slate-700 uppercase italic">
                  {typeof value === 'string' ? value : String(value)}
                </span>
              )
            },
          ]}
          renderActions={(item) => (
            <div className="flex gap-3">
              <button 
                onClick={() => { setSelected(item); setModalOpen(true); }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button 
                onClick={() => { setSelected(item); setConfirmOpen(true); }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        />
      </div>

      {/* MODAL DE CRUD */}
      <CrudModal<MetodoPago>
        open={modalOpen}
        title={selected ? 'Editar Método' : 'Nuevo Método'}
        fields={fields}
        initialData={selected || undefined}
        onClose={() => {
          setModalOpen(false);
          setSelected(null);
        }}
        onSubmit={(form) => {
          if (selected) {
            updateItem(selected.id_metodo, form);
          } else {
            createItem(form);
          }
          setModalOpen(false);
          setSelected(null);
        }}
      />

      {/* MODAL DE CONFIRMACIÓN */}
      <ConfirmModal
        open={confirmOpen}
        title="¿Eliminar método?"
        message={`¿Estás seguro de eliminar "${selected?.tipo}"?`}
        onCancel={() => {
          setConfirmOpen(false);
          setSelected(null);
        }}
        onConfirm={() => {
          if (selected) {
            deleteItem(selected.id_metodo);
            setConfirmOpen(false);
            setSelected(null);
          }
        }}
      />
    </div>
  );
}