import type { Rol } from './rol';
import type { Permiso } from './permiso';

export interface RolPermiso {
  id_rol_permiso: string;
  rol: Rol;
  permiso: Permiso;
}
