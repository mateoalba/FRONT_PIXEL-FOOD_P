import axios from './axios';
import { type DetallePedido, type CreateDetallePedidoDto, type UpdateDetallePedidoDto } from '@/types';

export const detallePedidoApi = {
  // Obtener todos los detalles (el backend filtra si el usuario es cliente)
  getAll: async (): Promise<DetallePedido[]> => {
    const res = await axios.get('/detalle_pedido');
    return res.data;
  },

  getById: async (id: string): Promise<DetallePedido> => {
    const res = await axios.get(`/detalle_pedido/${id}`);
    return res.data;
  },

  // El subtotal NO se envía, el backend lo calcula
  create: async (data: CreateDetallePedidoDto): Promise<DetallePedido> => {
    const res = await axios.post('/detalle_pedido', data);
    return res.data;
  },

  update: async (id: string, data: UpdateDetallePedidoDto): Promise<DetallePedido> => {
    const res = await axios.put(`/detalle_pedido/${id}`, data);
    return res.data;
  },

  remove: async (id: string): Promise<void> => {
    await axios.delete(`/detalle_pedido/${id}`);
  },
};