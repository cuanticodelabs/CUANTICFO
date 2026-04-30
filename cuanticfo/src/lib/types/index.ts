// =====================================================
// TYPES — CuantiCFO
// Aligned with Modelo_datos.txt + Planificacion_front.txt
// =====================================================

export type UUID = string;

// --- EMPRESA ---
export interface Empresa {
  id: UUID;
  razon_social: string;
  rut: string;
  giro: string;
  regimen_tributario: 'general' | 'pyme' | 'simplificado';
  tasa_ppm: number;
  correo_contador?: string;
  banco_principal?: string;
  fecha_inicio_actividades?: string;
  created_at: string;
}

// --- USUARIO ---
export type RolUsuario = 'admin' | 'cfo' | 'contador' | 'socio_lectura';
export interface Usuario {
  id: UUID;
  empresa_id: UUID;
  nombre: string;
  email: string;
  rol: RolUsuario;
  avatar_url?: string;
  created_at: string;
}

// --- INGRESOS ---
export type TipoDocumento =
  | 'factura_electronica'
  | 'boleta_electronica'
  | 'nota_credito'
  | 'nota_debito'
  | 'boleta_honorarios'
  | 'factura_extranjera'
  | 'otro';

export type EstadoCobro = 'cobrado' | 'pendiente' | 'vencido';
export type EstadoPago = 'pagado' | 'pendiente' | 'vencido';

export interface Ingreso {
  id: UUID;
  empresa_id: UUID;
  fecha_emision: string;
  fecha_pago?: string;
  cliente: string;
  rut_cliente: string;
  folio: string;
  tipo_documento: TipoDocumento;
  neto: number;
  iva: number;
  exento: number;
  total: number;
  estado_cobro: EstadoCobro;
  proyecto_id?: UUID;
  archivo_url?: string;
  created_at: string;
}

// --- GASTOS ---
export interface Gasto {
  id: UUID;
  empresa_id: UUID;
  fecha_documento: string;
  fecha_pago?: string;
  proveedor: string;
  rut_proveedor: string;
  folio: string;
  tipo_documento: TipoDocumento;
  categoria: string;
  categoria_id?: UUID;
  neto: number;
  iva: number;
  exento: number;
  total: number;
  usa_credito_fiscal: boolean;
  estado_pago: EstadoPago;
  proyecto_id?: UUID;
  archivo_url?: string;
  created_at: string;
}

// --- MOVIMIENTO (vista unificada) ---
export type TipoMovimiento = 'ingreso' | 'gasto' | 'transferencia';
export interface Movimiento {
  id: UUID;
  fecha: string;
  tipo: TipoMovimiento;
  documento: string;
  cliente_proveedor: string;
  categoria: string;
  monto: number;
  estado: EstadoCobro | EstadoPago;
}

// --- IMPUESTOS MENSUALES / F29 ---
export interface ImpuestoMensual {
  id: UUID;
  empresa_id: UUID;
  periodo: string; // "2026-04"
  iva_debito: number;
  iva_credito: number;
  iva_a_pagar: number;
  ppm: number;
  retenciones: number;
  remanente?: number;
  total_estimado: number;
  estado: 'borrador' | 'revisado' | 'declarado';
  comprobante_url?: string;
  observaciones?: string[];
  created_at: string;
}

// --- CIERRE MENSUAL ---
export interface CierreMensual {
  id: UUID;
  empresa_id: UUID;
  periodo: string;
  ventas_revisadas: boolean;
  compras_revisadas: boolean;
  honorarios_revisados: boolean;
  banco_conciliado: boolean;
  impuestos_calculados: boolean;
  f29_preparado: boolean;
  reporte_generado: boolean;
  enviado_contador: boolean;
  cerrado: boolean;
  cerrado_por?: UUID;
  cerrado_at?: string;
}

// --- ALERTAS ---
export type SeveridadAlerta = 'alta' | 'media' | 'baja';
export type EstadoAlerta = 'activa' | 'resuelta' | 'descartada';
export interface Alerta {
  id: UUID;
  empresa_id: UUID;
  periodo: string;
  tipo: string;
  severidad: SeveridadAlerta;
  descripcion: string;
  accion_sugerida: string;
  estado: EstadoAlerta;
  created_at: string;
}

// --- ESTADO DE RESULTADOS ---
export interface EstadoResultados {
  periodo: string;
  ingresos_operacionales: number;
  costos_directos: number;
  margen_bruto: number;
  gastos_administracion: number;
  gastos_ventas: number;
  gastos_tecnologia: number;
  gastos_operacionales: number;
  resultado_operacional: number;
  otros_ingresos: number;
  otros_egresos: number;
  resultado_antes_impuestos: number;
}

// --- FLUJO DE CAJA ---
export interface FlujoCaja {
  caja_actual: number;
  ingresos_esperados_30d: number;
  gastos_esperados_30d: number;
  flujo_proyectado_30d: number;
  cuentas_por_cobrar: number;
  cuentas_por_pagar: number;
  proyeccion: FlujoCajaProyeccion[];
}

export interface FlujoCajaProyeccion {
  fecha: string;
  saldo: number;
  ingresos: number;
  gastos: number;
}

// --- KPI ---
export interface KpiData {
  label: string;
  value: number;
  variacion_pct: number;
  variacion_label: string;
  tipo: 'ingreso' | 'gasto' | 'resultado' | 'iva' | 'caja' | 'cobrar' | 'pagar' | 'alerta';
  sparkline?: number[];
}

// --- CHART DATA ---
export interface ChartDataPoint {
  mes: string;
  ingresos: number;
  gastos: number;
  resultado?: number;
}

export interface DonutDataPoint {
  name: string;
  value: number;
  color: string;
}

// --- CUENTA BANCARIA ---
export interface CuentaBancaria {
  id: UUID;
  banco: string;
  tipo: string;
  numero: string;
  saldo: number;
  color: string;
}
