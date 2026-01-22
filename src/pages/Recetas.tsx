import { platosApi } from '@/api/platos';
import { recetasApi } from '@/api/recetas';
import type { Receta } from '@/types/receta';
import type { Plato } from '@/types/plato';
import { useCrud } from '@/hooks/useCrud';
import { DataTable } from '@/components/table/DataTable';
import { RecetasModal } from '@/components/modal/RecetasModal';
import { ConfirmModal } from '@/components/modal/ConfirmModal';
import { useState, useEffect, useMemo } from 'react';
import ProtectedButton from '@/components/ProtectedButton'; // 👈 Importamos el protector
import { useAuth } from '@/hooks/useAuth'; // 👈 Ocupamos tu hook de auth para cambiar el texto

export default function Recetas() {
  const { data: recetas, loading, refresh, deleteItem } = useCrud<Receta>(recetasApi);
  const { user } = useAuth(); // 👈 Obtenemos el usuario actual
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPlato, setSelectedPlato] = useState<Plato | null>(null);

  useEffect(() => {
    platosApi.getAll().then(setPlatos);
  }, []);

  const tableData = useMemo(() => {
    return platos.map(plato => {
      const misIngredientes = recetas.filter(r => 
        r.plato?.id_plato === plato.id_plato
      );
      
      return {
        ...plato,
        resumen: misIngredientes.map(i => ({
          id_receta: i.id_receta,
          nombre: i.ingrediente?.nombre || 'Insumo',
          cantidad: i.cantidad,
          unidad: i.ingrediente?.unidad_medida || ''
        }))
      };
    }).sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [platos, recetas]);

  const handleDeleteAll = async () => {
    if (!selectedPlato) return;
    const itemsToDelete = recetas.filter(r => 
      r.plato?.id_plato === selectedPlato.id_plato
    );
    
    for (const item of itemsToDelete) {
      await deleteItem(item.id_receta);
    }
    setConfirmOpen(false);
    refresh();
  };

  // Verificamos si es administrador para la lógica del texto
  const esAdmin = user?.rol === 'admin';

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Maestro de Recetas</h1>
          <p className="text-sm text-gray-500">Configura los ingredientes de cada plato de tu menú</p>
        </div>
        
        {/* 1. PROTECCIÓN DEL BOTÓN PRINCIPAL */}
        <ProtectedButton permisos={['crear_recetas']}>
          <button 
            onClick={() => { setSelectedPlato(null); setModalOpen(true); }}
            className="bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700 transition-all shadow-md font-bold text-sm"
          >
            + Nueva Receta
          </button>
        </ProtectedButton>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable
          loading={loading}
          data={tableData}
          columns={[
            { 
              key: 'nombre', 
              label: 'Plato del Menú',
              render: (p) => (
                <span className="font-bold text-blue-700 uppercase text-xs">{p.nombre}</span>
              )
            },
            { 
              key: 'resumen', 
              label: 'Ingredientes Configurados', 
              render: (p) => (
                <div className="flex flex-wrap gap-2">
                  {p.resumen.map((ing: any) => (
                    <span key={ing.id_receta} className="bg-slate-50 text-slate-600 px-2 py-1 rounded border text-[11px] font-medium">
                      <span className="text-orange-500 mr-1">●</span>
                      {ing.nombre}: <span className="text-blue-600 font-bold">{ing.cantidad} {ing.unidad}</span>
                    </span>
                  ))}
                  {p.resumen.length === 0 && (
                    <span className="text-gray-400 italic text-[11px]">Sin ingredientes</span>
                  )}
                </div>
              )
            }
          ]}
          renderActions={(p) => (
            <div className="flex gap-3">
              {/* 2. EL BOTÓN DE EDITAR SIEMPRE SE VE, PERO CAMBIA EL TEXTO */}
              <button 
                onClick={() => { setSelectedPlato(p); setModalOpen(true); }}
                className="text-indigo-600 hover:text-indigo-800 text-[10px] font-black uppercase"
              >
                {esAdmin ? 'EDITAR / GESTIONAR' : 'VER INGREDIENTES'}
              </button>

              {/* 3. PROTECCIÓN DEL BOTÓN ELIMINAR TODO */}
              <ProtectedButton permisos={['eliminar_recetas']}>
                <button 
                  onClick={() => { setSelectedPlato(p); setConfirmOpen(true); }}
                  className="text-red-500 hover:text-red-700 text-[10px] font-black uppercase"
                >
                  ELIMINAR TODO
                </button>
              </ProtectedButton>
            </div>
          )}
        />
      </div>

      {modalOpen && (
        <RecetasModal
          open={modalOpen}
          onClose={() => { setModalOpen(false); refresh(); }}
          plato={selectedPlato}
        />
      )}

      <ConfirmModal
        open={confirmOpen}
        title="¿Eliminar toda la receta?"
        message={`Se quitarán todos los ingredientes de: ${selectedPlato?.nombre}. Esta acción no se puede deshacer.`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDeleteAll}
      />
    </div>
  );
}