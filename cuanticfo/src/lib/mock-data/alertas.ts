import type { Alerta, ImpuestoMensual, CierreMensual } from '@/lib/types';

// =====================================================
// MOCK — Alertas
// =====================================================
export const mockAlertas: Alerta[] = [
  {
    id: '1',
    empresa_id: '11111111-1111-1111-1111-111111111111',
    periodo: '2026-04',
    tipo: 'caja',
    severidad: 'alta',
    descripcion: 'IVA estimado supera caja disponible. Diferencia: $2.990.000',
    accion_sugerida: 'Revisar flujo de caja y planificar pago de IVA',
    estado: 'activa',
    created_at: '2026-04-24T10:00:00Z',
  },
  {
    id: '2',
    empresa_id: '11111111-1111-1111-1111-111111111111',
    periodo: '2026-04',
    tipo: 'clasificacion',
    severidad: 'media',
    descripcion: '3 facturas de compra sin clasificar',
    accion_sugerida: 'Ir a Gastos y asignar categoría contable',
    estado: 'activa',
    created_at: '2026-04-23T09:00:00Z',
  },
  {
    id: '3',
    empresa_id: '11111111-1111-1111-1111-111111111111',
    periodo: '2026-04',
    tipo: 'cobranza',
    severidad: 'media',
    descripcion: '2 facturas vencidas por cobrar',
    accion_sugerida: 'Contactar a clientes con facturas vencidas',
    estado: 'activa',
    created_at: '2026-04-23T08:30:00Z',
  },
  {
    id: '4',
    empresa_id: '11111111-1111-1111-1111-111111111111',
    periodo: '2026-03',
    tipo: 'cierre',
    severidad: 'baja',
    descripcion: 'Mes de Marzo sin cerrar',
    accion_sugerida: 'Completar checklist de cierre mensual para Marzo',
    estado: 'activa',
    created_at: '2026-04-22T14:00:00Z',
  },
  {
    id: '5',
    empresa_id: '11111111-1111-1111-1111-111111111111',
    periodo: '2026-04',
    tipo: 'documento',
    severidad: 'baja',
    descripcion: 'Documento pendiente por revisar',
    accion_sugerida: 'Revisar documentos sin respaldo en Gastos',
    estado: 'activa',
    created_at: '2026-04-21T11:00:00Z',
  },
  {
    id: '6',
    empresa_id: '11111111-1111-1111-1111-111111111111',
    periodo: '2026-04',
    tipo: 'gasto',
    severidad: 'baja',
    descripcion: 'Gasto en tecnología aumentó 35% vs mes anterior',
    accion_sugerida: 'Revisar detalle de gastos tecnológicos',
    estado: 'activa',
    created_at: '2026-04-20T16:00:00Z',
  },
];

// =====================================================
// MOCK — Impuestos / F29
// =====================================================
export const mockImpuesto: ImpuestoMensual = {
  id: '1',
  empresa_id: '11111111-1111-1111-1111-111111111111',
  periodo: '2026-04',
  iva_debito: 5_450_000,
  iva_credito: -3_300_000,
  iva_a_pagar: 2_150_000,
  ppm: 380_000,
  retenciones: 120_000,
  remanente: 0,
  total_estimado: 2_650_000,
  estado: 'borrador',
  observaciones: [
    '3 facturas de compra sin clasificar',
    '2 facturas sin derecho a crédito',
    '1 documento pendiente por revisar',
  ],
  created_at: '2026-04-01T00:00:00Z',
};

// =====================================================
// MOCK — Cierre Mensual
// =====================================================
export const mockCierre: CierreMensual = {
  id: '1',
  empresa_id: '11111111-1111-1111-1111-111111111111',
  periodo: '2026-04',
  ventas_revisadas: true,
  compras_revisadas: true,
  honorarios_revisados: false,
  banco_conciliado: true,
  impuestos_calculados: true,
  f29_preparado: true,
  reporte_generado: false,
  enviado_contador: false,
  cerrado: false,
};
