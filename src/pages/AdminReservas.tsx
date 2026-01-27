import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  CheckCircle, 
  Utensils, 
  UserCircle, 
  Clock, 
  AlertCircle,
  UserPlus,
} from 'lucide-react';

// Importaciones de lógica
import { reservasApi } from '@/api/reservas';
import axios from '@/api/axios';
import type { Reserva, Mesa, Usuario, Sucursal } from '@/types';
import { useCrud } from '@/hooks/useCrud';
import { useAuth } from '@/hooks/useAuth';

export default function AdminReservas() {
  const { createItem, loading } = useCrud<Reserva>(reservasApi);
  const { user } = useAuth(); 

  const rolNombre = (user?.rol as any)?.nombre?.toLowerCase() || user?.rol?.toLowerCase() || '';
  const isAdmin = rolNombre.includes('admin');

  const [selectedSucursal, setSelectedSucursal] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [selectedMesa, setSelectedMesa] = useState<Mesa | null>(null);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState<string>('');
  
  const [isManualRegistry, setIsManualRegistry] = useState(!isAdmin);
  const [newClientData, setNewClientData] = useState({
    nombre: '',
    apellido: '', // NUEVO CAMPO
    correo: '',
    telefono: ''
  });

  const [listaSucursales, setListaSucursales] = useState<Sucursal[]>([]);
  const [listaMesas, setListaMesas] = useState<Mesa[]>([]);
  const [listaUsuarios, setListaUsuarios] = useState<Usuario[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sucRes, mesaRes] = await Promise.all([
          axios.get('/sucursal'),
          axios.get('/mesas')
        ]);
        setListaSucursales(sucRes.data || []);
        setListaMesas(mesaRes.data || []);

        if (isAdmin) {
          try {
            const userRes = await axios.get('/usuario');
            setListaUsuarios(userRes.data || []);
          } catch (userErr) {
            console.warn("Aviso: No se pudo cargar lista de usuarios.");
          }
        }
      } catch (err) { 
        setLocalError("ERROR AL CARGAR DATOS BASE");
      }
    };
    loadData();
  }, [isAdmin]);

  const handleConfirmarReserva = async () => {
    setLocalError(null);
    
    if (!isManualRegistry && !selectedUsuarioId) {
      setLocalError("DEBES SELECCIONAR UN CLIENTE");
      return;
    }

    if (isManualRegistry && (!newClientData.nombre || !newClientData.apellido || !newClientData.correo)) {
      setLocalError("NOMBRE, APELLIDO Y CORREO OBLIGATORIOS");
      return;
    }

    if (!selectedMesa || !selectedSucursal || !fecha || !hora) {
      setLocalError("FALTAN DATOS EN EL FORMULARIO");
      return;
    }

    const payload: any = {
      id_mesa: (selectedMesa as any).id_mesa || (selectedMesa as any)._id,
      id_sucursal: selectedSucursal,
      fecha_reserva: new Date(`${fecha}T00:00:00`).toISOString(),
      hora: hora,
      numero_personas: Number(selectedMesa.capacidad),
      estado: 'CONFIRMADA'
    };

    if (isManualRegistry) {
      payload.datos_cliente = {
        nombre: newClientData.nombre.toUpperCase(),
        apellido: newClientData.apellido.toUpperCase(), // ENVIAMOS APELLIDO
        correo: newClientData.correo.toLowerCase(),
        telefono: newClientData.telefono || ""
      };
      delete payload.id_usuario; 
    } else {
      payload.id_usuario = selectedUsuarioId;
      delete payload.datos_cliente;
    }

    try {
      await createItem(payload);
      setConfirmed(true);
    } catch (e: any) {
      const backendMessage = e.response?.data?.message;
      const errorStr = Array.isArray(backendMessage) 
        ? backendMessage.join(" - ") 
        : (backendMessage || "ERROR EN LA OPERACIÓN");
      
      setLocalError(errorStr.toUpperCase());
    }
  };

  const mesasFiltradas = listaMesas.filter(m => {
    const mesaSucId = (m as any).id_sucursal?.id_sucursal || (m as any).id_sucursal?._id || (m as any).id_sucursal;
    return mesaSucId === selectedSucursal;
  });

  if (confirmed) {
    return (
      <div className="min-h-screen bg-[#263238] flex items-center justify-center p-4 text-[#263238]">
        <div className="max-w-md w-full border-4 border-black bg-white p-8 text-center shadow-[8px_8px_0px_#000]">
          <div className="w-16 h-16 bg-[#43A047] border-4 border-black mx-auto mb-4 flex items-center justify-center shadow-[4px_4px_0px_#000]">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-black uppercase mb-2">¡Reserva Exitosa!</h2>
          <p className="text-[11px] font-bold text-gray-500 uppercase mb-6">El registro se guardó correctamente.</p>
          <button
            className="w-full bg-[#263238] text-white border-4 border-black py-3 font-black uppercase shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-all"
            onClick={() => window.location.reload()}
          >
            Nueva Operación
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#263238] via-[#37474F] to-[#455A64] pb-10 font-sans text-[#263238]">
      
      <div className="bg-[#263238] border-b-4 border-black mb-8" style={{ boxShadow: '0px 4px 0px #000000' }}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#FBC02D] border-4 border-black flex items-center justify-center" style={{ boxShadow: '4px 4px 0px #000000' }}>
              <Calendar className="w-8 h-8 text-black" strokeWidth={3} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl text-white font-black uppercase leading-relaxed">
                {isAdmin ? 'Panel Reservas Admin' : 'Registro de Clientes'}
              </h1>
                <p className="text-yellow-400 font-bold uppercase text-sm tracking-widest">PIXEL-FOOD - Registro de Reservas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {localError && (
          <div className="bg-white border-4 border-black p-4 mb-6 text-[#E53935] font-black flex items-start gap-2 shadow-[4px_4px_0px_#000000]">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" /> 
            <span className="text-xs uppercase leading-tight">{localError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#000]">
              <div className="bg-blue-50 border-b-4 border-black p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isManualRegistry ? <UserPlus className="w-5 h-5" /> : <UserCircle className="w-5 h-5" />}
                  <h2 className="font-black uppercase text-sm italic">1. Cliente</h2>
                </div>
                {isAdmin && (
                  <button 
                    onClick={() => setIsManualRegistry(!isManualRegistry)}
                    className="bg-black text-white text-[8px] px-2 py-1 font-black uppercase"
                  >
                    {isManualRegistry ? 'Cambiar a Lista' : 'Cambiar a Manual'}
                  </button>
                )}
              </div>
              
              <div className="p-5">
                {isManualRegistry ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input 
                        type="text" placeholder="NOMBRE"
                        className="w-full p-3 border-4 border-black font-black uppercase text-xs focus:bg-yellow-50 outline-none"
                        value={newClientData.nombre}
                        onChange={(e) => setNewClientData({...newClientData, nombre: e.target.value})}
                      />
                      <input 
                        type="text" placeholder="APELLIDO"
                        className="w-full p-3 border-4 border-black font-black uppercase text-xs focus:bg-yellow-50 outline-none"
                        value={newClientData.apellido}
                        onChange={(e) => setNewClientData({...newClientData, apellido: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input 
                        type="email" placeholder="CORREO@MAIL.COM"
                        className="w-full p-3 border-4 border-black font-black uppercase text-xs focus:bg-yellow-50 outline-none"
                        value={newClientData.correo}
                        onChange={(e) => setNewClientData({...newClientData, correo: e.target.value})}
                      />
                      <input 
                        type="text" placeholder="TELÉFONO"
                        className="w-full p-3 border-4 border-black font-black uppercase text-xs focus:bg-yellow-50 outline-none"
                        value={newClientData.telefono}
                        onChange={(e) => setNewClientData({...newClientData, telefono: e.target.value})}
                      />
                    </div>
                  </div>
                ) : (
                  <select 
                    value={selectedUsuarioId} 
                    onChange={(e) => setSelectedUsuarioId(e.target.value)}
                    className="w-full p-3 border-4 border-black font-black uppercase text-xs focus:bg-yellow-50 outline-none"
                  >
                    <option value="">-- SELECCIONAR CLIENTE --</option>
                    {listaUsuarios.map(u => (
                      <option key={u._id || (u as any).id_usuario} value={u._id || (u as any).id_usuario}>
                        {u.nombre} ({u.correo})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#000]">
              <div className="bg-orange-50 border-b-4 border-black p-4 flex items-center gap-3">
                <MapPin className="w-5 h-5" />
                <h2 className="font-black uppercase text-sm italic">2. Sucursal</h2>
              </div>
              <div className="p-5 grid grid-cols-1 gap-2">
                {listaSucursales.map((suc) => {
                  const id = (suc as any).id_sucursal || (suc as any)._id;
                  const isSelected = selectedSucursal === id;
                  return (
                    <button
                      key={id}
                      onClick={() => { setSelectedSucursal(id); setSelectedMesa(null); }}
                      className={`text-left p-3 border-2 border-black font-bold uppercase text-[10px] flex justify-between items-center transition-all ${
                        isSelected ? 'bg-[#FB8C00] text-white shadow-[3px_3px_0px_#000]' : 'bg-gray-50 hover:bg-white'
                      }`}
                    >
                      {suc.nombre}
                      {isSelected && <CheckCircle className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#000]">
              <div className="bg-yellow-50 border-b-4 border-black p-4 flex items-center gap-3">
                <Clock className="w-5 h-5" />
                <h2 className="font-black uppercase text-sm italic">3. Fecha y Hora</h2>
              </div>
              <div className="p-5 grid grid-cols-2 gap-4">
                <input 
                  type="date" value={fecha} 
                  onChange={(e) => setFecha(e.target.value)} 
                  className="w-full p-2 border-2 border-black font-black text-xs outline-none" 
                />
                <select 
                  value={hora} onChange={(e) => setHora(e.target.value)} 
                  className="w-full p-2 border-2 border-black font-black text-xs outline-none"
                >
                  <option value="">HH:MM</option>
                  {['12:00', '13:00', '14:00', '15:00', '19:00', '20:00', '21:00', '22:00'].map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] h-full flex flex-col">
              <div className="bg-green-50 border-b-4 border-black p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Utensils className="w-5 h-5" />
                  <h2 className="font-black uppercase text-sm italic">4. Mapa de Mesas</h2>
                </div>
              </div>
              
              <div className="p-6 grow bg-[#f8f9fa]">
                {!selectedSucursal ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 border-4 border-dashed border-gray-200 p-10 text-center uppercase text-xs font-black">
                    Seleccione Sucursal
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {mesasFiltradas.map((mesa) => {
                      const mId = (mesa as any).id_mesa || (mesa as any)._id;
                      const estado = String((mesa as any).estado || 'LIBRE').toUpperCase();
                      const isSelected = selectedMesa && ((selectedMesa as any).id_mesa === mId || (selectedMesa as any)._id === mId);
                      const isOcupada = estado !== 'LIBRE';

                      return (
                        <button
                          key={mId} disabled={isOcupada}
                          onClick={() => setSelectedMesa(mesa)}
                          className={`p-4 border-4 border-black transition-all flex flex-col items-center shadow-[4px_4px_0px_#000] ${
                            isSelected ? 'bg-[#43A047] text-white -translate-y-1' : isOcupada ? 'bg-gray-200 opacity-50' : 'bg-white hover:bg-yellow-50'
                          }`}
                        >
                          <span className="font-black text-lg">#{mesa.numero}</span>
                          <span className="text-[8px] font-bold uppercase">{mesa.capacidad} PERS.</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="p-6 border-t-4 border-black bg-gray-50">
                <button
                  onClick={handleConfirmarReserva}
                  disabled={loading || !selectedMesa}
                  className="w-full bg-[#E53935] text-white border-4 border-black py-4 font-black uppercase shadow-[6px_6px_0px_#000] hover:bg-[#d32f2f] active:translate-y-1 disabled:bg-gray-400 transition-all flex items-center justify-center gap-3"
                >
                  {loading ? 'PROCESANDO...' : 'Finalizar Registro'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 