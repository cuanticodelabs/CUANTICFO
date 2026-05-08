// =====================================================
// MOCK DATA — AI CFO Insights
// Each insight: ONE sentence + sources + suggested actions.
// =====================================================

import type { AiInsight } from '@/components/ui/InsightCard';

export const mockInsights: AiInsight[] = [
  {
    id: 'ins-001',
    severity: 'opportunity',
    message:
      'Tu margen subió 4 puntos este mes por crecimiento en Servicios (+22%); si sostienes el mix, cerrarás el trimestre con 30% de margen vs 26% del Q1.',
    sources: [
      'Ingresos Abr 2026 (categoría Servicios)',
      'Estado de resultados Q1 2026',
      'Cierre Mar 2026',
    ],
    confidence: 0.86,
    updatedAt: 'hace 2 horas',
    actions: [
      { label: 'Ver Estado de resultados', href: '/reportes/estado-resultados' },
      { label: 'Descartar', variant: 'ghost' },
    ],
  },
  {
    id: 'ins-002',
    severity: 'warn',
    message:
      'Tecnología creció 31% YoY sin un alza proporcional de ingresos; revisa el contrato con Google Cloud antes del cierre de mayo.',
    sources: [
      'Gastos Abr 2026 (categoría Tecnología)',
      'Histórico 12 meses',
      'Contrato proveedor #GC-2024',
    ],
    confidence: 0.78,
    updatedAt: 'hace 4 horas',
    actions: [
      { label: 'Ver categoría Tecnología', href: '/gastos?categoria=tecnologia' },
      { label: 'Crear alerta', variant: 'ghost' },
    ],
  },
  {
    id: 'ins-003',
    severity: 'info',
    message:
      'El IVA de mayo vence en 12 días con $2,15M estimados; tu caja de $18,76M cubre el pago sin afectar capital de trabajo.',
    sources: [
      'F29 Abr 2026 (borrador)',
      'Saldos bancarios al 24/04',
      'Calendario tributario SII',
    ],
    confidence: 0.92,
    updatedAt: 'hoy',
    actions: [
      { label: 'Preparar F29', href: '/impuestos/f29' },
    ],
  },
];

/**
 * Featured insight for the dashboard — the single most important one.
 */
export const mockFeaturedInsight: AiInsight = mockInsights[0];
