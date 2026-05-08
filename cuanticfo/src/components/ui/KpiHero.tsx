'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn, formatCLP, formatPct } from '@/lib/utils/format';
import Sparkline from '@/components/charts/Sparkline';
import TraceTooltip from './TraceTooltip';

interface KpiHeroProps {
  label: string;
  value: number;
  variacion_pct: number;
  variacion_label: string;
  sparkline?: number[];
  /** Optional secondary metric line, e.g., "Margen 32%" or "Runway 8.4 meses". */
  secondary?: { label: string; value: string };
  /** Whether trend "good" direction is up (default) or down (e.g., DSO is good when down). */
  goodDirection?: 'up' | 'down';
  /** Provenance — sources for the value. */
  sources?: string[];
  className?: string;
}

/**
 * KpiHero — primary metric. The number IS the message.
 * 48px display, tabular figures, sparkline anchored bottom.
 * Used only for "Resultado del mes" and "Caja" — the two questions the dashboard answers.
 */
export default function KpiHero({
  label,
  value,
  variacion_pct,
  variacion_label,
  sparkline,
  secondary,
  goodDirection = 'up',
  sources,
  className,
}: KpiHeroProps) {
  const isPositive = variacion_pct > 0;
  const isNegative = variacion_pct < 0;
  const isGood =
    goodDirection === 'up' ? variacion_pct >= 0 : variacion_pct <= 0;
  const trendColor = isGood
    ? 'var(--color-income)'
    : 'var(--color-expense)';
  const TrendIcon = isPositive
    ? TrendingUp
    : isNegative
    ? TrendingDown
    : Minus;

  const sparkColor = isGood ? 'var(--color-income)' : 'var(--color-expense)';

  return (
    <div className={cn('card p-6 flex flex-col h-full', className)}>
      <div className="flex items-center gap-2">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.09em]"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {label}
        </p>
        {sources && sources.length > 0 && <TraceTooltip sources={sources} />}
      </div>

      <p
        className="text-4xl md:text-5xl font-bold tracking-tight leading-none mt-3 tabular"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {formatCLP(value)}
      </p>

      <div className="flex items-center gap-2 mt-3">
        <TrendIcon size={14} style={{ color: trendColor }} aria-hidden="true" />
        <span
          className="text-sm font-semibold tabular"
          style={{ color: trendColor }}
        >
          {formatPct(variacion_pct)}
        </span>
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {variacion_label}
        </span>
      </div>

      {secondary && (
        <div
          className="mt-4 pt-4 flex items-baseline gap-2"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.09em]"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {secondary.label}
          </span>
          <span
            className="text-sm font-semibold tabular"
            style={{ color: 'var(--color-accent)' }}
          >
            {secondary.value}
          </span>
        </div>
      )}

      {sparkline && sparkline.length > 0 && (
        <div className="mt-auto pt-5">
          <Sparkline
            data={sparkline}
            color={sparkColor}
            height={40}
            ariaLabel={`Tendencia de ${label}`}
          />
        </div>
      )}
    </div>
  );
}
