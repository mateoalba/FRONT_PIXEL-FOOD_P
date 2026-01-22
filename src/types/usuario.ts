import type { Rol } from './rol';

export interface Usuario {
  _id: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  direccion?: string;
  contrasena?: string; // solo para creación/edición
  rol?: Rol;            // objeto completo del rol (para mostrar en tabla)
  rol_id?: string;      // id del rol (para enviar al backend al editar)
}
