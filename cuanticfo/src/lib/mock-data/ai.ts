// =====================================================
// MOCK DATA — AI CFO (chat surface)
// =====================================================

import type { ChatThread } from '@/components/ai/ThreadList';
import type { ChatMessageData } from '@/components/ai/ChatMessage';

export const mockThreads: ChatThread[] = [
  {
    id: 't-001',
    title: 'Margen y mix de productos en abril',
    when: 'Hoy',
    preview: 'Tu margen subió 4 puntos por crecimiento en Servicios…',
  },
  {
    id: 't-002',
    title: 'Pronóstico de caja Q2',
    when: 'Hoy',
    preview: 'Caja mínima en S28 con $12,8M; margen $2,8M sobre el mínimo…',
  },
  {
    id: 't-003',
    title: 'Spike de Tecnología',
    when: 'Ayer',
    preview: 'Google Cloud explica $3,4M del gap; renegociar en agosto.',
  },
  {
    id: 't-004',
    title: 'Cierre de marzo · cabos sueltos',
    when: 'Esta semana',
    preview: 'Faltan honorarios por revisar y enviar al contador.',
  },
  {
    id: 't-005',
    title: 'F29 abril · borrador',
    when: 'Esta semana',
    preview: 'IVA estimado de $2,15M con 3 facturas pendientes…',
  },
  {
    id: 't-006',
    title: 'Concentración de clientes',
    when: 'Mes pasado',
    preview: 'Top cliente representa 38% de ingresos — sobre objetivo 30%.',
  },
];

export const mockSuggestions: string[] = [
  '¿Por qué subió Tecnología en abril?',
  'Proyecta mi caja a 6 meses',
  'Compárame con el Q1',
  '¿Estoy listo para cerrar abril?',
];

/**
 * Sample conversation for the active thread (t-001 — Margen y mix de productos).
 * Demonstrates: paragraph breaks, embedded KPI, embedded table, citations, trace.
 */
export const mockConversation: ChatMessageData[] = [
  {
    id: 'm-1',
    role: 'assistant',
    text: 'Hola Julio. Vi tu cierre de abril. ¿Querés que repase el resultado, o vamos directo a algún tema en particular?',
    timestamp: 'hace 4 min',
  },
  {
    id: 'm-2',
    role: 'user',
    text: '¿Por qué subió tanto el margen este mes?',
  },
  {
    id: 'm-3',
    role: 'assistant',
    text:
      'Tu margen operacional pasó de 28% en marzo a 32% en abril. La causa principal es un cambio favorable en el mix de productos: Servicios creció +22% mes a mes y representa ahora el 35% de los ingresos.\n\nServicios tiene el margen más alto de tu portafolio (≈48%), por lo que cada peso adicional de Servicios suma más al resultado que un peso de Insumos o Marketing. Si sostienes el mix, el Q2 cerraría con margen alrededor del 30% vs 26% del Q1.',
    embed: {
      type: 'kpi',
      label: 'Margen operacional Abril',
      value: '32%',
      delta: { value: '+4 pp vs Marzo', direction: 'up' },
    },
    citations: [
      {
        id: 'c-1',
        kind: 'period',
        label: 'Estado de resultados',
        period: 'Abr 2026',
        href: '/reportes/estado-resultados',
      },
      {
        id: 'c-2',
        kind: 'table',
        label: 'Ingresos por categoría',
        period: 'Abr 2026',
        href: '/ingresos',
      },
      {
        id: 'c-3',
        kind: 'period',
        label: 'Comparativo Q1 vs Q2',
        href: '/reportes/estado-resultados',
      },
    ],
    sources: [
      'Estado de resultados Abr 2026',
      'Ingresos por categoría Abr 2026',
      'Histórico margen 12 meses',
    ],
    confidence: 0.86,
    timestamp: 'hace 3 min',
  },
  {
    id: 'm-4',
    role: 'user',
    text: 'OK, pero ¿hay algo que esté empujando el margen hacia abajo que deba vigilar?',
  },
  {
    id: 'm-5',
    role: 'assistant',
    text:
      'Sí. Tecnología es la categoría que más viene presionando. Subió 31% YoY sin un alza proporcional de ingresos, y ya excede el presupuesto YTD en +41%.\n\nDe ese gap, $3,4M se explican por el contrato vigente con Google Cloud. El contrato vence en agosto — buen momento para renegociar el escalón de uso. Te dejo el desglose mensual:',
    embed: {
      type: 'table',
      headers: ['Mes', 'Real', 'Presupuesto', 'Δ'],
      rows: [
        ['Enero', '$2,8M', '$2,8M', '0%'],
        ['Febrero', '$3,1M', '$2,8M', '+11%'],
        ['Marzo', '$3,4M', '$2,8M', '+21%'],
        ['Abril', '$3,7M', '$2,8M', '+32%'],
        ['Mayo', '$3,9M', '$2,8M', '+41%'],
      ],
    },
    citations: [
      {
        id: 'c-4',
        kind: 'document',
        label: 'Contrato GC-2024',
        href: '/documentos',
      },
      {
        id: 'c-5',
        kind: 'table',
        label: 'Variaciones presupuestarias',
        period: 'YTD 2026',
        href: '/reportes/presupuesto',
      },
      {
        id: 'c-6',
        kind: 'transaction',
        label: 'Gastos Tecnología',
        period: '12 meses',
        href: '/gastos?categoria=tecnologia',
      },
    ],
    sources: [
      'Variaciones presupuestarias YTD 2026',
      'Contrato proveedor #GC-2024',
      'Histórico de uso 12 meses',
    ],
    confidence: 0.84,
    timestamp: 'hace 2 min',
  },
];
