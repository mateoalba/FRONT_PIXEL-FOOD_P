import axios from './axios';
import type { Usuario } from '@/types';

export const usuariosApi = {
  getAll: async (): Promise<Usuario[]> => {
    const res = await axios.get('/usuario');
    return res.data;
  },

  getById: async (id: string): Promise<Usuario> => {
    const res = await axios.get(`/usuario/${id}`);
    return res.data;
  },

  create: async (data: Partial<Usuario>) => {
    // data puede incluir rol_id SOLO si es admin
    return axios.post('/usuario', data);
  },

  update: async (id: string, data: Partial<Usuario>) => {
    // rol_id puede venir aquí
    return axios.patch(`/usuario/${id}`, data);
  },

  remove: async (id: string) => {
    return axios.delete(`/usuario/${id}`);
  },
};
