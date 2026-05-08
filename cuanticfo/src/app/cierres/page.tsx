'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import ClosePeriodChecklist from '@/components/ui/ClosePeriodChecklist';
import { mockCierre } from '@/lib/mock-data/alertas';
import type { CierreMensual } from '@/lib/types';
import {
  Lock,
  AlertTriangle,
  Camera,
  FileDown,
  CheckCircle,
  Info,
} from 'lucide-react';

export default function CierresPage() {
  const [cierre, setCierre] = useState<CierreMensual>(mockCierre);

  const handleToggle = (key: string, value: boolean) => {
    setCierre((prev) => ({ ...prev, [key]: value }));
  };

  const checklistKeys = Object.entries(cierre).filter(
    ([k]) => !['id', 'empresa_id', 'periodo', 'cerrado_por', 'cerrado_at'].includes(k)
  );
  const completed = checklistKeys.filter(([, v]) => v === true).length;
  const total = checklistKeys.length;
  const allDone = completed === total;

  return (
    <AppShell
      title="Cierre mensual"
      subtitle="Proceso de cierre contable · Abril 2026"
    >
      <div className="px-4 md:px-8 py-6 md:py-8 animate-fade-in space-y-6">
        {/* Status row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            className="flex items-center gap-4 text-xs"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: allDone
                    ? 'var(--color-income)'
                    : 'var(--color-warning)',
                }}
                aria-hidden="true"
              />
              <span className="tabular">
                {completed} de {total}
              </span>{' '}
              pasos completados
            </span>
            <span style={{ color: 'var(--color-border-strong)' }}>·</span>
            <span>
              {allDone ? 'Listo para cerrar' : 'Cierre el 30 de Abril'}
            </span>
          </div>
        </div>

        {/* Warning when not complete */}
        {!allDone && (
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
              Completa todos los pasos del checklist antes de cerrar el mes.
              El cierre{' '}
              <strong style={{ color: 'var(--color-warning)' }}>
                bloqueará ediciones
              </strong>{' '}
              en el período.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Checklist */}
          <ClosePeriodChecklist cierre={cierre} onToggle={handleToggle} />

          {/* Right column */}
          <div className="space-y-4">
            {/* Actions */}
            <div className="card p-5">
              <h3
                className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-4"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Acciones de cierre
              </h3>
              <div className="space-y-2">
                <button
                  type="button"
                  disabled={!allDone}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-opacity cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                  style={{
                    color: allDone
                      ? 'var(--color-app-bg)'
                      : 'var(--color-text-muted)',
                    background: allDone
                      ? 'linear-gradient(135deg, var(--color-income) 0%, var(--color-income-dark) 100%)'
                      : 'rgba(255,255,255,0.04)',
                    border: allDone ? 'none' : '1px solid var(--color-border)',
                  }}
                >
                  <Lock size={14} aria-hidden="true" />
                  Cerrar mes y bloquear período
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
                  <Camera size={14} aria-hidden="true" />
                  Generar snapshot financiero
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
                  <FileDown size={14} aria-hidden="true" />
                  Exportar reporte del período
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="card p-5">
              <h4
                className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-3"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Al cerrar el mes
              </h4>
              <ul className="space-y-2.5 text-sm">
                <InfoItem ok>
                  Se bloquean ediciones en movimientos del período
                </InfoItem>
                <InfoItem ok>
                  Se genera un snapshot financiero inmutable
                </InfoItem>
                <InfoItem ok>
                  Los ajustes posteriores quedan con trazabilidad
                </InfoItem>
                <InfoItem>
                  Los libros contables quedan como referencia oficial
                </InfoItem>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function InfoItem({ children, ok }: { children: React.ReactNode; ok?: boolean }) {
  const Icon = ok ? CheckCircle : Info;
  const color = ok ? 'var(--color-income)' : 'var(--color-accent)';
  return (
    <li className="flex items-start gap-2.5">
      <Icon
        size={14}
        style={{ color }}
        className="mt-0.5 flex-shrink-0"
        aria-hidden="true"
      />
      <span style={{ color: 'var(--color-text-secondary)' }}>{children}</span>
    </li>
  );
}
