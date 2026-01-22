import axios from './axios';
import type { Rol } from '@/types/rol';

export const rolesApi = {
  // Obtener todos los roles
  getAll: async (): Promise<Rol[]> => {
    const res = await axios.get('/rol'); // coincide con tu backend
    return res.data; // ya es un array de roles tal como lo devuelve Postman
  },

  // Obtener un rol por ID (opcional)
  getById: async (id: string): Promise<Rol> => {
    const res = await axios.get(`/rol/${id}`);
    return res.data;
  },

  // Crear un rol (opcional)
  create: async (rol: Partial<Rol>): Promise<Rol> => {
    const res = await axios.post('/rol', rol);
    return res.data;
  },

  // Actualizar un rol (opcional)
  update: async (id: string, rol: Partial<Rol>): Promise<Rol> => {
    const res = await axios.put(`/rol/${id}`, rol);
    return res.data;
  },

  // Eliminar un rol (opcional)
  delete: async (id: string): Promise<void> => {
    await axios.delete(`/rol/${id}`);
  },
};
