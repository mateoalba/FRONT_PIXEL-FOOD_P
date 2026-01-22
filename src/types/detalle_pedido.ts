export interface DetallePedido {
  id_detalle: string;
  id_pedido: string;
  id_plato: string;
  cantidad: number;
  subtotal: number;
  plato?: {
    nombre: string;
    precio: number;
  };
}

export interface CreateDetallePedidoDto {
  id_pedido: string;
  id_plato: string;
  cantidad: number;
}

export interface UpdateDetallePedidoDto extends Partial<CreateDetallePedidoDto> {}