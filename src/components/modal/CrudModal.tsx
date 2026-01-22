import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export interface Field<T> {
  name: keyof T;
  label: string;
  required?: boolean;
  type?: 'text' | 'password' | 'select' | 'number' | 'email';
  options?: { label: string; value: any }[];
  disabled?: boolean;
  min?: number;
}

interface Props<T> {
  open: boolean;
  title: string;
  initialData?: Partial<T>;
  fields: Field<T>[];
  onSubmit: (data: Partial<T>) => void;
  onClose: () => void;
  children?: ReactNode; // Ya lo tienes en la interfaz 👍
}

export function CrudModal<T>({
  open,
  title,
  initialData,
  fields,
  onSubmit,
  onClose,
  children, // 1. 👈 Recibimos children aquí
}: Props<T>) {
  const [form, setForm] = useState<Partial<T>>({});

  useEffect(() => {
    if (open) {
      setForm(initialData || {});
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleChange = (key: keyof T, value: any, fieldConfig?: Field<T>) => {
    let finalValue = value;
    if (fieldConfig?.type === 'number') {
      if (value === '') {
        finalValue = '';
      } else {
        const numValue = Number(value);
        const minVal = fieldConfig.min ?? 0;
        if (numValue < minVal) return; 
        finalValue = numValue;
      }
    }
    setForm(prev => ({ ...prev, [key]: finalValue }));
  };

  const handleSubmit = () => {
    const tieneErrores = fields.some(field => {
        if (field.type === 'number') {
            const val = form[field.name] as any;
            const min = field.min ?? 0;
            if (val !== '' && val < min) return true;
        }
        return false;
    });

    if (tieneErrores) {
        alert("Por favor, revisa los campos numéricos. No pueden ser negativos.");
        return;
    }

    const cleaned: Partial<T> = {};
    Object.keys(form).forEach(key => {
      const value = form[key as keyof T];
      const isId = key === '_id' || key.startsWith('id_');
      if (isId || (value !== undefined && value !== null && value !== '')) {
        cleaned[key as keyof T] = value;
      }
    });

    onSubmit(cleaned);
  };

  const inputClass = (isDisabled?: boolean) => `
    w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none transition-all
    ${isDisabled 
      ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' 
      : 'focus:ring-2 focus:ring-blue-500 hover:border-gray-400'}
  `;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md border border-gray-100">
        <div className="flex justify-between items-center mb-5 border-b pb-2">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* 2. 👈 Lógica Condicional */}
          {children ? (
            children
          ) : (
            <>
              {fields.map(field => (
                <div key={String(field.name)}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>

                  {field.type === 'select' ? (
                    <select
                      value={(form[field.name] as any) || ''}
                      onChange={e => handleChange(field.name, e.target.value)}
                      disabled={field.disabled}
                      className={inputClass(field.disabled)}
                      required={field.required}
                    >
                      <option value="">Seleccione una opción...</option>
                      {field.options?.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={(form[field.name] as any) || ''}
                      onChange={e => handleChange(field.name, e.target.value, field)}
                      disabled={field.disabled}
                      min={field.min ?? (field.type === 'number' ? 0 : undefined)}
                      onKeyDown={(e) => {
                        if (field.type === 'number' && e.key === '-') e.preventDefault();
                      }}
                      className={inputClass(field.disabled)}
                      placeholder={field.type === 'password' ? '••••••••' : `Ingrese ${field.label.toLowerCase()}`}
                      required={field.required}
                    />
                  )}
                </div>
              ))}

              {/* Los botones solo se muestran si NO hay children */}
              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-md transition-colors"
                >
                  Guardar Cambios
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}