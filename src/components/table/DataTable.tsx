import type { JSX, ReactNode } from 'react';

// Cambiamos key a string para permitir llaves virtuales (como 'acciones' o 'sucursal')
interface Column<T> {
  key: string; 
  label: string;
  // Añadimos render para permitir JSX personalizado en la celda
  render?: (row: T) => ReactNode; 
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  renderActions?: (row: T) => JSX.Element;
  loading?: boolean; // Opcional por si quieres mostrar un spinner
}

export function DataTable<T>({
  columns,
  data,
  renderActions,
  loading
}: Props<T>) {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className="px-4 py-2 text-left text-sm font-semibold text-gray-700"
              >
                {col.label}
              </th>
            ))}
            {renderActions && (
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Acciones</th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {loading ? (
             <tr><td colSpan={columns.length + 1} className="text-center py-4">Cargando...</td></tr>
          ) : data.length === 0 ? (
             <tr><td colSpan={columns.length + 1} className="text-center py-4">No hay datos disponibles</td></tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                {columns.map(col => (
                  <td
                    key={col.key}
                    className="px-4 py-2 text-sm text-gray-600"
                  >
                    {/* Lógica clave: 
                       1. Si existe col.render, lo usamos pasándole toda la fila.
                       2. Si no, intentamos mostrar la propiedad directa row[key].
                    */}
                    {col.render 
                      ? col.render(row) 
                      : String((row as any)[col.key] ?? '')
                    }
                  </td>
                ))}

                {renderActions && (
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      {renderActions(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}