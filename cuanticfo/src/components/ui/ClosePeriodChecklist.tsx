'use client';

import { cn } from '@/lib/utils/format';
import type { CierreMensual } from '@/lib/types';
import { Check, Clock, Lock } from 'lucide-react';

interface ChecklistItem {
  label: string;
  key: keyof Omit<CierreMensual, 'id' | 'empresa_id' | 'periodo' | 'cerrado_por' | 'cerrado_at'>;
}

const checklistItems: ChecklistItem[] = [
  { label: 'Ventas revisadas',      key: 'ventas_revisadas' },
  { label: 'Compras revisadas',     key: 'compras_revisadas' },
  { label: 'Honorarios revisados',  key: 'honorarios_revisados' },
  { label: 'Banco conciliado',      key: 'banco_conciliado' },
  { label: 'IVA calculado',         key: 'impuestos_calculados' },
  { label: 'F29 preparado',         key: 'f29_preparado' },
  { label: 'Reportes generados',    key: 'reporte_generado' },
  { label: 'Enviado al contador',   key: 'enviado_contador' },
  { label: 'Mes cerrado',           key: 'cerrado' },
];

interface ClosePeriodChecklistProps {
  cierre: CierreMensual;
  onToggle?: (key: string, value: boolean) => void;
  className?: string;
}

export default function ClosePeriodChecklist({
  cierre,
  onToggle,
  className,
}: ClosePeriodChecklistProps) {
  const completed = checklistItems.filter((i) => cierre[i.key]).length;
  const total = checklistItems.length;
  const pct = Math.round((completed / total) * 100);

  return (
    <div className={cn('card p-5', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Checklist cierre mensual</h3>
        {cierre.cerrado && (
          <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-full">
            <Lock size={11} /> Cerrado
          </span>
        )}
      </div>

      {/* Progress circle */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
            <circle cx="18" cy="18" r="15" fill="none" stroke="var(--color-border)" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15"
              fill="none"
              stroke={pct === 100 ? 'var(--color-income)' : 'var(--color-accent)'}
              strokeWidth="3"
              strokeDasharray={`${(pct / 100) * 94.25} 94.25`}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{pct}%</span>
          </div>
        </div>
        <div>
          <p className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{completed} de {total}</p>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>completadas</p>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-1.5">
        {checklistItems.map((item) => {
          const done = !!cierre[item.key];
          return (
            <button
              key={item.key}
              onClick={() => onToggle?.(item.key, !done)}
              className="w-full flex items-center gap-2.5 text-left hover:bg-slate-50 px-1.5 py-1 rounded-lg transition-colors"
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-colors"
                style={{
                  backgroundColor: done ? 'var(--color-income)' : 'var(--color-card)',
                  borderColor: done ? 'var(--color-income)' : 'var(--color-border)',
                }}
              >
                {done && <Check size={11} className="text-white" strokeWidth={3} />}
              </div>
              <span
                className="text-sm flex-1"
                style={{ color: done ? 'var(--color-text-muted)' : 'var(--color-text-contrast)', textDecoration: done ? 'line-through' : 'none' }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
