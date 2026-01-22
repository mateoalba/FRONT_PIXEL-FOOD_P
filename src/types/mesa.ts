import type { Sucursal } from './sucursal';

export interface Mesa {
  id_mesa: string;
  numero: number;
  capacidad: number;
  estado: 'Libre' | 'Ocupada' | 'Reservada'; // Tipado más estricto si quieres
  id_sucursal: string;
  sucursal?: Sucursal; // Reutilizamos la interfaz de Sucursal
}