// =====================================================
// MOCK DATA — Budget vs Actuals
// =====================================================

import type { VarianceRow } from '@/components/charts/VarianceHeatmap';

export const presupuestoMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];

/**
 * Variance matrix — categorías × meses YTD 2026.
 * Cada celda: { actual, budget } en CLP.
 */
export const mockVarianceRows: VarianceRow[] = [
  {
    category: 'Personal',
    cells: [
      { actual: 6_200_000, budget: 6_300_000 },
      { actual: 6_350_000, budget: 6_300_000 },
      { actual: 6_300_000, budget: 6_300_000 },
      { actual: 6_362_500, budget: 6_300_000 },
      { actual: 6_500_000, budget: 6_300_000 },
      { actual: 6_400_000, budget: 6_300_000 },
    ],
  },
  {
    category: 'Tecnología',
    cells: [
      { actual: 2_800_000, budget: 2_800_000 },
      { actual: 3_100_000, budget: 2_800_000 },
      { actual: 3_400_000, budget: 2_800_000 },
      { actual: 3_710_000, budget: 2_800_000 },
      { actual: 3_950_000, budget: 2_800_000 },
      { actual: 3_700_000, budget: 2_800_000 },
    ],
  },
  {
    category: 'Marketing',
    cells: [
      { actual: 1_000_000, budget: 1_100_000 },
      { actual: 950_000, budget: 1_100_000 },
      { actual: 1_180_000, budget: 1_100_000 },
      { actual: 1_060_000, budget: 1_100_000 },
      { actual: 980_000, budget: 1_100_000 },
      { actual: 1_120_000, budget: 1_100_000 },
    ],
  },
  {
    category: 'Servicios',
    cells: [
      { actual: 1_580_000, budget: 1_600_000 },
      { actual: 1_620_000, budget: 1_600_000 },
      { actual: 1_590_000, budget: 1_600_000 },
      { actual: 1_590_000, budget: 1_600_000 },
      { actual: 1_610_000, budget: 1_600_000 },
      { actual: 1_595_000, budget: 1_600_000 },
    ],
  },
  {
    category: 'Oficina',
    cells: [
      { actual: 800_000, budget: 800_000 },
      { actual: 805_000, budget: 800_000 },
      { actual: 810_000, budget: 800_000 },
      { actual: 795_000, budget: 800_000 },
      { actual: 800_000, budget: 800_000 },
      { actual: 800_000, budget: 800_000 },
    ],
  },
  {
    category: 'Otros',
    cells: [
      { actual: 700_000, budget: 750_000 },
      { actual: 720_000, budget: 750_000 },
      { actual: 740_000, budget: 750_000 },
      { actual: 732_500, budget: 750_000 },
      { actual: 690_000, budget: 750_000 },
      { actual: 715_000, budget: 750_000 },
    ],
  },
];

/**
 * Headline KPIs for Budget page.
 */
export const mockBudgetKpis = {
  presupuestoYTD: 81_500_000,
  realYTD: 86_870_000,
  variacionYTD: 5_370_000,
  variacionPctYTD: 6.6,
  categoriasEnRiesgo: 1, // Tecnología
  mesPeorDesempeno: { mes: 'Mayo', variacion: 12.4 },
};
