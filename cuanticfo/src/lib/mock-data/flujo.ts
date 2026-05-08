// =====================================================
// MOCK DATA — Cash Flow (Waterfall + 13-week forecast)
// =====================================================

import type { WaterfallItem } from '@/components/charts/Waterfall';
import type { ForecastPoint } from '@/components/charts/CashForecast';

/**
 * Waterfall — Q2 2026 cash movement (Abr → cierre proyectado).
 * Caja inicial → +Ingresos → -Gastos → -Impuestos → -Inversiones → Caja final
 */
export const mockWaterfallQ2: WaterfallItem[] = [
  { label: 'Caja inicial', value: 18_760_000, type: 'total' },
  { label: 'Ingresos op.', value: 25_430_000, type: 'delta' },
  { label: 'Gastos op.', value: -13_250_000, type: 'delta' },
  { label: 'Impuestos', value: -2_150_000, type: 'delta' },
  { label: 'Inversiones', value: -1_500_000, type: 'delta' },
  { label: 'Caja final', value: 27_290_000, type: 'total' },
];

/**
 * 13-week forecast — caja semanal proyectada con banda de confianza.
 * Punto de tensión cerca de la sem 28 (vencimiento IVA + nómina).
 */
export const mockCashForecast13w: ForecastPoint[] = [
  { week: 'S21', value: 18_760_000, low: 18_000_000, high: 19_500_000 },
  { week: 'S22', value: 21_400_000, low: 20_300_000, high: 22_500_000 },
  { week: 'S23', value: 23_100_000, low: 21_500_000, high: 24_700_000 },
  { week: 'S24', value: 22_300_000, low: 20_500_000, high: 24_100_000 },
  { week: 'S25', value: 19_800_000, low: 17_900_000, high: 21_700_000 },
  { week: 'S26', value: 17_200_000, low: 15_100_000, high: 19_300_000 },
  {
    week: 'S27',
    value: 14_500_000,
    low: 12_100_000,
    high: 16_900_000,
    annotation: 'Vencimiento IVA + nómina concentrados',
  },
  {
    week: 'S28',
    value: 12_800_000,
    low: 10_100_000,
    high: 15_500_000,
    annotation: 'Punto de tensión: caja mínima del trimestre',
  },
  { week: 'S29', value: 15_400_000, low: 12_500_000, high: 18_300_000 },
  { week: 'S30', value: 18_900_000, low: 15_700_000, high: 22_100_000 },
  { week: 'S31', value: 22_100_000, low: 18_500_000, high: 25_700_000 },
  { week: 'S32', value: 25_300_000, low: 21_200_000, high: 29_400_000 },
  { week: 'S33', value: 27_800_000, low: 23_300_000, high: 32_300_000 },
];

/**
 * Cash Flow KPIs — top of page strip.
 */
export const mockCashFlowKpis = {
  cajaActual: 18_760_000,
  cajaFinalQ2: 27_290_000,
  variacionQ2Pct: 45.5,
  runwayMeses: 8.4,
  ingresosEsperados90d: 73_400_000,
  gastosEsperados90d: 51_900_000,
  flujoNeto90d: 21_500_000,
  puntoMinimo: { semana: 'S28', valor: 12_800_000 },
};
