import axios from './axios';
import { type Categoria } from '@/types';

export const categoriasApi = {
  // Obtener todas las categorías
  getAll: async (): Promise<Categoria[]> => {
    const res = await axios.get('/categorias');
    return res.data;
  },

  // NUEVO: Obtener una categoría específica por ID
  getById: async (id: string): Promise<Categoria> => {
    const res = await axios.get(`/categorias/${id}`);
    return res.data;
  },

  // Crear una nueva categoría
  create: async (data: Partial<Categoria>): Promise<Categoria> => { 
    const res = await axios.post('/categorias', data);
    return res.data;
  },

  // Actualizar una categoría existente
  update: async (id: string, data: Partial<Categoria>): Promise<Categoria> => {
    const res = await axios.patch(`/categorias/${id}`, data);
    return res.data;
  },

  // Eliminar una categoría
  remove: async (id: string): Promise<void> => {
    await axios.delete(`/categorias/${id}`);
  },
};