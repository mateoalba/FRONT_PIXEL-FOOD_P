import { useState, useEffect } from 'react';
import axios from '@/api/axios';
import type { Pedido, CreateFacturaDto, MetodoPago } from '@/types';

interface Props {
  pedido: Pedido;
  onClose: () => void;
  onConfirm: (dto: CreateFacturaDto) => void;
}

export function ModalCobro({ pedido, onClose, onConfirm }: Props) {
  const [metodos, setMetodos] = useState<MetodoPago[]>([]);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState('');
  const [referencia, setReferencia] = useState('');
  const [loadingMetodos, setLoadingMetodos] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMetodos = async () => {
      try {
        const res = await axios.get('/metodo_pago');
        setMetodos(res.data);
      } catch (err) {
        console.error("Error cargando métodos de pago", err);
      } finally {
        setLoadingMetodos(false);
      }
    };
    fetchMetodos();
  }, []);

  // ✅ Solución al error de lógica: Buscamos el tipo del método seleccionado
  const infoMetodo = metodos.find(m => m.id_metodo === metodoSeleccionado);
  const tipoNormalizado = String(infoMetodo?.tipo || '').toLowerCase();
  
  const requiereReferencia = tipoNormalizado === 'tarjeta' || tipoNormalizado === 'transferencia';

  const handleConfirm = async () => {
    if (!metodoSeleccionado) return alert("Por favor seleccione un método de pago");
    
    if (requiereReferencia && !referencia.trim()) {
      return alert("Por favor ingrese el número de referencia o váucher");
    }

    setIsSubmitting(true);
    try {
      await onConfirm({
        id_pedido: pedido.id_pedido,
        id_metodo: metodoSeleccionado,
        total: Number(pedido.total),
        // @ts-ignore - Agregamos el campo para que llegue al backend
        referencia_pago: requiereReferencia ? referencia : 'EFECTIVO',
      });
    } catch (error) {
      console.error("Error al procesar cobro", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/20">
        
        {/* Cabecera */}
        <div className={`${isSubmitting ? 'bg-gray-600' : 'bg-emerald-600'} p-6 text-white transition-colors duration-500`}>
          <h3 className="text-2xl font-black italic tracking-tight">FINALIZAR VENTA</h3>
          <p className="text-[10px] opacity-70 font-mono">Pedido: {pedido.id_pedido.slice(0,8)}</p>
        </div>
        
        <div className="p-8">
          <div className="mb-8 bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Total</p>
            <p className="text-5xl font-black text-emerald-700">
              <span className="text-2xl mr-1">$</span>{Number(pedido.total).toFixed(2)}
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-[11px] font-black text-gray-500 uppercase mb-2 ml-1">Medio de Pago</label>
              <div className="relative">
                <select 
                  className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-white focus:border-emerald-500 outline-none transition-all font-bold text-gray-700 appearance-none disabled:bg-gray-50"
                  value={metodoSeleccionado}
                  onChange={(e) => {
                    setMetodoSeleccionado(e.target.value);
                    setReferencia('');
                  }}
                  disabled={loadingMetodos || isSubmitting}
                >
                  <option value="">{loadingMetodos ? 'Cargando...' : 'Seleccione opción'}</option>
                  {metodos.map((m) => (
                    <option key={m.id_metodo} value={m.id_metodo}>
                      {/* ✅ SOLUCIÓN ERROR image_e85024: String() asegura que sea texto */}
                      {String(m.tipo || '').toUpperCase()}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
              </div>
            </div>

            {requiereReferencia && (
              <div className="animate-in slide-in-from-top-4 duration-300">
                <label className="block text-[11px] font-black text-emerald-600 uppercase mb-2 ml-1">Váucher / Referencia</label>
                <input 
                  type="text"
                  className="w-full border-2 border-emerald-100 rounded-2xl p-4 bg-emerald-50/30 focus:border-emerald-500 focus:bg-white outline-none transition-all font-mono font-bold"
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                  placeholder="000-12345"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 mt-10">
            <button 
              onClick={handleConfirm}
              disabled={!metodoSeleccionado || (requiereReferencia && !referencia) || isSubmitting}
              className={`w-full py-5 rounded-2xl text-white font-black tracking-widest transition-all shadow-xl ${
                !metodoSeleccionado || (requiereReferencia && !referencia) || isSubmitting 
                ? 'bg-gray-200 shadow-none text-gray-400' 
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-emerald-100'
              }`}
            >
              {isSubmitting ? 'PROCESANDO...' : 'CONFIRMAR PAGO'}
            </button>
            <button onClick={onClose} disabled={isSubmitting} className="w-full py-2 text-gray-400 text-[10px] font-bold hover:text-gray-600 uppercase tracking-widest">
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}