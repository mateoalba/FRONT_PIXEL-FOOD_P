// src/api/mesas.ts
import axios from './axios';
import type { Mesa } from '@/types/mesa';

export const mesasApi = {
  getAll: async (): Promise<Mesa[]> => {
    const res = await axios.get('/mesas');
    return res.data;
  },

  getById: async (id: string): Promise<Mesa> => {
    const res = await axios.get(`/mesas/${id}`);
    return res.data;
  },

  create: async (data: Partial<Mesa>) => {
    return axios.post('/mesas', data);
  },
  update: async (id: string, data: Partial<Mesa>) => {
    return axios.patch(`/mesas/${id}`, data);
  },
  remove: async (id: string) => {
    return axios.delete(`/mesas/${id}`);
  },
};

