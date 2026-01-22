import { facturasApi } from '@/api/facturas';
// ✅ Importación de tipos cumpliendo con verbatimModuleSyntax
import type { Factura, CreateFacturaDto } from '@/types';
import { useCrud } from '@/hooks/useCrud';
import { useAuth } from '@/hooks/useAuth';

// Componentes de UI
import { DataTable } from '@/components/table/DataTable';

export default function Facturas() {
  // ✅ Mantenemos la estructura de useCrud con data inicializada como array vacío
  const { data = [], loading, error } = useCrud<Factura, CreateFacturaDto>(facturasApi);
  const { user } = useAuth();

  const columns = [
    { 
      key: 'fecha_emision', 
      label: 'Fecha', 
      render: (row: Factura) => {
        const fecha = new Date(row.fecha_emision);
        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-700">
              {fecha.toLocaleDateString('es-ES', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              })}
            </span>
            <span className="text-[10px] text-gray-400 font-mono">
              {fecha.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        );
      }
    },
    { 
      key: 'id_factura', 
      label: 'N° Factura',
      render: (row: Factura) => (
        <code className="bg-blue-50 px-2 py-1 rounded text-[11px] font-mono text-blue-700 border border-blue-100">
          {row.id_factura?.slice(0, 8).toUpperCase() || 'S/N'}
        </code>
      )
    },
    { 
      key: 'metodo_pago', 
      label: 'Método', 
      render: (row: Factura) => {
        // ✅ Acceso seguro a los datos de MongoDB inyectados
        const metodoData = row.metodo_pago as any;
        const tipo: string = metodoData?.tipo || 'N/A';
        
        const colors: Record<string, string> = {
          'Efectivo': 'bg-green-100 text-green-700 border-green-200',
          'Tarjeta': 'bg-blue-100 text-blue-700 border-blue-200',
          'Transferencia': 'bg-purple-100 text-purple-700 border-purple-200',
          'N/A': 'bg-gray-100 text-gray-400 border-gray-200'
        };

        return (
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${colors[tipo] || colors['N/A']}`}>
            {tipo.toUpperCase()}
          </span>
        );
      }
    },
    { 
      key: 'total', 
      label: 'Total', 
      render: (row: Factura) => (
        <div className="flex flex-col items-end pr-4">
          <span className="font-black text-gray-900 text-base">
            ${Number(row.total || 0).toFixed(2)}
          </span>
        </div>
      )
    }
  ];

  // ✅ Cálculo del total recaudado hoy
  const totalCaja = data?.reduce((acc, curr) => acc + Number(curr.total || 0), 0) || 0;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight italic uppercase">
            {user?.rol.toLowerCase() === 'cliente' ? 'Mis Consumos' : 'Panel de Facturación'}
          </h1>
          <p className="text-sm text-gray-500">
            {user?.rol.toLowerCase() === 'cliente' 
              ? 'Listado histórico de tus pagos realizados.' 
              : 'Historial de ventas (Sincronización PostgreSQL + MongoDB).'}
          </p>
        </div>

        {/* Resumen de Caja - No visible para clientes */}
        {user?.rol.toLowerCase() !== 'cliente' && !loading && (
          <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 animate-in fade-in slide-in-from-right-4">
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold shadow-sm">
              $
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Recaudado Hoy</p>
              <p className="text-2xl font-black text-gray-800 leading-none">
                {totalCaja.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700 flex items-center gap-3 rounded-r-xl">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-bold text-sm uppercase">Error de sincronización</p>
            <p className="text-xs opacity-80">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden transition-all duration-300">
        <DataTable<Factura>
          columns={columns}
          data={data}
          loading={loading}
        />
        
        {!loading && data.length === 0 && (
          <div className="py-32 text-center">
            <div className="text-6xl mb-4 opacity-10 select-none">📄</div>
            <p className="text-gray-400 font-medium italic tracking-tight">No hay transacciones registradas en este periodo</p>
          </div>
        )}
      </div>
    </div>
  );
}