import axios from './axios';
import { type MetodoPago } from '@/types';

export const metodoPagoApi = {
  // Obtener todos los métodos (Efectivo, Tarjeta, etc.)
  getAll: async (): Promise<MetodoPago[]> => {
    const res = await axios.get('/metodo_pago');
    return res.data;
  },

  getById: async (id: string): Promise<MetodoPago> => {
    const res = await axios.get(`/metodo_pago/${id}`);
    return res.data;
  },

  create: async (data: Partial<MetodoPago>): Promise<MetodoPago> => {
    const res = await axios.post('/metodo_pago', data);
    return res.data;
  },

  remove: async (id: string): Promise<void> => {
    await axios.delete(`/metodo_pago/${id}`);
  },
};