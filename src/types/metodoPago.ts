// ✅ Asegúrate de que MetodoPago tenga el tipo 'string' para 'tipo'
export interface MetodoPago {
  id_metodo: string;
  tipo: string; // Si antes decía 'any' o 'number', cámbialo a 'string'
  descripcion?: string;
}

// ✅ Asegúrate de incluir 'referencia_pago' en el DTO
export interface CreateFacturaDto {
  id_pedido: string;
  id_metodo: string;
  total: number;
  referencia_pago: string; // Agrégalo aquí para que TS no proteste
}