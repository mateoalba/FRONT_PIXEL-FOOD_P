import { useState } from 'react';
import { facturasApi } from '@/api/facturas';
import type { Factura, CreateFacturaDto } from '@/types';
import { useCrud } from '@/hooks/useCrud';
import { useAuth } from '@/hooks/useAuth';

// Iconos
import { 
  DollarSign, 
  X, 
  Receipt, 
  Calendar, 
  AlertCircle,
  FileText
} from 'lucide-react';

export default function Facturas() {
  const { data = [], loading, error } = useCrud<Factura, CreateFacturaDto>(facturasApi);
  const { user } = useAuth();
  const [selectedInvoice, setSelectedInvoice] = useState<Factura | null>(null);

  // Cálculo del total recaudado
  const totalCaja = data?.reduce((acc, curr) => acc + Number(curr.total || 0), 0) || 0;

  // Función para obtener colores por método de pago (Estilo Recetas)
  const getMethodStyle = (method: string) => {
    const type = method?.toLowerCase() || '';
    if (type.includes('efectivo')) return 'bg-[#43A047] text-white'; // Verde
    if (type.includes('tarjeta')) return 'bg-[#1E88E5] text-white';  // Azul
    if (type.includes('transferencia')) return 'bg-[#8E24AA] text-white'; // Púrpura
    return 'bg-white text-black'; 
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#263238] via-[#37474F] to-[#455A64] pb-10 font-sans">
      
      {/* HEADER ESTILO FIGMA (IGUAL A RECETAS) */}
      <div className="bg-[#263238] border-b-4 border-black mb-8" style={{ boxShadow: '0px 4px 0px #000000' }}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#E53935] border-4 border-black flex items-center justify-center" style={{ boxShadow: '4px 4px 0px #000000' }}>
                <DollarSign className="w-8 h-8 text-white" strokeWidth={3} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl text-white font-black uppercase leading-relaxed">
                  {user?.rol.toLowerCase() === 'cliente' ? 'Mis Consumos' : 'Panel de Facturación'}
                </h1>
                <p className="text-yellow-400 font-bold uppercase text-sm tracking-widest">PIXEL-FOOD - Control de Ventas</p>
              </div>
            </div>

            {/* CARD RECAUDADO ROJO INTEGRADO AL HEADER */}
            {user?.rol.toLowerCase() !== 'cliente' && (
              <div className="bg-[#E53935] border-4 border-black px-6 py-3 flex items-center gap-4 shadow-[4px_4px_0px_#000000]">
                <div className="h-10 w-10 bg-white border-2 border-black flex items-center justify-center text-[#E53935] text-xl font-black">
                  $
                </div>
                <div>
                  <p className="text-[10px] font-black text-white uppercase leading-none mb-1">Total Recaudado</p>
                  <p className="text-2xl font-black text-white leading-none">
                    ${totalCaja.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {error && (
          <div className="bg-white border-4 border-black p-4 mb-6 text-[#E53935] font-black flex items-center gap-2 shadow-[4px_4px_0px_#000000]">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}

        {/* CONTENEDOR DE LISTADO (IGUAL A RECETAS) */}
        <div className="bg-white border-4 border-black" style={{ boxShadow: '8px 8px 0px #000000' }}>
          <div className="bg-linear-to-r from-gray-100 to-gray-200 border-b-4 border-black p-6">
            <h2 className="text-[#263238] font-black uppercase text-xl">Registro Histórico de Facturas</h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#E53935]"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-4 border-black bg-gray-50">
                      <th className="p-4 font-black uppercase text-sm border-r-2 border-black/10">Fecha Emisión</th>
                      <th className="p-4 font-black uppercase text-sm border-r-2 border-black/10">ID Transacción</th>
                      <th className="p-4 font-black uppercase text-sm border-r-2 border-black/10">Método de Pago</th>
                      <th className="p-4 font-black uppercase text-sm text-right border-r-2 border-black/10">Monto Total</th>
                      <th className="p-4 font-black uppercase text-sm text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-gray-200">
                    {data.map((factura) => (
                      <tr key={factura.id_factura} className="hover:bg-yellow-50 transition-colors">
                        <td className="p-4 font-bold text-[#263238] flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(factura.fecha_emision).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <span className="bg-gray-100 px-2 py-1 border-2 border-black font-black text-[10px] text-black">
                            #{factura.id_factura?.slice(0, 8).toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-block px-3 py-1 border-2 border-black font-black uppercase text-[10px] shadow-[2px_2px_0px_#000000] ${getMethodStyle((factura.metodo_pago as any)?.tipo)}`}>
                            {(factura.metodo_pago as any)?.tipo || 'N/A'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="font-black text-xl text-[#263238]">
                            ${Number(factura.total).toFixed(2)}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => setSelectedInvoice(factura)}
                            className="bg-white hover:bg-yellow-400 text-black border-2 border-black px-4 py-2 font-black text-[10px] uppercase shadow-[3px_3px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 mx-auto"
                          >
                            <FileText className="w-3 h-3" strokeWidth={3} />
                            Ver Ticket
                          </button>
                        </td>
                      </tr>
                    ))}
                    {data.length === 0 && !loading && (
                      <tr>
                        <td colSpan={5} className="text-center py-10 text-gray-400 font-bold uppercase italic">
                          ⚠️ No se encontraron registros de facturación
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL TICKET (ESTILO RECETAS/MODALES) */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="max-w-md w-full border-4 border-black bg-white shadow-[12px_12px_0px_#000000] overflow-hidden animate-in zoom-in-95">
            {/* Header del Modal */}
            <div className="bg-[#263238] border-b-4 border-black flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Receipt className="w-6 h-6 text-yellow-400" />
                <h2 className="text-white font-black uppercase text-sm">Recibo de Venta</h2>
              </div>
              <button 
                onClick={() => setSelectedInvoice(null)} 
                className="text-white hover:bg-[#E53935] border-2 border-transparent hover:border-black p-1 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-4xl font-black text-[#E53935] leading-none mb-1 italic">PIXEL FOOD</h3>
                <p className="font-black text-[10px] uppercase text-gray-400 tracking-[0.3em]">Control de Salida</p>
              </div>

              <div className="flex justify-between text-[11px] font-black border-y-4 border-dotted border-black py-5 mb-8 uppercase text-gray-500">
                <span>Trans: {selectedInvoice.id_factura?.toUpperCase()}</span>
                <span>{new Date(selectedInvoice.fecha_emision).toLocaleDateString()}</span>
              </div>

              <div className="flex justify-between items-center mb-10">
                <span className="font-black uppercase text-xs text-gray-400">Total Pagado</span>
                <span className="font-black text-5xl text-[#263238] tracking-tighter">
                  ${Number(selectedInvoice.total).toFixed(2)}
                </span>
              </div>

              <div className="bg-gray-50 border-4 border-black p-4 mb-8 shadow-[4px_4px_0px_#000000] flex justify-between items-center">
                <span className="font-black text-[10px] uppercase text-gray-500">Método:</span>
                <span className={`px-3 py-1 border-2 border-black font-black text-xs uppercase ${getMethodStyle((selectedInvoice.metodo_pago as any)?.tipo)}`}>
                  {(selectedInvoice.metodo_pago as any)?.tipo}
                </span>
              </div>

              <button 
                onClick={() => setSelectedInvoice(null)}
                className="w-full bg-[#E53935] hover:bg-black text-white border-4 border-black py-4 font-black uppercase shadow-[6px_6px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                Cerrar Registro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}