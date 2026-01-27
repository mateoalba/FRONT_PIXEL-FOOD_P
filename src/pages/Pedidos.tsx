import { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { 
    ShoppingBag, 
    Clock, 
    UtensilsCrossed, 
    AlertCircle
  } from 'lucide-react';
  import { pedidosApi } from '@/api/pedidos';
  import type { CreatePedidoDto, Pedido } from '@/types';
  import { useCrud } from '@/hooks/useCrud';
  import { useAuth } from '@/hooks/useAuth';

  // Componentes de UI
  import { DataTable } from '@/components/table/DataTable';
  import { CrudModal } from '@/components/modal/CrudModal';
  import { ConfirmModal } from '@/components/modal/ConfirmModal';
  import ProtectedButton from '@/components/ProtectedButton';
  import { PedidoForm } from '@/components/form/PedidoForm';

  export default function Pedidos() {
    const navigate = useNavigate();
    const { data, loading, error, createItem, updateItem, deleteItem } = useCrud<Pedido, CreatePedidoDto>(pedidosApi);
    const { user } = useAuth();

    const [modalOpen, setModalOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selected, setSelected] = useState<Pedido | null>(null);

    const esCliente = user?.rol.toLowerCase() === 'cliente';
    const puedeEditar = user?.permisos.includes('editar_pedidos');
    const puedeEliminar = user?.permisos.includes('cancelar_pedidos');
    const puedeFacturar = user?.permisos.includes('ver_facturas'); 
    const puedeVerDetalles = user?.permisos.includes('ver_detalles_pedidos');

    const mostrarAcciones = puedeEditar || puedeEliminar || puedeFacturar || puedeVerDetalles;

    const renderEstado = (estado: string) => {
      const styles: Record<string, string> = {
        'PENDIENTE': 'bg-[#FB8C00]',
        'PAGADO': 'bg-[#43A047]',
        'CANCELADO': 'bg-[#E53935]',
        'ENTREGADO': 'bg-[#FBC02D] text-[#263238]',
      };
      return (
        <span 
          className={`px-3 py-1 border-2 border-black font-black uppercase text-[10px] inline-block ${styles[estado] || 'bg-gray-500'} text-white`}
          style={{ boxShadow: '2px 2px 0px #000000' }}
        >
          {estado}
        </span>
      );
    };

    const columns = [
      { 
        key: 'id_pedido', 
        label: 'Pedido', 
        render: (row: Pedido) => (
          <span className="font-black text-[#263238]">
            #{typeof row.id_pedido === 'string' ? row.id_pedido.substring(0, 5).toUpperCase() : row.id_pedido}
          </span>
        )
      },
      { 
          key: 'mesa', 
          label: 'Mesa', 
          render: (row: Pedido) => (
            <span className="font-bold text-[#263238]">
              {row.mesa ? row.mesa.numero : 'Llevar'}
            </span>
          )
      },
      { 
        key: 'articulos', 
        label: 'Artículos', 
        render: (row: Pedido) => (
          <span className="text-sm font-bold text-gray-600">
            {/* SOLUCIÓN AL ERROR: Agregamos validaciones ?. para evitar el undefined */}
            {row.detalles && row.detalles.length > 0 
              ? row.detalles.map(d => `${d.producto?.nombre || 'Producto'} x${d.cantidad}`).join(', ') 
              : 'Sin artículos'}
          </span>
        )
      },
      { 
        key: 'estado', 
        label: 'Estado', 
        render: (row: Pedido) => renderEstado(row.estado)
      },
      { 
        key: 'fecha', 
        label: 'Tiempo', 
        render: (row: Pedido) => (
          <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
            <Clock className="w-3 h-3" />
            {new Date(row.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </div>
        )
      },
      { 
        key: 'total', 
        label: 'Total', 
        render: (row: Pedido) => (
          <span className="font-black text-[#E53935] text-right block">
            ${Number(row.total).toFixed(2)}
          </span>
        )
      }
    ];

    return (
      <div className="min-h-screen bg-linear-to-br from-[#263238] via-[#37474F] to-[#455A64] pb-10">
        <div className="bg-[#263238] border-b-4 border-black mb-8" style={{ boxShadow: '0px 4px 0px #000000' }}>
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#E53935] border-4 border-black flex items-center justify-center" style={{ boxShadow: '4px 4px 0px #000000' }}>
                  <ShoppingBag className="w-8 h-8 text-white" strokeWidth={3} />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl text-white font-black uppercase leading-relaxed">
                    {esCliente ? 'Mis Pedidos' : 'Gestión de Pedidos'}
                  </h1>
                  <p className="text-yellow-400 font-bold uppercase text-sm tracking-widest">PIXEL-FOOD - Gestión Total</p>
                </div>
              </div>
              
              <ProtectedButton permisos={['crear_pedidos']}>
                <button
                  onClick={() => { setSelected(null); setModalOpen(true); }}
                  className="bg-white hover:bg-gray-100 text-[#263238] border-4 border-black font-black uppercase px-6 py-2 hover:translate-x-1 hover:translate-y-1 transition-transform"
                  style={{ boxShadow: '4px 4px 0px #000000' }}
                >
                  {esCliente ? '+ Nuevo Pedido' : '+ Registrar Mesa'}
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
            <div className="bg-linear-to-r from-red-50 to-orange-50 border-b-4 border-black p-6">
              <h2 className="text-[#263238] font-black uppercase text-xl flex items-center gap-3">
                <UtensilsCrossed className="w-6 h-6 text-[#E53935]" />
                Órdenes Activas
              </h2>
            </div>
            
            <div className="p-4 overflow-x-auto">
              <DataTable<Pedido>
                columns={columns}
                data={data}
                loading={loading}
                renderActions={mostrarAcciones ? (pedido) => (
                  <div className="flex items-center gap-2 px-4">
                    {puedeVerDetalles && (
                      <button
                        // Ajustada para que use el prefijo /admin si es staff
                        onClick={() => navigate(esCliente ? `/pedidos/${pedido.id_pedido}/detalle` : `/admin/pedidos/${pedido.id_pedido}/detalle`)}
                        className="px-3 py-1 bg-[#263238] text-white border-2 border-black font-black text-[10px] uppercase shadow-[2px_2px_0px_#000]"
                      >
                        🍽️ Consumo
                      </button>
                    )}
                    {puedeFacturar && pedido.estado === 'ENTREGADO' && (
                      <button
                        // Ajustada para usar la ruta universal de caja que definimos en AppRoutes
                        onClick={() => navigate(`/caja/${pedido.id_pedido}`)}
                        className="px-3 py-1 bg-[#43A047] text-white border-2 border-black font-black text-[10px] uppercase shadow-[2px_2px_0px_#000]"
                      >
                        $ Cobrar
                      </button>
                    )}
                    {puedeEditar && !esCliente && pedido.estado !== 'PAGADO' && (
                      <button
                        onClick={() => { setSelected(pedido); setModalOpen(true); }}
                        className="px-3 py-1 bg-white border-2 border-black text-[#263238] font-black text-[10px] uppercase shadow-[2px_2px_0px_#000]"
                      >
                        Editar
                      </button>
                    )}
                    {puedeEliminar && pedido.estado === 'PENDIENTE' && (
                      <button
                        onClick={() => { setSelected(pedido); setConfirmOpen(true); }}
                        className="px-2 py-1 text-[#E53935] font-black text-[10px] uppercase"
                      >
                        Anular
                      </button>
                    )}
                  </div>
                ) : undefined}
              />
            </div>
          </div>
        </div>

        <CrudModal<Pedido>
          open={modalOpen}
          title={selected ? 'EDITAR MESA' : 'NUEVA MESA'}
          fields={[]} 
          onClose={() => { setModalOpen(false); setSelected(null); }}
          onSubmit={() => {}} 
        >
          <PedidoForm 
            selected={selected}
            user={user}
            onSuccess={() => { setModalOpen(false); setSelected(null); }}
            createItem={createItem}
            updateItem={updateItem}
          />
        </CrudModal>

        <ConfirmModal
          open={confirmOpen}
          title="¿ANULAR PEDIDO?"
          message="Esta acción liberará la mesa y devolverá los productos al stock."
          onCancel={() => { setConfirmOpen(false); setSelected(null); }}
          onConfirm={() => {
            if (selected) deleteItem(selected.id_pedido);
            setConfirmOpen(false);
            setSelected(null);
          }}
        />
      </div>
    );
  }