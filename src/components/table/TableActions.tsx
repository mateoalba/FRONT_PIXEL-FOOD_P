import React from 'react';

interface TableActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  showEdit?: boolean;
  showDelete?: boolean;
  // 👇 Añadimos customActions para recibir botones extra (como el de Cobrar)
  customActions?: React.ReactNode; 
}

export function TableActions({ 
  onEdit, 
  onDelete, 
  showEdit = true, 
  showDelete = true,
  customActions // 👈 Desestructuramos la nueva prop
}: TableActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {/* 💰 RENDERIZA LAS ACCIONES PERSONALIZADAS PRIMERO (Botón Cobrar) */}
      {customActions}

      {showEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Evita que el click afecte a la fila de la tabla
            onEdit?.();
          }}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm p-1 transition-colors"
          title="Editar pedido o estado"
        >
          Editar
        </button>
      )}
      
      {showDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="text-red-600 hover:text-red-800 font-medium text-sm p-1 transition-colors"
          title="Anular pedido"
        >
          Anular
        </button>
      )}
    </div>
  );
}