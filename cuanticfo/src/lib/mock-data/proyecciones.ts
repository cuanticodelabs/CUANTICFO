// =====================================================
// MOCK DATA — Projections (scenario modeling)
// =====================================================

import type { ProjectionPoint } from '@/components/charts/ProjectionChart';

export type ScenarioId = 'base' | 'optimista' | 'pesimista';

export interface ScenarioAssumptions {
  /** Crecimiento mensual de ingresos en % */
  growth: number;
  /** Inflación mensual de gastos en % */
  inflation: number;
  /** DSO en días */
  dso: number;
  /** Nueva contratación: número de personas */
  hires: number;
}

export interface Scenario {
  id: ScenarioId;
  label: string;
  description: string;
  assumptions: ScenarioAssumptions;
  result: {
    runwayMeses: number;
    margenFinalPct: number;
    cajaFinal12m: number;
    riesgo: 'Bajo' | 'Medio' | 'Alto';
  };
}

const months = [
  'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct',
  'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr',
];

/**
 * Compute a 12-month cash projection given assumptions.
 * Mock formula — not a real cash model. Just enough to make the sliders react.
 */
function projectCash(
  initial: number,
  monthlyIncome: number,
  monthlyExpense: number,
  a: ScenarioAssumptions
): ProjectionPoint[] {
  return months.map((m, i) => {
    const growthFactor = Math.pow(1 + a.growth / 100, i);
    const inflationFactor = Math.pow(1 + a.inflation / 100, i);
    const dsoEffect = 1 - (a.dso - 30) / 365; // DSO higher = slightly less cash sooner
    const hireCost = a.hires * 1_500_000 * (i + 1); // each hire costs $1,5M/mo cumulative

    const income = monthlyIncome * growthFactor * dsoEffect;
    const expense = monthlyExpense * inflationFactor + hireCost / Math.max(i + 1, 1);
    const net = income - expense;
    const cumulative = initial + net * (i + 1);

    // Confidence band widens with horizon
    const spread = cumulative * (0.08 + 0.015 * i);
    return {
      month: m,
      value: Math.round(cumulative),
      low: Math.round(cumulative - spread),
      high: Math.round(cumulative + spread),
    };
  });
}

const initialCash = 18_760_000;
const baseIncome = 25_430_000;
const baseExpense = 13_250_000;

const baseAssumptions: ScenarioAssumptions = {
  growth: 8,
  inflation: 4,
  dso: 47,
  hires: 0,
};

const optimisticAssumptions: ScenarioAssumptions = {
  growth: 14,
  inflation: 3,
  dso: 38,
  hires: 0,
};

const pessimisticAssumptions: ScenarioAssumptions = {
  growth: 2,
  inflation: 7,
  dso: 60,
  hires: 1,
};

export const mockScenarios: Record<ScenarioId, Scenario> = {
  base: {
    id: 'base',
    label: 'Base',
    description: 'Continuidad del trimestre actual sin cambios estructurales',
    assumptions: baseAssumptions,
    result: {
      runwayMeses: 14.2,
      margenFinalPct: 32,
      cajaFinal12m: 168_400_000,
      riesgo: 'Bajo',
    },
  },
  optimista: {
    id: 'optimista',
    label: 'Optimista',
    description: 'Cierre de 2 cuentas grandes y mejora en cobranza',
    assumptions: optimisticAssumptions,
    result: {
      runwayMeses: 22.6,
      margenFinalPct: 38,
      cajaFinal12m: 254_700_000,
      riesgo: 'Bajo',
    },
  },
  pesimista: {
    id: 'pesimista',
    label: 'Pesimista',
    description: 'Pérdida de cliente top + presión inflacionaria + 1 contratación',
    assumptions: pessimisticAssumptions,
    result: {
      runwayMeses: 7.3,
      margenFinalPct: 18,
      cajaFinal12m: 81_200_000,
      riesgo: 'Medio',
    },
  },
};

/**
 * Compute the projection curve for a scenario, on the fly.
 */
export function projectScenario(s: Scenario): ProjectionPoint[] {
  return projectCash(initialCash, baseIncome, baseExpense, s.assumptions);
}

/** The base curve is reused as `baseline` overlay for non-base views. */
export function baseProjection(): ProjectionPoint[] {
  return projectCash(initialCash, baseIncome, baseExpense, baseAssumptions);
}
