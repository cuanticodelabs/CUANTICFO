'use client';

import { TrendingUp, TrendingDown, DollarSign, AlertCircle, Banknote, FileText, CreditCard } from 'lucide-react';
import { cn, formatCLP, formatPct } from '@/lib/utils/format';
import type { KpiData } from '@/lib/types';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

function toPoints(data: number[]) {
  return data.map((v) => ({ v }));
}

const iconMap = {
  ingreso: DollarSign,
  gasto: CreditCard,
  resultado: TrendingUp,
  iva: FileText,
  caja: Banknote,
  cobrar: FileText,
  pagar: CreditCard,
  alerta: AlertCircle,
};

const colorMap = {
  ingreso:   { bg: 'var(--color-accent-light)',  icon: 'var(--color-accent)',        text: 'var(--color-accent-dark)'         },
  gasto:     { bg: 'var(--color-expense-light)', icon: 'var(--color-expense)',       text: 'var(--color-expense-dark)'        },
  resultado: { bg: 'var(--color-income-light)',  icon: 'var(--color-income)',        text: 'var(--color-income-dark)'         },
  iva:       { bg: 'var(--color-warning-light)', icon: 'var(--color-alert-medium)',  text: 'var(--color-alert-medium-dark)'   },
  caja:      { bg: 'var(--color-accent-light)',  icon: 'var(--color-accent)',        text: 'var(--color-accent-dark)'         },
  cobrar:    { bg: 'var(--color-cobrar-light)',  icon: 'var(--color-cobrar)',        text: 'var(--color-cobrar-dark)'         },
  pagar:     { bg: 'var(--color-expense-light)', icon: 'var(--color-expense)',       text: 'var(--color-expense-dark)'        },
  alerta:    { bg: 'var(--color-warning-light)', icon: 'var(--color-alert-medium)',  text: 'var(--color-alert-medium-dark)'   },
};

const sparklineColor = {
  ingreso:   'var(--color-accent)',
  gasto:     'var(--color-expense)',
  resultado: 'var(--color-income)',
  iva:       'var(--color-alert-medium)',
  caja:      'var(--color-accent)',
  cobrar:    'var(--color-cobrar)',
  pagar:     'var(--color-expense)',
  alerta:    'var(--color-alert-medium)',
};

interface KpiCardProps {
  kpi: KpiData;
  variant?: 'featured' | 'compact';
  className?: string;
}

export default function KpiCard({ kpi, variant, className }: KpiCardProps) {
  const Icon = iconMap[kpi.tipo] || DollarSign;
  const colors = colorMap[kpi.tipo];
  const sparkColor = sparklineColor[kpi.tipo];
  const isPositive = kpi.variacion_pct >= 0;
  const trendColor = isPositive ? 'var(--color-income)' : 'var(--color-expense)';

  /* ── FEATURED ──────────────────────────────────────────────────────────
   * The primary metric. Large number, label above, sparkline below.
   * No icon circle — the number IS the message.
   */
  if (variant === 'featured') {
    return (
      <div className={cn('card p-6 flex flex-col', className)}>
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.09em]"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {kpi.label}
        </p>

        <p
          className="text-3xl md:text-4xl font-bold tracking-tight leading-none mt-3"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {formatCLP(kpi.value)}
        </p>

        <div className="flex items-center gap-2 mt-2">
          {isPositive ? (
            <TrendingUp size={13} style={{ color: trendColor }} aria-hidden="true" />
          ) : (
            <TrendingDown size={13} style={{ color: trendColor }} aria-hidden="true" />
          )}
          <span className="text-sm font-semibold" style={{ color: trendColor }}>
            {formatPct(kpi.variacion_pct)}
          </span>
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {kpi.variacion_label}
          </span>
        </div>

        {kpi.sparkline && (
          <div className="mt-auto pt-5 h-10 opacity-40">
            <ResponsiveContainer width="100%" height={40}>
              <LineChart data={toPoints(kpi.sparkline)} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
                <Line type="monotone" dataKey="v" stroke={sparkColor} strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  }

  /* ── COMPACT ───────────────────────────────────────────────────────────
   * Supporting context. No card wrapper — parent provides the surface.
   * Abbreviated number, no sparkline, no icon.
   */
  if (variant === 'compact') {
    return (
      <div className={cn('px-5 py-4', className)}>
        <p
          className="text-[11px] mb-1.5"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {kpi.label}
        </p>
        <p
          className="text-xl font-bold leading-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {formatCLP(kpi.value, true)}
        </p>
        <div className="flex items-center gap-1 mt-1">
          {isPositive ? (
            <TrendingUp size={11} style={{ color: trendColor }} aria-hidden="true" />
          ) : (
            <TrendingDown size={11} style={{ color: trendColor }} aria-hidden="true" />
          )}
          <span className="text-xs font-semibold" style={{ color: trendColor }}>
            {formatPct(kpi.variacion_pct)}
          </span>
          <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
            {kpi.variacion_label}
          </span>
        </div>
      </div>
    );
  }

  /* ── DEFAULT ───────────────────────────────────────────────────────────
   * Used outside the main dashboard (other pages, custom lists).
   */
  return (
    <div className={cn('card card-hover p-4', className)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            aria-hidden="true"
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: colors.bg }}
          >
            <Icon size={18} style={{ color: colors.icon }} />
          </div>
          <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            {kpi.label}
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p
            className="text-xl md:text-2xl font-bold leading-tight"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {formatCLP(kpi.value)}
          </p>
          <div className="flex items-center gap-1 mt-1">
            {isPositive ? (
              <TrendingUp size={13} style={{ color: trendColor }} aria-hidden="true" />
            ) : (
              <TrendingDown size={13} style={{ color: trendColor }} aria-hidden="true" />
            )}
            <span className="text-xs font-semibold" style={{ color: trendColor }}>
              {formatPct(kpi.variacion_pct)}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {kpi.variacion_label}
            </span>
          </div>
        </div>

        {kpi.sparkline && (
          <div className="w-20 h-10 opacity-70">
            <ResponsiveContainer width="100%" height={40}>
              <LineChart data={toPoints(kpi.sparkline)} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
                <Line type="monotone" dataKey="v" stroke={sparkColor} strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
