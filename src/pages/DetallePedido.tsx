import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { detallePedidoApi } from '@/api/detalles_pedidos';
import { platosApi } from '@/api/platos';
import { useCrud } from '@/hooks/useCrud';
import type { DetallePedido, Plato, CreateDetallePedidoDto } from '@/types';
import { DataTable } from '@/components/table/DataTable';

// Definimos las Props por si lo usas con el Wrapper
interface Props {
  idPedido?: string; 
  estadoPedido?: string;
}

export default function DetallePedido({ idPedido: propId, estadoPedido = 'pendiente' }: Props) {
  // 1. Obtenemos el ID de la URL si no viene por Props
  const { id: urlId } = useParams<{ id: string }>();
  const idActual = propId || urlId || '';

  // 2. Hook de CRUD (Cambiamos reload por refresh para que coincida con tu useCrud)
  const { data: detalles, loading, refresh } = useCrud<DetallePedido, CreateDetallePedidoDto>(detallePedidoApi);
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3. Formulario (Solo necesitamos id_plato y cantidad, el subtotal lo hace el backend)
  const [form, setForm] = useState({ id_plato: '', cantidad: 1 });

  useEffect(() => {
    platosApi.getAll().then(setPlatos);
  }, []);

  // Filtrar los detalles que pertenecen a este pedido
  const detallesFiltrados = detalles.filter(d => d.id_pedido === idActual);
  const totalCuenta = detallesFiltrados.reduce((acc, curr) => acc + Number(curr.subtotal), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id_plato) return alert("Selecciona un plato");

    setIsSubmitting(true);
    try {
      await detallePedidoApi.create({
        id_pedido: idActual,
        id_plato: form.id_plato,
        cantidad: form.cantidad
      });
      setShowModal(false);
      setForm({ id_plato: '', cantidad: 1 });
      refresh(); // ✅ Usamos refresh como pide tu hook
    } catch (error) {
      alert("Error al añadir plato. Verifica si el pedido sigue abierto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { 
      key: 'plato', 
      label: 'Producto', 
      render: (row: DetallePedido) => (
        <span className="font-bold text-gray-800">{row.plato?.nombre || 'Producto'}</span>
      )
    },
    { 
      key: 'cantidad', 
      label: 'Cant.', 
      render: (row: DetallePedido) => <span className="bg-gray-100 px-2 py-1 rounded font-mono">x{row.cantidad}</span> 
    },
    { 
      key: 'subtotal', 
      label: 'Subtotal', 
      render: (row: DetallePedido) => (
        <span className="font-black text-emerald-600">${Number(row.subtotal).toFixed(2)}</span>
      )
    }
  ];

  return (
    <div className="p-6">
      {/* Header con el Total Dinámico */}
      <div className="bg-gray-900 text-white p-8 rounded-4xl flex justify-between items-center shadow-2xl mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 font-black">Total a Pagar</p>
          <h1 className="text-5xl font-black">${totalCuenta.toFixed(2)}</h1>
        </div>
        {estadoPedido === 'pendiente' && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-2xl font-black transition-all transform hover:scale-105"
          >
            + AGREGAR PLATO
          </button>
        )}
      </div>

      {/* Tabla de Consumo */}
      <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable columns={columns} data={detallesFiltrados} loading={loading} />
      </div>

      {/* Modal para Nuevo Plato */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-4xl p-10 w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
            <h2 className="text-3xl font-black mb-6 italic uppercase">Añadir a la cuenta</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Seleccionar Plato/Bebida</label>
                <select 
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold outline-none focus:border-emerald-500"
                  value={form.id_plato}
                  onChange={e => setForm({...form, id_plato: e.target.value})}
                  required
                >
                  <option value="">-- Buscar en el menú --</option>
                  {platos.map(p => (
                    <option key={p.id_plato} value={p.id_plato}>{p.nombre.toUpperCase()} (${p.precio})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Cantidad</label>
                <input 
                  type="number" min="1"
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold outline-none focus:border-emerald-500"
                  value={form.cantidad}
                  onChange={e => setForm({...form, cantidad: Number(e.target.value)})}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 font-bold text-gray-400">Cancelar</button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-black hover:bg-black transition-all"
                >
                  {isSubmitting ? 'GUARDANDO...' : 'CONFIRMAR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}