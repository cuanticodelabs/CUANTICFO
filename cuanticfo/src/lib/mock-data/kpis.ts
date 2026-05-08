// =====================================================
// MOCK DATA — KPI Monitoring
// =====================================================

import type { KpiMonitorData } from '@/components/ui/KpiMonitorRow';

export const mockKpiMonitor: KpiMonitorData[] = [
  {
    id: 'kpi-margen',
    label: 'Margen operacional',
    display: '32%',
    sparkline: [26, 28, 27, 29, 30, 31, 32],
    target: '≥ 25%',
    status: 'on-target',
    group: 'Rentabilidad',
    trend: 'good',
  },
  {
    id: 'kpi-margen-bruto',
    label: 'Margen bruto',
    display: '61%',
    sparkline: [58, 59, 60, 60, 61, 60, 61],
    target: '≥ 55%',
    status: 'on-target',
    group: 'Rentabilidad',
    trend: 'good',
  },
  {
    id: 'kpi-dso',
    label: 'DSO (días para cobrar)',
    display: '47 días',
    sparkline: [55, 53, 52, 50, 48, 47, 47],
    target: '≤ 45 días',
    status: 'near-target',
    group: 'Liquidez',
    trend: 'good',
  },
  {
    id: 'kpi-liquidez',
    label: 'Ratio de liquidez',
    display: '2,1×',
    sparkline: [1.7, 1.8, 1.9, 2.0, 2.0, 2.1, 2.1],
    target: '≥ 1,5×',
    status: 'on-target',
    group: 'Liquidez',
    trend: 'good',
  },
  {
    id: 'kpi-burn',
    label: 'Burn rate',
    display: '$13,2M/mo',
    sparkline: [12.0, 12.4, 12.8, 13.0, 13.1, 13.2, 13.2],
    target: '≤ $14,0M',
    status: 'on-target',
    group: 'Eficiencia',
    trend: 'bad',
  },
  {
    id: 'kpi-runway',
    label: 'Días de caja (runway)',
    display: '8,4 meses',
    sparkline: [10.2, 9.8, 9.4, 9.0, 8.8, 8.5, 8.4],
    target: '≥ 6,0 meses',
    status: 'on-target',
    group: 'Liquidez',
    trend: 'bad',
  },
  {
    id: 'kpi-concentracion',
    label: 'Concentración top cliente',
    display: '38%',
    sparkline: [32, 33, 34, 35, 36, 37, 38],
    target: '≤ 30%',
    status: 'off-target',
    group: 'Riesgo comercial',
    trend: 'bad',
  },
  {
    id: 'kpi-cac',
    label: 'CAC payback',
    display: '4,2 meses',
    sparkline: [5.1, 4.9, 4.7, 4.5, 4.4, 4.3, 4.2],
    target: '≤ 6,0 meses',
    status: 'on-target',
    group: 'Eficiencia',
    trend: 'good',
  },
];

/**
 * Status counts for the page-header summary strip.
 */
export function summarizeKpiStatus(kpis: KpiMonitorData[] = mockKpiMonitor) {
  return kpis.reduce(
    (acc, k) => {
      acc[k.status] += 1;
      return acc;
    },
    { 'on-target': 0, 'near-target': 0, 'off-target': 0 } as Record<
      KpiMonitorData['status'],
      number
    >
  );
}
