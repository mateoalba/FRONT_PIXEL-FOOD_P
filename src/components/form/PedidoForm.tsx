import { useState, useEffect } from 'react';
import type { PedidoItem, Pedido, Plato } from '@/types';
import { platosApi } from '@/api/platos'; 
import { mesasApi } from '@/api/mesas'; 

interface Props {
  selected: Pedido | null;
  user: any;
  onSuccess: () => void;
  createItem: (data: any) => Promise<any>;
  updateItem: (id: string, data: any) => Promise<any>;
}

export function PedidoForm({ selected, user, onSuccess, createItem, updateItem }: Props) {
  // --- ESTADOS ---
  const [items, setItems] = useState<PedidoItem[]>([]);
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [mesas, setMesas] = useState<any[]>([]); 
  const [tipo, setTipo] = useState<string>('LOCAL');
  const [idMesa, setIdMesa] = useState<string>('');
  const [estado, setEstado] = useState<string>('PENDIENTE');

  // --- CARGA DE DATOS ---
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const dataPlatos = await platosApi.getAll();
        setPlatos(dataPlatos);

        const dataMesas = await mesasApi.getAll();
        
        // CORRECCIÓN AQUÍ: Filtramos por "Libre" (como vimos en tu captura)
        const disponibles = dataMesas.filter((m: any) => 
          m.estado.toLowerCase() === 'libre'
        );
        setMesas(disponibles);

        if (selected) {
          setEstado(selected.estado);
          setTipo(selected.tipo);
          setIdMesa(selected.id_mesa || '');
        }
      } catch (error) {
        console.error("Error al cargar datos en el formulario:", error);
      }
    };
    cargarDatos();
  }, [selected]);

  // --- LÓGICA DEL CARRITO ---
  const agregarPlato = (plato: Plato) => {
    const existe = items.find(i => i.id_plato === plato.id_plato);
    if (existe) {
      setItems(items.map(i => 
        i.id_plato === plato.id_plato ? { ...i, cantidad: i.cantidad + 1 } : i
      ));
    } else {
      setItems([...items, { id_plato: plato.id_plato, cantidad: 1 }]);
    }
  };

  const calcularTotal = (): number => {
    return items.reduce((acc, item) => {
      const p = platos.find(pl => pl.id_plato === item.id_plato);
      return acc + (p ? Number(p.precio) * item.cantidad : 0);
    }, 0);
  };

  // --- ENVÍO DEL FORMULARIO ---
  const enviarFormulario = async () => {
    try {
      if (selected) {
        await updateItem(selected.id_pedido, { estado });
      } else {
        const nuevoPedido = {
          tipo,
          id_usuario: user?.id || user?.id_usuario,
          // Enviamos null si no es local para que el UUID no falle
          id_mesa: tipo === 'LOCAL' && idMesa !== "" ? idMesa : null,
          total: Number(calcularTotal().toFixed(2)),
          estado: 'PENDIENTE',
          items: items.map(i => ({
            id_plato: i.id_plato,
            cantidad: Number(i.cantidad)
          }))
        };

        await createItem(nuevoPedido);
      }
      onSuccess();
    } catch (error: any) {
      console.error("Error detallado:", error.response?.data);
      alert("Error en el pedido: " + (error.response?.data?.message || "Revisa los campos"));
    }
  };

  // --- VISTA DE EDICIÓN ---
  if (selected) {
    return (
      <div className="p-4 space-y-4">
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
          <p className="text-sm text-blue-800">Actualizando Pedido: <strong>{selected.id_pedido.slice(0, 8)}</strong></p>
        </div>
        <label className="block text-sm font-medium text-gray-700">Estado de la Orden</label>
        <select 
          value={estado} 
          onChange={(e) => setEstado(e.target.value)}
          className="w-full border p-2 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="PENDIENTE">Pendiente</option>
          <option value="PREPARANDO">En Cocina</option>
          <option value="LISTO">Listo para entrega</option>
          <option value="ENTREGADO">Entregado</option>
        </select>
        <button 
          onClick={enviarFormulario} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors mt-4"
        >
          Guardar Cambios
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 max-h-[85vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Servicio</label>
          <select 
            value={tipo} 
            onChange={(e) => {
                setTipo(e.target.value);
                if(e.target.value !== 'LOCAL') setIdMesa(''); // Limpiar mesa si cambia a para llevar
            }} 
            className="w-full border p-2 rounded-md text-sm bg-white"
          >
            <option value="LOCAL">Consumo Local</option>
            <option value="PARA_LLEVAR">Para Llevar</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Mesa</label>
          <select 
            value={idMesa} 
            onChange={(e) => setIdMesa(e.target.value)}
            disabled={tipo !== 'LOCAL'}
            className="w-full border p-2 rounded-md text-sm bg-white disabled:bg-gray-100"
          >
            <option value="">Seleccionar mesa...</option>
            {mesas.map(m => (
              <option key={m.id_mesa} value={m.id_mesa}>
                Mesa {m.numero} ({m.capacidad} pers.)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="border rounded-lg p-3 bg-gray-50 shadow-inner">
        <p className="text-xs font-bold mb-2 text-gray-600 uppercase tracking-wider">Menú Disponible</p>
        <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto pr-2">
          {platos.map(p => (
            <button 
              key={p.id_plato} 
              onClick={() => agregarPlato(p)} 
              className="flex justify-between items-center text-left text-sm p-2 bg-white hover:bg-blue-50 border rounded-md transition-colors"
            >
              <span className="font-medium">{p.nombre}</span>
              <span className="text-blue-600 font-bold">${Number(p.precio).toFixed(2)} +</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border-2 border-dashed border-blue-100 p-3 rounded-lg">
        <p className="text-xs font-bold text-blue-600 mb-2 uppercase">Tu Orden Actual ({items.length})</p>
        {items.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No hay platos seleccionados...</p>
        ) : (
          <div className="space-y-1">
            {items.map(item => (
              <div key={item.id_plato} className="text-sm flex justify-between border-b border-gray-50 pb-1">
                <span className="text-gray-700">
                  {platos.find(p => p.id_plato === item.id_plato)?.nombre} 
                  <strong className="ml-2 text-blue-600">x{item.cantidad}</strong>
                </span>
                <span className="font-semibold text-gray-900">
                  ${((platos.find(p => p.id_plato === item.id_plato)?.precio || 0) * item.cantidad).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-2 mt-2 border-t-2 border-blue-100">
              <span className="font-bold text-gray-800 uppercase text-xs">Total a Pagar</span>
              <span className="font-black text-blue-700">${calcularTotal().toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={enviarFormulario} 
        // El botón solo se habilita si hay items Y (si es local, que tenga mesa)
        disabled={items.length === 0 || (tipo === 'LOCAL' && !idMesa)} 
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-lg shadow-md transition-transform active:scale-95 disabled:bg-gray-300 disabled:shadow-none"
      >
        Confirmar Pedido
      </button>
    </div>
  );
}