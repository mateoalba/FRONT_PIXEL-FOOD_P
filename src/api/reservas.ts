import axios from './axios';
import { type CreateReservaData, type Reserva } from '@/types';

export const reservasApi = {
  // Obtener todas las reservas
  getAll: async (): Promise<Reserva[]> => {
    const res = await axios.get('/reserva');
    return res.data;
  },

  // Obtener una reserva específica por ID
  getById: async (id: string): Promise<Reserva> => {
    const res = await axios.get(`/reserva/${id}`);
    return res.data;
  },

  // Crear reserva (Soporta cliente existente o nuevo "Walk-in")
  create: async (data: CreateReservaData): Promise<Reserva> => { 
    const res = await axios.post('/reserva', data);
    return res.data;
  },

  // Actualizar reserva
  update: async (id: string, data: Partial<Reserva>): Promise<Reserva> => {
    const res = await axios.patch(`/reserva/${id}`, data);
    return res.data;
  },

  // Eliminar reserva
  remove: async (id: string): Promise<void> => {
    await axios.delete(`/reserva/${id}`);
  },
};