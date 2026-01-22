import api from './axios'; // Tu instancia de axios configurada
import type { Ingrediente } from '@/types';

export const ingredientesApi = {
  getAll: async () => {
    const { data } = await api.get<Ingrediente[]>('/ingrediente');
    return data;
  },

  getOne: async (id: string) => {
    const { data } = await api.get<Ingrediente>(`/ingrediente/${id}`);
    return data;
  },

  create: async (payload: Partial<Ingrediente>) => {
    const { data } = await api.post<Ingrediente>('/ingrediente', payload);
    return data;
  },

  update: async (id: string, payload: Partial<Ingrediente>) => {
    const { data } = await api.patch<Ingrediente>(`/ingrediente/${id}`, payload);
    return data;
  },

  // 📦 Ruta especial para el Chef/Empleado
  updateStock: async (id: string, stock: number) => {
    const { data } = await api.patch<Ingrediente>(`/ingrediente/${id}/stock`, { stock });
    return data;
  },

  remove: async (id: string) => {
    const { data } = await api.delete(`/ingrediente/${id}`);
    return data;
  }
};