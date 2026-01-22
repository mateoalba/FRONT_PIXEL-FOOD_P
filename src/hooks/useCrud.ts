import { useEffect, useState } from 'react';

// 1. La interfaz ahora es flexible pero segura
export interface CrudService<T, D = Partial<T>> {
  getAll: () => Promise<T[]>;
  create: (data: D) => Promise<any>; 
  update: (id: string, data: D) => Promise<any>; 
  remove: (id: string) => Promise<any>;
  getById?: (id: string) => Promise<T>;
}

export function useCrud<T, D = Partial<T>>(service: any) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función interna para no enviar basura al servidor
  const cleanPayload = (payload: any): any => {
    const cleaned: any = {};
    if (!payload) return cleaned;
    Object.keys(payload).forEach(key => {
      const value = payload[key];
      if (value !== undefined && value !== null && value !== '') {
        cleaned[key] = value;
      }
    });
    return cleaned;
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await service.getAll();
      setData(res);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (payload: D) => {
    try {
      setError(null);
      await service.create(cleanPayload(payload));
      await fetchAll();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al crear');
      throw err; // Re-lanzamos para que el formulario sepa que falló
    }
  };

  const updateItem = async (id: string, payload: D) => {
    try {
      setError(null);
      await service.update(id, cleanPayload(payload));
      await fetchAll();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al actualizar');
      throw err;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      setError(null);
      await service.remove(id);
      await fetchAll();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al eliminar');
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    data,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refresh: fetchAll,
  };
}