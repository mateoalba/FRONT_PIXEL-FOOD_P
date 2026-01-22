import api from './axios';

export interface LoginResponse {
  access_token: string;
  usuario: {
    correo: string;
    rol: 'ADMINISTRADOR' | 'EMPLEADO' | 'CLIENTE';
    permisos: string[];
  };
}

export const loginRequest = async (
  correo: string,
  contrasena: string,
): Promise<LoginResponse> => {
  const { data } = await api.post('/auth/login', {
    correo,
    contrasena,
  });
  return data;
};
