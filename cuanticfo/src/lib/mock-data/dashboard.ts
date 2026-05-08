// =====================================================
// MOCK DATA — Dashboard
// Datos ficticios inspirados en diseño Diseño_Front_pc.png
// =====================================================

import type {
  KpiData,
  ChartDataPoint,
  DonutDataPoint,
  Movimiento,
  CuentaBancaria,
} from '@/lib/types';

export const mockEmpresa = {
  id: '11111111-1111-1111-1111-111111111111',
  razon_social: 'CuantiCode Labs SpA',
  rut: '77.123.456-8',
  giro: 'Servicios tecnológicos y consultoría',
  regimen_tributario: 'pyme' as const,
  tasa_ppm: 1.5,
  correo_contador: 'contador@cuanticode.cl',
  banco_principal: 'Banco de Chile',
  fecha_inicio_actividades: '2022-01-01',
  created_at: '2022-01-01T00:00:00Z',
};

export const mockUsuario = {
  id: '22222222-2222-2222-2222-222222222222',
  empresa_id: mockEmpresa.id,
  nombre: 'David Cofré',
  email: 'david@cuanticode.cl',
  rol: 'cfo' as const,
  created_at: '2022-01-01T00:00:00Z',
};

export const mockPeriodo = '2026-04';

export const mockKpis: KpiData[] = [
  {
    label: 'Ingresos del mes',
    value: 25_430_000,
    variacion_pct: 18.2,
    variacion_label: 'vs Mar 2026',
    tipo: 'ingreso',
    sparkline: [18, 22, 20, 25, 23, 28, 25],
  },
  {
    label: 'Gastos del mes',
    value: 13_250_000,
    variacion_pct: 9.4,
    variacion_label: 'vs Mar 2026',
    tipo: 'gasto',
    sparkline: [10, 11, 12, 11, 13, 12, 13],
  },
  {
    label: 'Resultado operacional',
    value: 12_180_000,
    variacion_pct: 28.7,
    variacion_label: 'vs Mar 2026',
    tipo: 'resultado',
    sparkline: [6, 9, 8, 12, 10, 13, 12],
  },
  {
    label: 'IVA a pagar (estimado)',
    value: 2_150_000,
    variacion_pct: -6.1,
    variacion_label: 'vs Mar 2026',
    tipo: 'iva',
    sparkline: [3, 2.5, 2.8, 2.2, 2.3, 2.1, 2.15],
  },
  {
    label: 'Caja disponible',
    value: 18_760_000,
    variacion_pct: 12.5,
    variacion_label: 'vs Mar 2026',
    tipo: 'caja',
    sparkline: [14, 15, 16, 17, 16, 18, 18.76],
  },
];

export const mockChartData: ChartDataPoint[] = [
  { mes: 'Nov', ingresos: 18_500_000, gastos: 11_200_000 },
  { mes: 'Dic', ingresos: 22_100_000, gastos: 13_800_000 },
  { mes: 'Ene', ingresos: 19_800_000, gastos: 12_500_000 },
  { mes: 'Feb', ingresos: 24_300_000, gastos: 14_200_000 },
  { mes: 'Mar', ingresos: 21_450_000, gastos: 12_100_000 },
  { mes: 'Abr', ingresos: 25_430_000, gastos: 13_250_000 },
];

export const mockDistribucionGastos: DonutDataPoint[] = [
  { name: 'Servicios', value: 35, color: '#2563eb' },
  { name: 'Personal', value: 25, color: '#7c3aed' },
  { name: 'Tecnología', value: 15, color: '#0ea5e9' },
  { name: 'Marketing', value: 10, color: '#f59e0b' },
  { name: 'Oficina', value: 8, color: '#10b981' },
  { name: 'Otros', value: 7, color: '#94a3b8' },
];

/**
 * Distribución de gastos como HBarItem — montos absolutos + variación vs mes anterior.
 * Usado por HBarList en el Dashboard (reemplaza el donut).
 */
export const mockDistribucionGastosBars = [
  { name: 'Personal',   value: 6_362_500, variation: 4.2,  color: '#2563eb' },
  { name: 'Tecnología', value: 3_710_000, variation: 31.4, color: '#7c3aed' },
  { name: 'Servicios',  value: 1_590_000, variation: -2.1, color: '#0ea5e9' },
  { name: 'Marketing',  value: 1_060_000, variation: 8.0,  color: '#f59e0b' },
  { name: 'Oficina',    value:   795_000, variation: 0,    color: '#10b981' },
  { name: 'Otros',      value:   732_500, variation: -5.0, color: '#94a3b8' },
];

export const mockCuentasBancarias: CuentaBancaria[] = [
  {
    id: '1',
    banco: 'Banco de Chile',
    tipo: 'Cuenta Corriente',
    numero: '1234',
    saldo: 12_450_000,
    color: '#1d4ed8',
  },
  {
    id: '2',
    banco: 'Banco Santander',
    tipo: 'Cuenta Corriente',
    numero: '5678',
    saldo: 1_930_000,
    color: '#dc2626',
  },
  {
    id: '3',
    banco: 'Mercado Pago',
    tipo: 'Saldo disponible',
    numero: '',
    saldo: 4_380_000,
    color: '#0ea5e9',
  },
];

export const mockCuentasPorCobrar = {
  total: 32_450_000,
  clientes: 12,
  vencidas: 8_750_000,
  por_vencer_30d: 12_500_000,
  por_vencer_mas_30d: 11_200_000,
};

export const mockCuentasPorPagar = {
  total: 9_200_000,
  proveedores: 8,
  vencidas: 2_100_000,
  por_vencer_30d: 4_300_000,
  por_vencer_mas_30d: 2_800_000,
};

export const mockUltimosMovimientos: Movimiento[] = [
  {
    id: '1',
    fecha: '2026-04-24',
    tipo: 'ingreso',
    documento: 'Factura F-1035',
    cliente_proveedor: 'Empresa ABC SpA',
    categoria: 'Servicios',
    monto: 2_450_000,
    estado: 'cobrado',
  },
  {
    id: '2',
    fecha: '2026-04-23',
    tipo: 'gasto',
    documento: 'Factura E-2045',
    cliente_proveedor: 'Google Cloud',
    categoria: 'Tecnología',
    monto: -450_000,
    estado: 'pagado',
  },
  {
    id: '3',
    fecha: '2026-04-23',
    tipo: 'gasto',
    documento: 'Boleta B-3321',
    cliente_proveedor: 'Copec S.A.',
    categoria: 'Transporte',
    monto: -80_000,
    estado: 'pendiente',
  },
  {
    id: '4',
    fecha: '2026-04-22',
    tipo: 'ingreso',
    documento: 'Factura F-1034',
    cliente_proveedor: 'Tech SpA',
    categoria: 'Servicios',
    monto: 1_850_000,
    estado: 'pendiente',
  },
  {
    id: '5',
    fecha: '2026-04-21',
    tipo: 'gasto',
    documento: 'Factura E-2044',
    cliente_proveedor: 'Notion Labs Inc.',
    categoria: 'Software',
    monto: -120_000,
    estado: 'pagado',
  },
];
