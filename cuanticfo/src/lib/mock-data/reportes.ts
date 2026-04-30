import type { EstadoResultados, FlujoCaja } from '@/lib/types';

// =====================================================
// MOCK — Estado de Resultados
// =====================================================
export const mockEstadoResultados: EstadoResultados = {
  periodo: '2026-04',
  ingresos_operacionales: 25_430_000,
  costos_directos: -9_850_000,
  margen_bruto: 15_580_000,
  gastos_administracion: -1_800_000,
  gastos_ventas: -1_040_000,
  gastos_tecnologia: -400_000,
  gastos_operacionales: -3_240_000,
  resultado_operacional: 12_340_000,
  otros_ingresos: 250_000,
  otros_egresos: -150_000,
  resultado_antes_impuestos: 12_440_000,
};

export const mockEstadoResultadosHistorico = [
  { mes: 'Nov', resultado: 6_200_000 },
  { mes: 'Dic', resultado: 9_100_000 },
  { mes: 'Ene', resultado: 7_800_000 },
  { mes: 'Feb', resultado: 11_200_000 },
  { mes: 'Mar', resultado: 9_500_000 },
  { mes: 'Abr', resultado: 12_340_000 },
];

// =====================================================
// MOCK — Flujo de Caja
// =====================================================
export const mockFlujoCaja: FlujoCaja = {
  caja_actual: 18_760_000,
  ingresos_esperados_30d: 15_430_000,
  gastos_esperados_30d: -12_850_000,
  flujo_proyectado_30d: 21_340_000,
  cuentas_por_cobrar: 32_450_000,
  cuentas_por_pagar: 9_200_000,
  proyeccion: [
    { fecha: '24 Abr', saldo: 18_760_000, ingresos: 0, gastos: 0 },
    { fecha: '1 May', saldo: 22_100_000, ingresos: 5_000_000, gastos: 1_660_000 },
    { fecha: '8 May', saldo: 19_800_000, ingresos: 2_000_000, gastos: 4_300_000 },
    { fecha: '15 May', saldo: 24_500_000, ingresos: 7_000_000, gastos: 2_300_000 },
    { fecha: '22 May', saldo: 21_340_000, ingresos: 1_430_000, gastos: 4_590_000 },
  ],
};
