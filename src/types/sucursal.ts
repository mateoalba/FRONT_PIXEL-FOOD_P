export interface Sucursal {
  id_sucursal: string; // Coincide con tu PrimaryGeneratedColumn('uuid')
  nombre: string;
  direccion: string;
  telefono: string;
}