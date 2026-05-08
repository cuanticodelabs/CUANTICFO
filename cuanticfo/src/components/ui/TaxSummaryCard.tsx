'use client';

import { formatCLP, formatPeriodo } from '@/lib/utils/format';
import type { ImpuestoMensual } from '@/lib/types';
import { AlertTriangle } from 'lucide-react';

interface TaxSummaryCardProps {
  data: ImpuestoMensual;
  className?: string;
}

const rows: {
  label: string;
  key: keyof Pick<
    ImpuestoMensual,
    'iva_debito' | 'iva_credito' | 'iva_a_pagar' | 'ppm' | 'retenciones'
  >;
  bold?: boolean;
  hint?: string;
}[] = [
  { label: 'IVA Débito Fiscal', key: 'iva_debito', hint: 'Generado por ventas' },
  { label: 'IVA Crédito Fiscal', key: 'iva_credito', hint: 'Recuperable de compras' },
  { label: 'IVA Determinado', key: 'iva_a_pagar', bold: true },
  { label: 'PPM (1,5%)', key: 'ppm' },
  { label: 'Retenciones honorarios', key: 'retenciones' },
];

export default function TaxSummaryCard({ data, className }: TaxSummaryCardProps) {
  return (
    <div className={`card overflow-hidden ${className ?? ''}`}>
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        <div>
          <h3
            className="text-sm font-semibold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Resumen F29
          </h3>
          <p
            className="text-[11px] mt-0.5"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Cálculo basado en movimientos contabilizados
          </p>
        </div>
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.09em] px-2 py-1 rounded-md tabular"
          style={{
            color: 'var(--color-accent)',
            backgroundColor: 'var(--color-accent-tint)',
            border: '1px solid rgba(212,165,116,0.18)',
          }}
        >
          {formatPeriodo(data.periodo)}
        </span>
      </div>

      {/* Detail rows */}
      <div className="px-6 py-4">
        <div className="space-y-0">
          {rows.map((row, i) => {
            const value = data[row.key];
            const isBold = !!row.bold;
            return (
              <div
                key={row.key}
                className="flex items-baseline justify-between py-2.5"
                style={{
                  borderTop:
                    isBold && i > 0
                      ? '1px solid var(--color-border)'
                      : 'none',
                  marginTop: isBold && i > 0 ? 6 : 0,
                  paddingTop: isBold && i > 0 ? 12 : 10,
                }}
              >
                <div className="min-w-0">
                  <p
                    className="text-sm"
                    style={{
                      color: isBold
                        ? 'var(--color-text-primary)'
                        : 'var(--color-text-secondary)',
                      fontWeight: isBold ? 600 : 400,
                    }}
                  >
                    {row.label}
                  </p>
                  {row.hint && !isBold && (
                    <p
                      className="text-[11px] mt-0.5"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {row.hint}
                    </p>
                  )}
                </div>
                <span
                  className="text-sm font-semibold tabular font-mono whitespace-nowrap"
                  style={{
                    color: isBold
                      ? 'var(--color-text-primary)'
                      : value < 0
                      ? 'var(--color-income)'
                      : 'var(--color-text-secondary)',
                  }}
                >
                  {formatCLP(value)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Total band */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{
          backgroundColor: 'var(--color-accent-tint)',
          borderTop: '1px solid rgba(212,165,116,0.18)',
        }}
      >
        <span
          className="text-sm font-semibold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Total estimado a pagar
        </span>
        <span
          className="text-lg font-bold tabular font-mono"
          style={{ color: 'var(--color-accent)' }}
        >
          {formatCLP(data.total_estimado)}
        </span>
      </div>

      {/* Observations */}
      {data.observaciones && data.observaciones.length > 0 && (
        <div
          className="px-6 py-4 space-y-1.5"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Observaciones ({data.observaciones.length})
          </p>
          {data.observaciones.map((obs, i) => (
            <div
              key={i}
              className="flex items-start gap-2 text-xs px-3 py-2 rounded-lg"
              style={{
                backgroundColor: 'var(--color-warning-tint)',
                border: '1px solid rgba(251,146,60,0.18)',
                color: 'var(--color-warning)',
              }}
            >
              <AlertTriangle
                size={12}
                className="mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <span style={{ color: 'var(--color-text-primary)' }}>{obs}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
