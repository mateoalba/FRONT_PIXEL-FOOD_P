import { ShoppingBag, Users, TrendingUp, Clock, DollarSign } from "lucide-react";

const ResumenDashboard = () => {
  const metrizas = [
    { 
      title: "Ventas Hoy", 
      value: "$1,245", 
      growth: "+12.5% vs ayer", 
      color: "bg-[#E53935]", 
      icon: <DollarSign className="w-6 h-6 text-white" strokeWidth={3} /> 
    },
    { 
      title: "Pedidos Activos", 
      value: "8", 
      growth: "4 en preparación", 
      color: "bg-[#FBC02D]", 
      icon: <ShoppingBag className="w-6 h-6 text-[#263238]" strokeWidth={3} /> 
    },
    { 
      title: "Mesas Ocupadas", 
      value: "4/8", 
      growth: "50% ocupación", 
      color: "bg-[#43A047]", 
      icon: <Users className="w-6 h-6 text-white" strokeWidth={3} /> 
    },
    { 
      title: "Promedio Pedido", 
      value: "$26.50", 
      growth: "+8.2% vs ayer", 
      color: "bg-[#FB8C00]", 
      icon: <TrendingUp className="w-6 h-6 text-white" strokeWidth={3} /> 
    },
  ];

  const pedidosRecientes = [
    { id: "#001", mesa: "Mesa 3", items: "Hamburguesa Clásica x2, Papas Fritas", estado: "Preparando", badgeColor: "bg-[#FBC02D] text-[#263238]", total: "$25.98", tiempo: "5 min" },
    { id: "#002", mesa: "Mesa 7", items: "Combo Familiar, Milkshake x2", estado: "Listo", badgeColor: "bg-[#43A047] text-white", total: "$49.97", tiempo: "15 min" },
    { id: "#003", mesa: "Mesa 1", items: "Pizza Slice x3, Refresco", estado: "Preparando", badgeColor: "bg-[#FBC02D] text-[#263238]", total: "$18.47", tiempo: "3 min" },
  ];

  return (
    <div className="space-y-8 p-1">
      {/* 1. Fila de Tarjetas de Métricas (Stats Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrizas.map((item, idx) => (
          <div 
            key={idx} 
            className="bg-white p-6 border-4 border-black hover:translate-x-1 hover:translate-y-1 transition-transform"
            style={{ boxShadow: '6px 6px 0px #000000' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase text-gray-500 mb-1 tracking-widest">{item.title}</p>
                <h3 className="text-3xl font-black text-[#263238] italic">{item.value}</h3>
                <p className={`text-[10px] font-bold mt-2 flex items-center gap-1 uppercase ${idx === 1 ? 'text-gray-400' : 'text-[#43A047]'}`}>
                  {idx !== 1 && <TrendingUp className="w-3 h-3" strokeWidth={3} />}
                  {item.growth}
                </p>
              </div>
              <div 
                className={`${item.color} w-12 h-12 border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_#000000]`}
              >
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Sección de Pedidos en Tiempo Real */}
      <div 
        className="bg-white border-4 border-black overflow-hidden"
        style={{ boxShadow: '8px 8px 0px #000000' }}
      >
        {/* Header de la sección */}
        <div className="bg-linear-to-r from-red-50 to-orange-50 p-6 border-b-4 border-black flex items-center gap-3">
          <div className="w-10 h-10 bg-[#E53935] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000000]">
            <Clock className="text-white w-6 h-6" strokeWidth={3} />
          </div>
          <h2 className="text-xl font-black text-[#263238] uppercase italic tracking-tighter">
            Pedidos en Tiempo Real
          </h2>
        </div>

        {/* Lista de pedidos */}
        <div className="p-6 space-y-4 bg-white">
          {pedidosRecientes.map((pedido) => (
            <div 
              key={pedido.id} 
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50 border-4 border-black hover:bg-white transition-colors group shadow-[4px_4px_0px_#000000]"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="font-black text-lg text-[#263238]">{pedido.id}</span>
                  
                  <span className="bg-[#263238] text-white text-[10px] px-3 py-1 border-2 border-black font-black uppercase tracking-tighter shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                    {pedido.mesa}
                  </span>
                  
                  <span className={`${pedido.badgeColor} text-[10px] px-3 py-1 border-2 border-black font-black uppercase tracking-tighter shadow-[2px_2px_0px_rgba(0,0,0,0.2)]`}>
                    {pedido.estado}
                  </span>
                </div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-tight italic group-hover:text-black transition-colors">
                  {pedido.items}
                </p>
              </div>

              <div className="text-left md:text-right border-t-2 md:border-t-0 md:border-l-2 border-black/5 pt-4 md:pt-0 md:pl-6">
                <p className="text-2xl font-black text-[#E53935] italic leading-none">{pedido.total}</p>
                <p className="text-[10px] font-black text-gray-400 uppercase mt-1 tracking-widest">{pedido.tiempo} transcurrido</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer opcional / Ver todos */}
        <div className="p-4 bg-gray-50 border-t-4 border-black text-center">
          <button className="text-[10px] font-black uppercase tracking-[0.3em] hover:text-[#E53935] transition-colors">
            --- Ver historial completo de hoy ---
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumenDashboard;