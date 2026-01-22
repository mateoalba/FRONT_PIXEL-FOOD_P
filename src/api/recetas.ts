import api from './axios';
import type { Receta } from '@/types/receta';

export const recetasApi = {
  getAll: async (): Promise<Receta[]> => {
    const res = await api.get('/recetas');
    return res.data;
  },

  getById: async (id: string): Promise<Receta> => {
    const res = await api.get(`/recetas/${id}`);
    return res.data;
  },

  // Añadimos este para el modal que hicimos antes
  getByPlato: async (idPlato: string): Promise<Receta[]> => {
    const res = await api.get(`/recetas/plato/${idPlato}`);
    return res.data;
  },

  create: async (data: Partial<Receta>): Promise<Receta> => {
    const res = await api.post('/recetas', data);
    return res.data;
  },

  update: async (id: string, data: Partial<Receta>): Promise<Receta> => {
    const res = await api.patch(`/recetas/${id}`, data);
    return res.data;
  },

  // CAMBIO CLAVE: Cambiar 'delete' por 'remove' para que useCrud sea feliz
  remove: async (id: string): Promise<void> => {
    await api.delete(`/recetas/${id}`);
  },
};