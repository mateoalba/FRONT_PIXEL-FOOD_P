import { useState, useEffect } from 'react';
import { MapPin, Users, Calendar, CheckCircle, Utensils, Star, UserCircle } from 'lucide-react';

// Importaciones de lógica
import { reservasApi } from '@/api/reservas';
import axios from '@/api/axios';
import type { Reserva, Mesa, Usuario, Sucursal } from '@/types';
import { useCrud } from '@/hooks/useCrud';
import { useAuth } from '@/hooks/useAuth';

export default function Reservas() {
  const { createItem, loading } = useCrud<Reserva>(reservasApi);
  const { user } = useAuth();

  const [selectedSucursal, setSelectedSucursal] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [selectedMesa, setSelectedMesa] = useState<Mesa | null>(null);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState<string>('');
  
  const [listaSucursales, setListaSucursales] = useState<Sucursal[]>([]);
  const [listaMesas, setListaMesas] = useState<Mesa[]>([]);
  const [listaUsuarios, setListaUsuarios] = useState<Usuario[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const isAdmin = (user?.rol as any)?.nombre === 'Administrador' || user?.rol === 'Administrador';

  useEffect(() => {
    const loadData = async () => {
      try {
        const promises: Promise<any>[] = [
          axios.get('/sucursal'),
          axios.get('/mesas')
        ];
        if (isAdmin) promises.push(axios.get('/usuario'));

        const results = await Promise.allSettled(promises);
        if (results[0].status === 'fulfilled') setListaSucursales(results[0].value.data || []);
        if (results[1].status === 'fulfilled') setListaMesas(results[1].value.data || []);
        if (isAdmin && results[2] && results[2].status === 'fulfilled') {
          setListaUsuarios(results[2].value.data || []);
        }
      } catch (err) { 
        console.error("Error al cargar datos:", err); 
      }
    };
    loadData();
  }, [isAdmin]);

  const handleConfirmarReserva = async () => {
    setLocalError(null);
    const currentUserId = (user as any)?.id_usuario || (user as any)?._id;
    const finalUserId = isAdmin ? selectedUsuarioId : currentUserId;

    if (!finalUserId) {
      setLocalError(isAdmin ? "DEBES SELECCIONAR UN CLIENTE" : "SESIÓN NO ENCONTRADA.");
      return;
    }

    if (!selectedMesa || !selectedSucursal || !fecha || !hora) {
      setLocalError("TODOS LOS CAMPOS SON OBLIGATORIOS");
      return;
    }

    const payload = {
      id_usuario: finalUserId,
      id_mesa: (selectedMesa as any).id_mesa || (selectedMesa as any)._id,
      id_sucursal: selectedSucursal,
      fecha_reserva: fecha,
      hora: hora,
      numero_personas: Number(selectedMesa.capacidad),
      estado: 'CONFIRMADA'
    };

    try {
      await createItem(payload as any);
      setConfirmed(true);
    } catch (e: any) {
      const msg = e.response?.data?.message;
      setLocalError(Array.isArray(msg) ? msg[0].toUpperCase() : (msg || "ERROR AL RESERVAR").toUpperCase());
    }
  };

  const mesasFiltradas = listaMesas.filter(m => {
    const mesaSucId = (m as any).id_sucursal?.id_sucursal || (m as any).id_sucursal?._id || (m as any).id_sucursal;
    return mesaSucId === selectedSucursal;
  });

  const sucursalSeleccionada = listaSucursales.find(s => 
    (s as any).id_sucursal === selectedSucursal || (s as any)._id === selectedSucursal
  );

  if (confirmed) {
    return (
      <div className="min-h-screen bg-[#43A047] flex items-center justify-center p-4">
        <div className="max-w-md w-full border-[6px] border-black bg-white p-8 text-center shadow-[15px_15px_0px_rgba(0,0,0,1)]">
          <div className="w-20 h-20 bg-[#FBC02D] border-4 border-black mx-auto mb-6 flex items-center justify-center shadow-[6px_6px_0px_#000] animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" strokeWidth={4} />
          </div>
          <h2 className="text-4xl font-black text-[#263238] mb-2 uppercase italic">¡Confirmada!</h2>
          <p className="text-gray-500 font-bold mb-8 uppercase text-xs">Tu mesa ha sido reservada exitosamente</p>
          <div className="bg-[#FFF9E6] border-4 border-black p-5 mb-8 text-left space-y-4 shadow-[4px_4px_0px_#000]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#E53935] border-2 border-black flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[9px] text-gray-400 font-black uppercase mb-1">Sucursal</p>
                <p className="font-black text-[#263238] uppercase text-sm italic">{sucursalSeleccionada?.nombre || 'Sucursal'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 border-t-4 border-black border-dotted pt-4">
              <div className="w-10 h-10 bg-[#FBC02D] border-2 border-black flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[9px] text-gray-400 font-black uppercase mb-1">Fecha y Hora</p>
                <p className="font-black text-[#263238] text-sm italic">{fecha} - {hora}</p>
              </div>
            </div>
          </div>
          <button onClick={() => window.location.reload()} className="w-full bg-[#E53935] text-white border-4 border-black py-4 font-black uppercase shadow-[6px_6px_0px_#000] active:translate-y-1 active:shadow-none transition-all">
            VOLVER AL INICIO
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#FBC02D] via-[#FB8C00] to-[#E53935] pb-10">
      <div className="bg-[#263238] border-b-4 border-black shadow-[0px_4px_0px_#000]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#E53935] border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_#000]">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl text-white uppercase font-black italic">RESERVAR MESA</h1>
              <p className="text-yellow-400 font-bold uppercase text-xs mt-1">Elige tu sucursal y mesa favorita</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            {/* SECCIÓN ADMIN: SELECCIÓN DE CLIENTE */}
            {isAdmin && (
              <div className="border-4 border-black bg-white shadow-[8px_8px_0px_#000]">
                <div className="bg-linear-to-r from-blue-50 to-indigo-50 border-b-4 border-black p-4">
                  <h2 className="flex items-center gap-3 text-[#263238] font-black uppercase text-sm">
                    <div className="w-8 h-8 bg-[#1976D2] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] shrink-0">
                      <UserCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="italic text-lg">Seleccionar Cliente (Admin)</span>
                  </h2>
                </div>
                <div className="p-6">
                  <select
                    value={selectedUsuarioId}
                    onChange={(e) => setSelectedUsuarioId(e.target.value)}
                    className="w-full p-3 border-4 border-black font-black shadow-[4px_4px_0px_#000] outline-none appearance-none bg-white"
                  >
                    <option value="">SELECCIONAR CLIENTE</option>
                    {listaUsuarios.map((u) => (
                      <option key={(u as any)._id || (u as any).id_usuario} value={(u as any)._id || (u as any).id_usuario}>
                        {u.nombre} {u.apellido} ({u.correo})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* 1. SELECCIONA SUCURSAL */}
            <div className="border-4 border-black bg-white shadow-[8px_8px_0px_#000]">
              <div className="bg-linear-to-r from-red-50 to-orange-50 border-b-4 border-black p-4">
                <h2 className="flex items-center gap-3 text-[#263238] font-black uppercase text-sm">
                  <div className="w-8 h-8 bg-[#E53935] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] shrink-0">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <span className="italic text-lg">Selecciona Sucursal</span>
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {listaSucursales.map((branch) => {
                    const branchId = (branch as any).id_sucursal || (branch as any)._id;
                    const isSelected = selectedSucursal === branchId;
                    return (
                      <div
                        key={branchId}
                        className={`cursor-pointer border-4 border-black p-4 transition-all hover:translate-x-1 hover:translate-y-1 ${
                          isSelected ? 'bg-orange-100 shadow-[6px_6px_0px_#E53935]' : 'bg-white shadow-[4px_4px_0px_#000]'
                        }`}
                        onClick={() => { setSelectedSucursal(branchId); setSelectedMesa(null); }}
                      >
                        <h3 className="font-black text-sm uppercase italic text-[#263238] mb-1">{branch.nombre}</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">{branch.direccion}</p>
                        <div className="flex items-center gap-1 mt-2">
                            <Star className="w-3 h-3 text-[#FBC02D] fill-[#FBC02D]" />
                            <span className="text-[10px] font-black">4.8</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. FECHA Y HORA */}
            <div className="border-4 border-black bg-white shadow-[8px_8px_0px_#000]">
              <div className="bg-linear-to-r from-yellow-50 to-orange-50 border-b-4 border-black p-4">
                <h2 className="flex items-center gap-3 text-[#263238] font-black uppercase text-sm">
                  <div className="w-8 h-8 bg-[#FBC02D] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] shrink-0">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <span className="italic text-lg">Fecha y Hora</span>
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-black uppercase mb-2 block italic text-[#263238]">Fecha de Reserva</label>
                  <input 
                    type="date" 
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full p-3 border-4 border-black font-black shadow-[4px_4px_0px_#000] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase mb-2 block italic text-[#263238]">Hora</label>
                  <input 
                    type="time" 
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    className="w-full p-3 border-4 border-black font-black shadow-[4px_4px_0px_#000] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. ELIGE TU MESA (COLUMNA DERECHA) */}
          <div className="border-4 border-black bg-white shadow-[8px_8px_0px_#000]">
            <div className="bg-linear-to-r from-green-50 to-blue-50 border-b-4 border-black p-4">
              <h2 className="flex items-center gap-3 text-[#263238] font-black uppercase text-sm">
                <div className="w-8 h-8 bg-[#43A047] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] shrink-0">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="italic text-lg">Elige tu Mesa</span>
              </h2>
            </div>
            <div className="p-6">
              {!selectedSucursal ? (
                <div className="text-center py-10 border-4 border-dashed border-gray-300 font-black uppercase text-gray-400 italic">
                  Primero selecciona una sucursal
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {mesasFiltradas.map((mesa) => {
                      const isSelected = selectedMesa === mesa;
                      const estaReservada = mesa.estado === 'Reservada';
                      const estaOcupada = mesa.estado === 'Ocupada';
                      const noDisponible = estaReservada || estaOcupada;

                      return (
                        <button
                          key={(mesa as any)._id || (mesa as any).id_mesa}
                          disabled={noDisponible}
                          onClick={() => setSelectedMesa(mesa)}
                          className={`p-4 border-4 border-black font-black transition-all relative shadow-[4px_4px_0px_#000] 
                            ${estaOcupada 
                              ? 'bg-[#E53935] text-white cursor-not-allowed' 
                              : estaReservada 
                                ? 'bg-[#FB8C00] text-white cursor-not-allowed'
                                : isSelected 
                                  ? 'bg-[#FBC02D] text-black scale-105 shadow-[4px_4px_0px_#000]' 
                                  : 'bg-[#43A047] text-white hover:bg-[#388E3C] active:shadow-none active:translate-y-1'
                            }`}
                        >
                          <div className="text-2xl italic">#{mesa.numero}</div>
                          <div className="text-[10px] uppercase">
                            {estaOcupada ? 'OCUPADA' : estaReservada ? 'RESERVADA' : `${mesa.capacidad} PERS`}
                          </div>
                          <div className="text-[10px] uppercase font-black mt-1">
                            {estaOcupada || estaReservada ? 'NO DISPONIBLE' : 'DISPONIBLE'}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* LEYENDA */}
                  <div className="mb-6 p-4 border-4 border-black bg-gray-50 space-y-2">
                    <p className="text-[10px] font-black uppercase mb-2">Leyenda:</p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#43A047] border-2 border-black"></div>
                        <span className="text-[10px] font-bold uppercase">Disponible</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#FB8C00] border-2 border-black"></div>
                        <span className="text-[10px] font-bold uppercase">Reservada</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#E53935] border-2 border-black"></div>
                        <span className="text-[10px] font-bold uppercase">Ocupada</span>
                      </div>
                    </div>
                  </div>

                  {localError && (
                    <div className="mb-4 p-3 bg-red-100 border-4 border-red-600 text-red-600 font-black uppercase text-xs italic">
                      Error: {localError}
                    </div>
                  )}

                  <button
                    onClick={handleConfirmarReserva}
                    disabled={loading}
                    className="w-full bg-[#E53935] hover:bg-[#C62828] text-white border-4 border-black py-6 font-black uppercase italic shadow-[6px_6px_0px_#000] active:shadow-none active:translate-y-1 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Procesando...' : '✓ Confirmar Reserva'}
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}