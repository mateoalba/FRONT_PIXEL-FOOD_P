export interface PedidoItem {
  id_plato: string;
  cantidad: number;
}

export interface Pedido {
  id_pedido: string;
  fecha: string;
  tipo: string;
  id_usuario: string;
  id_mesa?: string | null;
  total: number;
  estado: string;
  // Relaciones opcionales que devuelve el GET
  mesa?: {
      numero: any; nro_mesa: number 
}; 
  detalles?: any[]; 
}

export interface CreatePedidoDto {
  tipo: string;
  id_usuario: string; // Tu DTO lo marca como @IsNotEmpty()
  id_mesa?: string;
  total: number;
  estado: string;    // Tu DTO lo marca como @IsNotEmpty()
  items: PedidoItem[];
}