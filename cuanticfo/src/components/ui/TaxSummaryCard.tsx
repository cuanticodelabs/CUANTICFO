'use client';

import { formatCLP } from '@/lib/utils/format';
import type { ImpuestoMensual } from '@/lib/types';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface TaxSummaryCardProps {
  data: ImpuestoMensual;
  className?: string;
}

const rows = [
  { label: 'IVA Débito Fiscal', key: 'iva_debito' as const, positive: true },
  { label: 'IVA Crédito Fiscal', key: 'iva_credito' as const, positive: false },
  { label: 'IVA Determinado', key: 'iva_a_pagar' as const, bold: true },
  { label: 'PPM (1,5%)', key: 'ppm' as const },
  { label: 'Retenciones', key: 'retenciones' as const },
];

export default function TaxSummaryCard({ data, className }: TaxSummaryCardProps) {
  return (
    <div className={`card p-5 ${className || ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          Resumen de impuestos
        </h3>
        <span className="text-xs px-2 py-1 rounded-lg capitalize" style={{ color: 'var(--color-text-muted)', backgroundColor: 'var(--color-app-bg)' }}>
          {data.periodo}
        </span>
      </div>

      <div className="space-y-2">
        {rows.map((row) => {
          const value = data[row.key];
          return (
            <div
              key={row.key}
              className={`flex justify-between items-center py-1.5 ${
                row.bold ? 'border-t border-slate-100 mt-1 pt-2.5' : ''
              }`}
            >
              <span
                className={`text-sm ${row.bold ? 'font-semibold' : ''}`}
                style={{ color: row.bold ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}
              >
                {row.label}
              </span>
              <span
                className="text-sm font-semibold"
                style={{ color: row.bold ? 'var(--color-text-primary)' : value < 0 ? 'var(--color-income)' : 'var(--color-text-primary)' }}
              >
                {formatCLP(value)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-3 pt-3 flex justify-between items-center -mx-5 -mb-5 px-5 py-3 rounded-b-xl" style={{ borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-accent-light)' }}>
        <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Total estimado a pagar</span>
        <span className="text-base font-bold" style={{ color: 'var(--color-accent)' }}>
          {formatCLP(data.total_estimado)}
        </span>
      </div>

      {/* Observaciones */}
      {data.observaciones && data.observaciones.length > 0 && (
        <div className="mt-4 space-y-1.5">
          {data.observaciones.map((obs, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg">
              <AlertTriangle size={13} className="mt-0.5 flex-shrink-0 text-amber-500" />
              {obs}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
