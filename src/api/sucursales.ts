import axios from './axios';
import type { Sucursal } from '@/types/sucursal';

export const sucursalesApi = {
  getAll: async (): Promise<Sucursal[]> => {
    const res = await axios.get('/sucursal');
    return res.data;
  },

  getById: async (id: string): Promise<Sucursal> => {
    const res = await axios.get(`/sucursal/${id}`);
    return res.data;
  },

  create: async (data: Partial<Sucursal>) => {
    return axios.post('/sucursal', data);
  },

  update: async (id: string, data: Partial<Sucursal>) => {
    return axios.patch(`/sucursal/${id}`, data);
  },

  remove: async (id: string) => {
    return axios.delete(`/sucursal/${id}`);
  },
};