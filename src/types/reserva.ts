export interface Reserva {
  id_reserva: string;
  fecha_reserva: string; 
  hora: string; // Cambiado de any a string para mejor control
  numero_personas: number;
  estado: string;
  id_usuario: string; // En una reserva existente, esto siempre está
  id_mesa: string;
  id_sucursal: string; // Importante para el registro
  mesa?: {
    numero: number; // Ajustado a 'numero' para coincidir con tu service
    capacidad: number;
    sucursal?: {
      nombre: string;
    }
  };
}

// Interfaz para la creación (Lo que envías al POST)
export interface CreateReservaData {
  fecha_reserva: string;
  hora: string;
  numero_personas: number;
  id_mesa: string;
  id_sucursal: string;
  estado?: string;
  
  // LOGICA DINÁMICA: O envías el ID o envías los datos
  id_usuario?: string; 
  datos_cliente?: {
    nombre: string;
    correo: string;
    telefono?: string;
  };
}