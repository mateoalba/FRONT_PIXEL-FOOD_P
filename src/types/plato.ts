import type { Categoria } from './categoria';

export interface Plato {
  id_plato: string;
  nombre: string;
  descripcion: string;
  precio: number;
  disponible: boolean;
  // Relaciones
  categoria?: Categoria; 
  id_categoria?: string; // Campo auxiliar para el formulario
}