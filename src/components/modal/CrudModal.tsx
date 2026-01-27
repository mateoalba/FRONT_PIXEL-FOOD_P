import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

export interface Field<T> {
  name: keyof T;
  label: string;
  required?: boolean;
  type?: 'text' | 'password' | 'select' | 'number' | 'email' | 'date' | 'time';
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
  children?: ReactNode;
}

export function CrudModal<T>({
  open,
  title,
  initialData,
  fields,
  onSubmit,
  onClose,
  children,
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

  // ESTILO DE INPUTS PIXEL-FOOD (Aumentado para el nuevo tamaño)
  const inputClass = (isDisabled?: boolean) => `
    w-full bg-[#F4F7F6] border-2 border-gray-200 rounded-2xl px-5 py-4 
    text-lg font-bold text-[#263238] outline-none transition-all
    ${isDisabled 
      ? 'opacity-50 cursor-not-allowed bg-gray-200' 
      : 'focus:border-[#E53935] hover:border-gray-300 shadow-sm'}
  `;

  return (
    <div className="fixed inset-0 bg-[#263238]/90 backdrop-blur-md flex items-center justify-center z-100 p-4 md:p-10">
      
      {/* CONTENEDOR XL: max-w-4xl lo hace mucho más alargado */}
      <div className="bg-white rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] w-full max-w-4xl border border-white/20 overflow-hidden transform transition-all">
        
        {/* HEADER GRANDE */}
        <div className="bg-[#263238] p-10 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#E53935]"></div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
              {title}
            </h2>
            <p className="text-[#E53935] text-xs font-black tracking-[0.3em] uppercase mt-1">Gestión de Sistema / Pixel-Food</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/30 hover:text-[#E53935] transition-all p-3 hover:bg-white/5 rounded-full"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="p-10">
          <div className="max-h-[65vh] overflow-y-auto pr-4 custom-scrollbar">
            {children ? (
              <div className="w-full">{children}</div>
            ) : (
              <>
                {/* GRID DE 2 COLUMNAS para aprovechar el ancho */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {fields.map(field => (
                    <div key={String(field.name)} className={field.type === 'text' && String(field.name).includes('nombre') ? 'md:col-span-2' : ''}>
                      <label className="block text-[12px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 ml-2">
                        {field.label} {field.required && <span className="text-[#E53935]">*</span>}
                      </label>

                      {field.type === 'select' ? (
                        <div className="relative">
                          <select
                            value={(form[field.name] as any) || ''}
                            onChange={e => handleChange(field.name, e.target.value)}
                            disabled={field.disabled}
                            className={`${inputClass(field.disabled)} appearance-none cursor-pointer`}
                            required={field.required}
                          >
                            <option value="" className="text-gray-400">Seleccionar opción...</option>
                            {field.options?.map(opt => (
                              <option key={opt.value} value={opt.value} className="text-[#263238] font-bold">
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            ▼
                          </div>
                        </div>
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
                          placeholder={field.type === 'password' ? '••••••••' : `Ingresar datos...`}
                          required={field.required}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* ACCIONES ALARGADAS */}
                <div className="flex flex-col md:flex-row gap-4 mt-12 pt-8 border-t-2 border-gray-50">
                  <button
                    type="button"
                    onClick={onClose}
                    className="order-2 md:order-1 flex-1 text-gray-400 font-black py-5 rounded-2xl uppercase text-xs tracking-[0.3em] hover:bg-gray-50 hover:text-[#263238] transition-all"
                  >
                    Descartar y Salir
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="order-1 md:order-2 flex-2 bg-[#E53935] text-white font-black py-5 rounded-2xl text-xl uppercase italic tracking-tighter hover:bg-[#c62828] shadow-[0_10px_30px_-10px_rgba(229,57,53,0.5)] transition-all flex items-center justify-center gap-3"
                  >
                    <CheckCircle2 className="w-7 h-7" />
                    Guardar Configuración
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}