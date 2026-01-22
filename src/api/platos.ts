import api from './axios';
import type { Plato } from '@/types/plato';

export const platosApi = {
  // Obtiene todos los platos incluyendo su relación con categoría
  getAll: async (): Promise<Plato[]> => {
    const { data } = await api.get<Plato[]>('/platos');
    return data;
  },

  // Crea un nuevo plato vinculado a una id_categoria
  create: async (payload: Partial<Plato>) => {
    const { data } = await api.post<Plato>('/platos', payload);
    return data;
  },

  // Actualiza los datos de un plato por su UUID
  update: async (id: string, payload: Partial<Plato>) => {
    const { data } = await api.patch<Plato>(`/platos/${id}`, payload);
    return data;
  },

  // Elimina físicamente el plato de la base de datos
  remove: async (id: string) => {
    const { data } = await api.delete(`/platos/${id}`);
    return data;
  }
};