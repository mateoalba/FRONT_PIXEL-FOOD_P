import type { Key, ReactNode } from "react";
import type { Pedido } from "./pedido"; // Importa tu tipo de Pedido ya existente
 // Importa tu tipo de Pedido ya existente

export interface Factura {
  id_factura: string;
  id_metodo: string;       // El ID que conecta con MongoDB
  fecha_emision: Date;     // El campo que definiste en tu Entity
  total: number;
  pedido: Pedido;          // Relación de Postgres
  
  // Este campo es virtual, lo llenamos en el Backend con la info de Mongo
  metodo_pago?: MetodoPago; 
}

export interface MetodoPago {
  tipo: ReactNode;
  _id: Key | null | undefined;
  id_metodo: string;
  nombre: string;         // Ejemplo: "Efectivo", "Tarjeta de Crédito"
  descripcion?: string;
  activo: boolean;
}

export interface CreateFacturaDto {
  id_pedido: string;
  id_metodo: string;
  total: number;
}

export interface UpdateFacturaDto {
  id_pedido?: string;
  id_metodo?: string;
  total?: number;
}