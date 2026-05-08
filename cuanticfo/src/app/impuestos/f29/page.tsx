'use client';

import AppShell from '@/components/layout/AppShell';
import TaxSummaryCard from '@/components/ui/TaxSummaryCard';
import { mockImpuesto } from '@/lib/mock-data/alertas';
import {
  Download,
  Send,
  CheckCircle,
  AlertTriangle,
  Receipt,
} from 'lucide-react';

const checklistItems = [
  { label: 'Libro de ventas cuadrado', ok: true },
  { label: 'Libro de compras cuadrado', ok: true },
  { label: 'Sin facturas sin clasificar', ok: false },
  { label: 'Sin documentos observados', ok: false },
  { label: 'PPM calculado correctamente', ok: true },
  { label: 'Retenciones honorarios calculadas', ok: true },
];

export default function F29Page() {
  const ready = checklistItems.every((c) => c.ok);
  const pending = checklistItems.filter((c) => !c.ok).length;

  return (
    <AppShell
      title="Preparador F29"
      subtitle="Pre-declaración IVA y PPM · Abril 2026"
    >
      <div className="px-4 md:px-8 py-6 md:py-8 animate-fade-in space-y-6">
        {/* Status row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            className="flex items-center gap-4 text-xs"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span className="flex items-center gap-2">
              <Receipt size={12} aria-hidden="true" />
              Vence en{' '}
              <span
                className="font-semibold tabular"
                style={{ color: 'var(--color-text-primary)' }}
              >
                12 días
              </span>
            </span>
            <span style={{ color: 'var(--color-border-strong)' }}>·</span>
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: ready
                    ? 'var(--color-income)'
                    : 'var(--color-warning)',
                }}
                aria-hidden="true"
              />
              {ready ? 'Listo para declarar' : `${pending} observaciones`}
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <div
          className="rounded-xl p-4 flex items-start gap-3"
          style={{
            backgroundColor: 'var(--color-warning-tint)',
            border: '1px solid rgba(251,146,60,0.18)',
          }}
          role="status"
        >
          <AlertTriangle
            size={16}
            style={{ color: 'var(--color-warning)' }}
            className="mt-0.5 flex-shrink-0"
            aria-hidden="true"
          />
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Este resumen es una{' '}
            <strong style={{ color: 'var(--color-warning)' }}>
              estimación referencial
            </strong>{' '}
            basada en los movimientos registrados. No constituye una declaración
            oficial — revisa con tu contador antes de declarar en el SII.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* F29 summary */}
          <TaxSummaryCard data={mockImpuesto} />

          {/* Right column: checklist + actions */}
          <div className="space-y-4">
            {/* Checklist */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-[10px] font-semibold uppercase tracking-[0.12em]"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Checklist pre-declaración SII
                </h3>
                <span
                  className="text-[10px] font-semibold tabular px-1.5 py-0.5 rounded"
                  style={{
                    color: ready
                      ? 'var(--color-income)'
                      : 'var(--color-warning)',
                    backgroundColor: ready
                      ? 'var(--color-income-tint)'
                      : 'var(--color-warning-tint)',
                  }}
                >
                  {checklistItems.filter((c) => c.ok).length}/
                  {checklistItems.length}
                </span>
              </div>
              <ul className="space-y-2">
                {checklistItems.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center gap-2.5 text-sm"
                  >
                    {item.ok ? (
                      <CheckCircle
                        size={14}
                        style={{ color: 'var(--color-income)' }}
                        className="flex-shrink-0"
                        aria-hidden="true"
                      />
                    ) : (
                      <AlertTriangle
                        size={14}
                        style={{ color: 'var(--color-warning)' }}
                        className="flex-shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    <span
                      style={{
                        color: item.ok
                          ? 'var(--color-text-secondary)'
                          : 'var(--color-text-primary)',
                      }}
                    >
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="card p-5">
              <h3
                className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-4"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Acciones
              </h3>
              <div className="space-y-2">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90"
                  style={{
                    color: 'var(--color-app-bg)',
                    background:
                      'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
                  }}
                >
                  <Download size={14} aria-hidden="true" />
                  Descargar respaldo F29
                </button>
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                  style={{
                    color: 'var(--color-text-secondary)',
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <Send size={14} aria-hidden="true" />
                  Enviar al contador
                </button>
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                  style={{
                    color: 'var(--color-income)',
                    backgroundColor: 'var(--color-income-tint)',
                    border: '1px solid rgba(74,222,128,0.2)',
                  }}
                >
                  <CheckCircle size={14} aria-hidden="true" />
                  Marcar como declarado
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
