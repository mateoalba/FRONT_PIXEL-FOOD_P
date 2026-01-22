import { Link } from 'react-router-dom';
import { useCrud } from '@/hooks/useCrud';
import { ingredientesApi } from '@/api/ingredientes';
import type { Ingrediente } from '@/types';

export const StockAlerts = () => {
  // El hook solo se activa cuando este componente se monta
  const { data: ingredientes } = useCrud<Ingrediente>(ingredientesApi);

  const alertasStock = ingredientes.filter(i => i.stock <= 5);

  if (alertasStock.length === 0) return null;

  return (
    <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl shadow-sm">
      <h3 className="text-red-800 font-bold mb-2 flex items-center gap-2">
        ⚠️ Alerta de Inventario Bajo
      </h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {alertasStock.map(ing => (
          <li key={ing.id_ingrediente} className="text-sm text-red-700 bg-white/50 p-2 rounded border border-red-100">
            <strong>{ing.nombre}:</strong> {ing.stock} {ing.unidad_medida} restantes
          </li>
        ))}
      </ul>
      <Link to="/ingredientes" className="text-xs text-red-600 font-bold mt-3 inline-block hover:underline">
        Ir a reponer stock →
      </Link>
    </div>
  );
};