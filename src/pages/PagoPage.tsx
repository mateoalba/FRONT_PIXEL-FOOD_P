import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '@/api/axios';
import { useAuth } from '@/hooks/useAuth';
import ProtectedButton from '@/components/ProtectedButton';
import { 
  CreditCard, 
  Banknote, 
  Smartphone, 
  CheckCircle, 
  Settings,
  ArrowLeft,
  Download
} from 'lucide-react';
import type { MetodoPago } from '@/types';

export default function PagoPage() {
  // CAMBIO AQUÍ: Debe ser 'id' porque así lo definiste en AppRoutes (:id)
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const [metodos, setMetodos] = useState<MetodoPago[]>([]);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState<string | number>('');
  const [tipoSeleccionado, setTipoSeleccionado] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [montoTotal, setMontoTotal] = useState<number>(0);

  const invoiceNumber = `INV-${Date.now()}`;
  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Cargar métodos de pago
        const resMetodos = await axios.get('/metodo_pago');
        setMetodos(resMetodos.data);
        
        if (resMetodos.data.length > 0) {
          const primerMetodo = resMetodos.data[0];
          setMetodoSeleccionado(primerMetodo.id_metodo);
          setTipoSeleccionado(String(primerMetodo.tipo).toLowerCase());
        }

        // CAMBIO AQUÍ: Usamos 'id' que viene del useParams
        if (id) {
          const resPedido = await axios.get(`/pedido/${id}`); // Asegúrate que la ruta sea /pedidos o /pedido según tu API
          if (resPedido.data) {
            const totalDeDB = parseFloat(resPedido.data.total);
            setMontoTotal(isNaN(totalDeDB) ? 0 : totalDeDB);
          }
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setMontoTotal(0);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]); // Escuchar cambios en 'id'

  const handlePayment = async () => {
    setPaymentCompleted(true);
  };

  const renderIcon = (tipo: any) => {
    const name = String(tipo || "").toLowerCase();
    if (name.includes('tarjeta')) return <CreditCard className="w-6 h-6 text-white" />;
    if (name.includes('efectivo')) return <Banknote className="w-6 h-6 text-white" />;
    if (name.includes('transferencia')) return <Smartphone className="w-6 h-6 text-white" />;
    return <CreditCard className="w-6 h-6 text-white" />;
  };

  const formatNumber = (num: number) => (Number(num) || 0).toFixed(2);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBC02D]">
        <div className="text-center font-black text-[#263238] animate-bounce uppercase text-2xl">
          PROCESANDO CUENTA...
        </div>
      </div>
    );
  }

  if (paymentCompleted) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#43A047] to-[#2E7D32] flex items-center justify-center p-4">
        <div className="max-w-3xl w-full border-4 border-black bg-white p-8 md:p-12" style={{ boxShadow: '12px 12px 0px #000000' }}>
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-[#FBC02D] border-4 border-black mx-auto mb-6 flex items-center justify-center animate-bounce" style={{ boxShadow: '6px 6px 0px #000000' }}>
                <CheckCircle className="w-14 h-14 text-white" strokeWidth={3} />
              </div>
              <h2 className="pixel-font text-3xl md:text-4xl text-[#263238] mb-4 leading-relaxed uppercase">¡Pago Exitoso!</h2>
              <p className="text-lg font-black text-slate-500 uppercase">Atendido por: {user?.nombre || 'Admin'}</p>
            </div>

            <div className="bg-white border-4 border-black p-8 mb-8" style={{ boxShadow: '6px 6px 0px #000000' }}>
              <div className="flex justify-between items-start mb-8 pb-6 border-b-4 border-black">
                <div>
                  <h3 className="pixel-font text-2xl text-[#E53935] mb-2 leading-relaxed">PIXEL-FOOD</h3>
                  <p className="text-sm font-bold uppercase">FACTURACIÓN ELECTRÓNICA</p>
                </div>
                <div className="text-right text-sm font-bold">
                  <p>N°: {invoiceNumber}</p>
                  <p>{currentDate}</p>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t-4 border-black font-black">
                <div className="flex justify-between">
                  <span className="uppercase text-slate-500">Subtotal:</span>
                  <span>${formatNumber(montoTotal / 1.1)}</span>
                </div>
                <div className="flex justify-between border-b-2 border-black pb-2">
                  <span className="uppercase text-slate-500">IVA (10%):</span>
                  <span>${formatNumber(montoTotal - (montoTotal / 1.1))}</span>
                </div>
                <div className="flex justify-between items-center pt-3">
                  <span className="text-xl uppercase">Total Pagado:</span>
                  <span className="text-3xl text-[#E53935]">${formatNumber(montoTotal)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <button className="flex-1 bg-[#E53935] hover:bg-[#C62828] text-white border-4 border-black py-4 px-6 font-black uppercase flex items-center justify-center hover:translate-x-1 hover:translate-y-1 transition-all" style={{ boxShadow: '6px 6px 0px #000000' }} onClick={() => window.print()}>
                <Download className="mr-2 h-5 w-5" /> Descargar
              </button>
              <button className="flex-1 border-4 border-black bg-white py-4 px-6 font-black uppercase hover:translate-x-1 hover:translate-y-1 transition-all" style={{ boxShadow: '6px 6px 0px #000000' }} onClick={() => navigate('/home')}>
                Inicio
              </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#FBC02D] via-[#FB8C00] to-[#E53935] pb-10">
      <div className="bg-[#263238] border-b-4 border-black" style={{ boxShadow: '0px 4px 0px #000000' }}>
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/pedidos')} className="w-12 h-12 bg-[#FBC02D] border-4 border-black flex items-center justify-center hover:translate-y-1 transition-all" style={{ boxShadow: '4px 4px 0px #000000' }}>
              <ArrowLeft className="w-6 h-6 text-[#263238]" strokeWidth={3} />
            </button>
            <div>
              <h1 className="pixel-font text-2xl md:text-3xl text-white leading-relaxed">PAGO Y CAJA</h1>
              <p className="text-yellow-400 font-bold uppercase text-[10px]">Cajero: {user?.nombre || 'Admin'}</p>
            </div>
          </div>
          <ProtectedButton permisos={['ver_metodos_pago']}>
              <button onClick={() => navigate('/admin/metodos-pago')} className="p-3 bg-white border-4 border-black text-black hover:bg-yellow-400" style={{ boxShadow: '4px 4px 0px #000000' }}>
                <Settings className="w-5 h-5" />
              </button>
          </ProtectedButton>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="border-4 border-black bg-white overflow-hidden" style={{ boxShadow: '8px 8px 0px #000000' }}>
              <div className="bg-yellow-50 border-b-4 border-black p-4">
                <h2 className="text-[#263238] font-black uppercase italic">Selecciona Método</h2>
              </div>
              <div className="p-6 space-y-3">
                {metodos.map((m) => (
                  <div
                    key={m.id_metodo}
                    onClick={() => {
                        setMetodoSeleccionado(m.id_metodo);
                        setTipoSeleccionado(String(m.tipo).toLowerCase());
                    }}
                    className={`flex items-center space-x-4 border-4 border-black p-4 cursor-pointer transition-all hover:translate-x-1 hover:translate-y-1 ${
                      metodoSeleccionado === m.id_metodo ? 'bg-red-100' : 'bg-white'
                    }`}
                    style={{ boxShadow: metodoSeleccionado === m.id_metodo ? '4px 4px 0px #E53935' : '4px 4px 0px #000000' }}
                  >
                    <div className={`w-10 h-10 border-2 border-black flex items-center justify-center ${
                      String(m.tipo).toLowerCase().includes('efectivo') ? 'bg-[#43A047]' : 
                      String(m.tipo).toLowerCase().includes('tarjeta') ? 'bg-[#E53935]' : 'bg-[#FBC02D]'
                    }`} style={{ boxShadow: '2px 2px 0px #000000' }}>
                      {renderIcon(m.tipo)}
                    </div>
                    <span className="flex-1 font-black text-[#263238] uppercase italic">{String(m.tipo)}</span>
                    <div className={`w-6 h-6 rounded-full border-4 border-black ${metodoSeleccionado === m.id_metodo ? 'bg-[#E53935]' : 'bg-white'}`} />
                  </div>
                ))}
              </div>
            </div>

            {tipoSeleccionado.includes('tarjeta') && (
              <div className="border-4 border-black bg-white animate-in slide-in-from-top-2" style={{ boxShadow: '8px 8px 0px #000000' }}>
                <div className="bg-red-50 border-b-4 border-black p-3">
                    <p className="font-black uppercase text-sm">Info de Tarjeta</p>
                </div>
                <div className="p-6 space-y-4">
                  <input placeholder="0000 0000 0000 0000" className="w-full p-3 border-4 border-black font-bold h-12 focus:outline-none" style={{ boxShadow: '4px 4px 0px #000' }} />
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="MM/AA" className="w-full p-3 border-4 border-black font-bold h-12 focus:outline-none" style={{ boxShadow: '4px 4px 0px #000' }} />
                    <input placeholder="CVV" type="password" className="w-full p-3 border-4 border-black font-bold h-12 focus:outline-none" style={{ boxShadow: '4px 4px 0px #000' }} />
                  </div>
                </div>
              </div>
            )}

            {tipoSeleccionado.includes('transferencia') && (
              <div className="border-4 border-black bg-white" style={{ boxShadow: '8px 8px 0px #000000' }}>
                <div className="p-6 space-y-4">
                  <div className="bg-gray-100 border-4 border-black p-4 font-black text-sm" style={{ boxShadow: '4px 4px 0px #000' }}>
                    <p className="uppercase text-slate-500">BANCO: <span className="text-black">BANCO NACIONAL</span></p>
                    <p className="uppercase text-slate-500">CUENTA: <span className="text-black">1234-5678-9012</span></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="border-4 border-black bg-white sticky top-8" style={{ boxShadow: '12px 12px 0px #000000' }}>
              <div className="bg-[#263238] border-b-4 border-black p-4">
                <h2 className="text-white font-black uppercase italic">Total a Cobrar</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-3 font-bold">
                  <div className="flex justify-between uppercase text-sm">
                    <span className="text-slate-500">Subtotal:</span>
                    <span>${formatNumber(montoTotal / 1.1)}</span>
                  </div>
                  <div className="flex justify-between uppercase text-sm">
                    <span className="text-slate-500">IVA (10%):</span>
                    <span>${formatNumber(montoTotal - (montoTotal / 1.1))}</span>
                  </div>
                  <div className="h-1 bg-black w-full" />
                  <div className="flex justify-between items-center">
                    <span className="font-black text-xl uppercase italic">Total:</span>
                    <span className="font-black text-4xl text-[#E53935]">${formatNumber(montoTotal)}</span>
                  </div>
                </div>

                <button 
                  onClick={handlePayment}
                  className="w-full bg-[#E53935] hover:bg-[#C62828] text-white border-4 border-black py-6 text-xl font-black uppercase italic flex items-center justify-center hover:translate-x-1 hover:translate-y-1 transition-all"
                  style={{ boxShadow: '6px 6px 0px #000000' }}
                >
                  <CheckCircle className="mr-2 h-6 w-6" /> Confirmar
                </button>
                <p className="text-[10px] text-center font-black uppercase text-slate-400">Sistema Seguro Pixel-Food v2.0</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}