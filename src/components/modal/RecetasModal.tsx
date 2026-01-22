import { useState, useEffect } from 'react';
import { recetasApi } from '@/api/recetas';
import { ingredientesApi } from '@/api/ingredientes';
import { platosApi } from '@/api/platos'; 
import type { Receta } from '@/types/receta';
import type { Ingrediente } from '@/types/ingrediente';
import type { Plato } from '@/types/plato';
import ProtectedButton from '../ProtectedButton';

interface Props {
  plato: Plato | null; 
  open: boolean;
  onClose: () => void;
}

export const RecetasModal = ({ plato: initialPlato, open, onClose }: Props) => {
  const [receta, setReceta] = useState<Receta[]>([]);
  const [todosIngredientes, setTodosIngredientes] = useState<Ingrediente[]>([]);
  const [todosPlatos, setTodosPlatos] = useState<Plato[]>([]); 
  const [platoLocal, setPlatoLocal] = useState<Plato | null>(initialPlato);
  const [loading, setLoading] = useState(false);
  const [selectedIngrediente, setSelectedIngrediente] = useState('');
  const [cantidad, setCantidad] = useState<number | ''>('');

  useEffect(() => {
    if (open) {
      setPlatoLocal(initialPlato);
      cargarAuxiliares();
      if (initialPlato) {
        cargarIngredientesPlato(initialPlato.id_plato);
      } else {
        setReceta([]); 
      }
    }
  }, [open, initialPlato]);

  const cargarAuxiliares = async () => {
    try {
      const [resIngs, resPlatos] = await Promise.all([
        ingredientesApi.getAll(),
        platosApi.getAll()
      ]);
      setTodosIngredientes(resIngs);
      setTodosPlatos(resPlatos);
    } catch (error) {
      console.error("Error al cargar auxiliares:", error);
    }
  };

  const cargarIngredientesPlato = async (idPlato: string) => {
    setLoading(true);
    try {
      const res = await recetasApi.getByPlato(idPlato);
      setReceta(res);
    } catch (error) {
      console.error("Error al cargar receta:", error);
    } finally {
      setLoading(false);
    }
  };

  const ingredienteYaExiste = (id: string) => {
    return receta.some(r => String(r.ingrediente?.id_ingrediente) === String(id));
  };

  const handlePlatoChange = (id: string) => {
    const p = todosPlatos.find(pl => String(pl.id_plato) === id);
    if (p) {
      setPlatoLocal(p);
      cargarIngredientesPlato(p.id_plato);
    } else {
      setPlatoLocal(null);
      setReceta([]);
    }
  };

  const handleAdd = async () => {
    // 1. VALIDACIÓN DE CANTIDAD POSITIVA
    if (Number(cantidad) <= 0) {
      alert("La cantidad debe ser un número positivo mayor a cero.");
      return;
    }

    if (!selectedIngrediente || !cantidad || !platoLocal) return;

    if (ingredienteYaExiste(selectedIngrediente)) {
        alert("Este insumo ya está en la receta.");
        return;
    }
    
    try {
      await recetasApi.create({
        id_plato: platoLocal.id_plato,
        id_ingrediente: selectedIngrediente,
        cantidad: Number(cantidad)
      });
      
      setSelectedIngrediente('');
      setCantidad('');
      cargarIngredientesPlato(platoLocal.id_plato); 
    } catch (error) {
      alert("Error al añadir el ingrediente");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Quitar este ingrediente de la receta?")) {
      try {
        await recetasApi.remove(id);
        if (platoLocal) cargarIngredientesPlato(platoLocal.id_plato);
      } catch (error) {
        alert("Error al eliminar");
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        
        <div className="p-5 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
          <div>
            <h3 className="text-lg font-bold text-gray-800 uppercase">
              {platoLocal 
                ? <>Ingredientes de: <span className="text-orange-600">{platoLocal.nombre}</span></>
                : "Crear Nueva Receta"
              }
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        <div className="p-6 overflow-y-auto">
          {!initialPlato && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <label className="block text-[10px] font-black text-blue-800 uppercase mb-2">1. Selecciona el Plato del Menú</label>
              <select 
                className="w-full border-2 border-blue-200 rounded-md p-2 text-sm font-bold focus:border-blue-500 outline-none"
                value={platoLocal?.id_plato || ''}
                onChange={(e) => handlePlatoChange(e.target.value)}
              >
                <option value="">-- Seleccionar un plato --</option>
                {todosPlatos.map(p => (
                  <option key={p.id_plato} value={p.id_plato}>{p.nombre}</option>
                ))}
              </select>
            </div>
          )}

          <div className={!platoLocal ? "opacity-40 pointer-events-none" : ""}>
            <ProtectedButton permisos={['crear_recetas']}>
              <>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">2. Añadir Insumos</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 p-4 bg-gray-50 border rounded-lg">
                  <div className="md:col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Insumo</label>
                    <select 
                      className="w-full border rounded-md p-2 text-sm"
                      value={selectedIngrediente}
                      onChange={(e) => setSelectedIngrediente(e.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      {todosIngredientes.map(ing => {
                        const yaAgregado = ingredienteYaExiste(ing.id_ingrediente);
                        return (
                          <option 
                            key={ing.id_ingrediente} 
                            value={ing.id_ingrediente}
                            disabled={yaAgregado}
                            className={yaAgregado ? "text-gray-300 italic" : ""}
                          >
                            {ing.nombre} ({ing.unidad_medida}) {yaAgregado ? '✓' : ''}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Cantidad</label>
                    <input 
                      type="number" 
                      min="0.01" // Evita negativos en selectores de flechas
                      step="0.01" 
                      className="w-full border rounded-md p-2 text-sm"
                      placeholder="0.00"
                      value={cantidad}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Number(e.target.value);
                        // No permite escribir el signo menos
                        if (typeof val === 'number' && val < 0) return;
                        setCantidad(val);
                      }}
                    />
                  </div>
                  <div className="flex items-end">
                    <button 
                      onClick={handleAdd}
                      // Se bloquea si no hay datos, si el ingrediente existe o si la cantidad es <= 0
                      disabled={!selectedIngrediente || !cantidad || Number(cantidad) <= 0 || ingredienteYaExiste(selectedIngrediente)}
                      className="w-full bg-orange-600 text-white font-bold py-2 rounded-md hover:bg-orange-700 disabled:bg-gray-300 transition-all shadow-sm"
                    >
                      {ingredienteYaExiste(selectedIngrediente) ? 'Ya Agregado' : 'Añadir'}
                    </button>
                  </div>
                </div>
              </>
            </ProtectedButton>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-2">Insumo</th>
                    <th className="px-4 py-2 text-center">Cantidad</th>
                    <th className="px-4 py-2 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {receta.map((r) => (
                    <tr key={r.id_receta} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-700">{r.ingrediente?.nombre}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded font-bold">
                          {r.cantidad} {r.ingrediente?.unidad_medida}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <ProtectedButton permisos={['eliminar_recetas']}>
                          <button 
                            onClick={() => handleDelete(r.id_receta)}
                            className="text-red-500 hover:text-red-700 font-black text-lg"
                          >
                            ×
                          </button>
                        </ProtectedButton>
                      </td>
                    </tr>
                  ))}
                  {receta.length === 0 && !loading && platoLocal && (
                    <tr>
                      <td colSpan={3} className="text-center py-10 text-gray-400 italic">
                        No hay ingredientes asignados a este plato.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 rounded-b-xl text-right">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg font-bold hover:bg-black transition-all"
          >
            Finalizar
          </button>
        </div>
      </div>
    </div>
  );
};