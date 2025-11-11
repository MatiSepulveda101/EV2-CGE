// src/app/models/form-models.ts

// ==================== CLIENTE ====================
export interface Cliente {
  /** PK */
  id_cliente: number;          // UUID o serial
  rut: string;                 // único, formato chileno
  nombre_razon: string;
  email_contacto: string;
  telefono: string;
  direccion_facturacion: string;
  estado: 'activo' | 'inactivo';
  created_at: Date;
  updated_at: Date;
}

// ==================== MEDIDOR ====================
export interface Medidor {
  id_medidor: number;
  codigo_medidor: string;
  id_cliente: number;
  direccion_suministro: string;
  estado: 'activo' | 'inactivo';
  created_at: Date;
  updated_at: Date;
  cliente?: number;
  nombre_cliente?: string;
}

// ==================== LECTURA CONSUMO ====================
export interface LecturaConsumo {
  id_lectura: number;
  id_medidor: number;
  anio: number;
  mes: number;
  lectura_kwh: number;
  observacion?: string | null;
  created_at: Date;
}

// ==================== BOLETA ====================
export interface Boleta {
  id_boleta: number;
  id_cliente: string;
  anio: number;
  mes: number;
  kwh_total: number;           // decimal
  tarifa_base: number;         // decimal
  cargos: number;              // decimal
  iva: number;                 // decimal
  total_pagar: number;         // decimal
  estado: 'emitida' | 'enviada' | 'pagada' | 'anulada';
  created_at: Date;
}
