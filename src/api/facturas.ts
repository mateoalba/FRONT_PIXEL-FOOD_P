import axios from './axios';
import { type Factura, type CreateFacturaDto, type UpdateFacturaDto } from '@/types';

export const facturasApi = {
  // Obtener todas las facturas (el backend filtrará según el rol)
  getAll: async (): Promise<Factura[]> => {
    const res = await axios.get('/factura');
    return res.data;
  },

  // Obtener una factura específica por ID
  getById: async (id: string): Promise<Factura> => {
    const res = await axios.get(`/factura/${id}`);
    return res.data;
  },

  // Crear una nueva factura (esto gatilla el cierre del pedido y liberación de mesa)
  create: async (data: CreateFacturaDto): Promise<Factura> => { 
    const res = await axios.post('/factura', data);
    return res.data;
  },

  // Actualizar una factura (normalmente solo para el Admin)
  update: async (id: string, data: UpdateFacturaDto): Promise<Factura> => {
    const res = await axios.patch(`/factura/${id}`, data);
    return res.data;
  },

  // Eliminar/Anular una factura
  remove: async (id: string): Promise<void> => {
    await axios.delete(`/factura/${id}`);
  },
};