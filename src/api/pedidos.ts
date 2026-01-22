import api from './axios'; 
import type { Pedido, CreatePedidoDto } from '@/types';

export const pedidosApi = {
  // Cambiamos a getAll para que useCrud lo reconozca
  getAll: async (): Promise<Pedido[]> => {
    const { data } = await api.get<Pedido[]>('/pedido');
    return data;
  },

  getById: async (id: string): Promise<Pedido> => {
    const { data } = await api.get<Pedido>(`/pedido/${id}`);
    return data;
  },

  create: async (nuevoPedido: CreatePedidoDto): Promise<Pedido> => {
    const { data } = await api.post<Pedido>('/pedido', nuevoPedido);
    return data;
  },

  update: async (id: string, dto: Partial<CreatePedidoDto>): Promise<Pedido> => {
    const { data } = await api.patch<Pedido>(`/pedido/${id}`, dto);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/pedido/${id}`);
  }
};