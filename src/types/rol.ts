import type { RolNombre } from '@/types/rol-nombre';
import type { RolPermiso } from './rol-permiso'; // si tienes un type para los permisos

export interface Rol {
  id_rol: string;
  nombre: RolNombre;     // enum que coincide con tu entity
  descripcion?: string;
  rolPermisos?: RolPermiso[]; // opcional, dependiendo si quieres traerlos
}
