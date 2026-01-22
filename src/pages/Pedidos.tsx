import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Importamos para navegar
import { pedidosApi } from '@/api/pedidos';
import { facturasApi } from '@/api/facturas'; 
import type { CreatePedidoDto, Pedido, CreateFacturaDto } from '@/types';
import { useCrud } from '@/hooks/useCrud';
import { useAuth } from '@/hooks/useAuth';

// Componentes de UI
import { DataTable } from '@/components/table/DataTable';
import { CrudModal } from '@/components/modal/CrudModal';
import { ConfirmModal } from '@/components/modal/ConfirmModal';
import { TableActions } from '@/components/table/TableActions';
import ProtectedButton from '@/components/ProtectedButton';
import { PedidoForm } from '@/components/form/PedidoForm';
import { ModalCobro } from '@/components/modal/ModalCobro'; 

export default function Pedidos() {
  const navigate = useNavigate(); // ✅ Hook para redireccionar
  const { data, loading, error, createItem, updateItem, deleteItem } = useCrud<Pedido, CreatePedidoDto>(pedidosApi);
  const { user } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<Pedido | null>(null);
  const [cobroOpen, setCobroOpen] = useState(false);

  // --- LÓGICA DE PERMISOS ---
  const esCliente = user?.rol.toLowerCase() === 'cliente';
  const puedeEditar = user?.permisos.includes('editar_pedidos');
  const puedeEliminar = user?.permisos.includes('cancelar_pedidos');
  const puedeFacturar = user?.permisos.includes('ver_facturas'); 
  const puedeVerDetalles = user?.permisos.includes('ver_detalles_pedidos'); // ✅ Nuevo permiso

  const mostrarAcciones = puedeEditar || puedeEliminar || puedeFacturar || puedeVerDetalles;

  const handleCrearFactura = async (dto: CreateFacturaDto) => {
    try {
      await facturasApi.create(dto);
      setCobroOpen(false);
      setSelected(null);
      // Recarga suave o refresh del hook si estuviera disponible
      window.location.reload(); 
    } catch (err) {
      console.error(err);
      alert("Error al procesar el pago y generar la factura.");
    }
  };

  const columns = [
    { 
      key: 'fecha', 
      label: 'Fecha', 
      render: (row: Pedido) => new Date(row.fecha).toLocaleString('es-ES', { 
        dateStyle: 'short', timeStyle: 'short' 
      }) 
    },
    { 
        key: 'mesa', 
        label: 'Mesa', 
        render: (row: Pedido) => row.mesa ? `Mesa ${row.mesa.numero}` : 'Llevar' 
    },
    { 
      key: 'estado', 
      label: 'Estado', 
      render: (row: Pedido) => (
        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
          row.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-700' :
          row.estado === 'CANCELADO' ? 'bg-red-100 text-red-700' : 
          row.estado === 'PAGADO' ? 'bg-blue-100 text-blue-700' :
          'bg-green-100 text-green-700'
        }`}>
          {row.estado}
        </span>
      )
    },
    { 
      key: 'total', 
      label: 'Total Mesa', 
      render: (row: Pedido) => <span className="font-bold text-gray-900">${Number(row.total).toFixed(2)}</span>
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 italic uppercase tracking-tighter">
            {esCliente ? 'Mis Pedidos' : 'Órdenes Activas'}
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            {esCliente ? 'Sigue tus platos en tiempo real' : 'Monitoreo de mesas y facturación'}
          </p>
        </div>
        
        <ProtectedButton permisos={['crear_pedidos']}>
          <button
            onClick={() => { setSelected(null); setModalOpen(true); }}
            className="bg-gray-900 text-white px-6 py-3 rounded-2xl hover:bg-black transition-all shadow-lg font-bold text-sm"
          >
            {esCliente ? '+ NUEVO PEDIDO' : '+ REGISTRAR MESA'}
          </button>
        </ProtectedButton>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-100 p-4 rounded-2xl mb-6 text-red-700 text-sm font-bold">
          ⚠️ {error}
        </div>
      )}

      <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable<Pedido>
          columns={columns}
          data={data}
          loading={loading}
          renderActions={mostrarAcciones ? (pedido) => (
            <div className="flex items-center gap-2">
              {/* ✅ BOTÓN NUEVO: Gestionar Consumo (Detalles) */}
              {puedeVerDetalles && (
                <button
                  onClick={() => navigate(`/pedidos/${pedido.id_pedido}/detalle`)}
                  className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all font-bold text-[10px] border border-indigo-100 uppercase"
                  title="Gestionar Platos"
                >
                  🍽️ Consumo
                </button>
              )}

              <TableActions 
                onEdit={() => { setSelected(pedido); setModalOpen(true); }}
                onDelete={() => { setSelected(pedido); setConfirmOpen(true); }}
                showDelete={puedeEliminar && pedido.estado === 'PENDIENTE'}
                showEdit={puedeEditar && !esCliente && pedido.estado !== 'PAGADO'}
                customActions={
                  puedeFacturar && pedido.estado === 'ENTREGADO' && (
                    <button
                      onClick={() => { setSelected(pedido); setCobroOpen(true); }}
                      className="p-2 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all flex items-center gap-1 border border-emerald-200 px-3"
                      title="Cobrar y Facturar"
                    >
                      <span className="font-black text-xs">$ COBRAR</span>
                    </button>
                  )
                }
              />
            </div>
          ) : undefined}
        />
      </div>

      {/* Modal de Pedido (Formulario Principal) */}
      <CrudModal<Pedido>
        open={modalOpen}
        title={selected ? 'Editar Mesa' : 'Nueva Mesa'}
        fields={[]} 
        onClose={() => { setModalOpen(false); setSelected(null); }}
        onSubmit={() => {}} 
      >
        <PedidoForm 
          selected={selected}
          user={user}
          onSuccess={() => {
            setModalOpen(false);
            setSelected(null);
          }}
          createItem={createItem}
          updateItem={updateItem}
        />
      </CrudModal>

      {/* Modal de Confirmación para Anular */}
      <ConfirmModal
        open={confirmOpen}
        title="¿Anular Pedido?"
        message={`Esta acción liberará la mesa y devolverá los productos al stock.`}
        onCancel={() => { setConfirmOpen(false); setSelected(null); }}
        onConfirm={() => {
          if (selected) deleteItem(selected.id_pedido);
          setConfirmOpen(false);
          setSelected(null);
        }}
      />

      {/* MODAL DE COBRO */}
      {cobroOpen && selected && (
        <ModalCobro 
          pedido={selected}
          onClose={() => { setCobroOpen(false); setSelected(null); }}
          onConfirm={handleCrearFactura}
        />
      )}
    </div>
  );
}