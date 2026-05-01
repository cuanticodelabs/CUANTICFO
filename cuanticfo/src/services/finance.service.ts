// =====================================================
// FINANCE SERVICE — CuantiCFO
// Actualmente usa mock-data.
// Para conectar con n8n/Supabase, reemplazar las
// funciones por llamadas HTTP reales.
// =====================================================

import {
  mockKpis,
  mockChartData,
  mockDistribucionGastos,
  mockCuentasBancarias,
  mockCuentasPorCobrar,
  mockCuentasPorPagar,
  mockUltimosMovimientos,
  mockEmpresa,
  mockUsuario,
} from '@/lib/mock-data/dashboard';
import { mockAlertas, mockImpuesto, mockCierre } from '@/lib/mock-data/alertas';
import { mockMovimientos, mockIngresos, mockGastos } from '@/lib/mock-data/movimientos';
import { mockEstadoResultados, mockFlujoCaja, mockEstadoResultadosHistorico } from '@/lib/mock-data/reportes';

// Simula latencia de red en desarrollo
const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

// ---- EMPRESA / USUARIO ----
export async function getEmpresa() {
  await delay();
  return mockEmpresa;
}

export async function getUsuario() {
  await delay();
  return mockUsuario;
}

// ---- DASHBOARD ----
export async function getDashboardKpis(_periodo: string) {
  await delay();
  return mockKpis;
}

export async function getChartData(_periodo: string) {
  await delay();
  return mockChartData;
}

export async function getDistribucionGastos(_periodo: string) {
  await delay();
  return mockDistribucionGastos;
}

export async function getCuentasBancarias() {
  await delay();
  return mockCuentasBancarias;
}

export async function getCuentasPorCobrar(_periodo: string) {
  await delay();
  return mockCuentasPorCobrar;
}

export async function getCuentasPorPagar(_periodo: string) {
  await delay();
  return mockCuentasPorPagar;
}

export async function getUltimosMovimientos(_limit = 5) {
  await delay();
  return mockUltimosMovimientos;
}

// ---- MOVIMIENTOS ----
export async function getMovimientos(_filters?: {
  periodo?: string;
  tipo?: string;
  estado?: string;
}) {
  await delay();
  return mockMovimientos;
}

// ---- INGRESOS ----
export async function getIngresos(_periodo?: string) {
  await delay();
  return mockIngresos;
}

// ---- GASTOS ----
export async function getGastos(_periodo?: string) {
  await delay();
  return mockGastos;
}

/**
 * Input para crear un gasto desde el frontend.
 * empresa_id y created_at se inyectan server-side.
 */
export interface CreateGastoInput {
  fecha_documento: string;
  proveedor: string;
  rut_proveedor?: string;
  folio?: string;
  tipo_documento: string;
  categoria_id?: string;
  neto: number;
  iva: number;
  exento?: number;
  total: number;
  usa_credito_fiscal: boolean;
  estado_pago: string;
  tiene_respaldo?: boolean;
  proyecto_id?: string | null;
  archivo_url?: string;
}

/** Respuesta del API /api/finance/gastos */
export interface CreateGastoResponse {
  ok: boolean;
  gasto_id?: string;
  message?: string;
  error?: string;
  campo?: string;
  alertas?: Array<{ tipo: string; descripcion: string }>;
}

/**
 * Crea un gasto a través del proxy Next.js → n8n.
 * Flujo: Client → /api/finance/gastos → n8n /create-expense → Supabase
 */
export async function createGasto(
  input: CreateGastoInput
): Promise<CreateGastoResponse> {
  const res = await fetch('/api/finance/gastos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  const data: CreateGastoResponse = await res.json();

  if (!res.ok || !data.ok) {
    throw new Error(data.message || 'Error al crear el gasto');
  }

  return data;
}

// ---- ALERTAS ----
export async function getAlertas(_periodo?: string) {
  await delay();
  return mockAlertas;
}

// ---- IMPUESTOS / F29 ----
export async function getImpuestoMensual(periodo: string) {
  await delay();
  return { ...mockImpuesto, periodo };
}

// ---- CIERRE MENSUAL ----
export async function getCierreMensual(periodo: string) {
  await delay();
  return { ...mockCierre, periodo };
}

// ---- REPORTES ----
export async function getEstadoResultados(_periodo?: string) {
  await delay();
  return mockEstadoResultados;
}

export async function getEstadoResultadosHistorico() {
  await delay();
  return mockEstadoResultadosHistorico;
}

export async function getFlujoCaja() {
  await delay();
  return mockFlujoCaja;
}
