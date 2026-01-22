import type { Plato } from './plato';
import type { Ingrediente } from './ingrediente';

export interface Receta {
  id_receta: string;
  id_plato: string;       // El ID para enviar al backend
  id_ingrediente: string; // El ID para enviar al backend
  cantidad: number;
  plato?: Plato;          // El objeto completo que devuelve NestJS
  ingrediente?: Ingrediente; // El objeto completo que devuelve NestJS
}