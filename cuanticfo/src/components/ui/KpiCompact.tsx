'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn, formatCLP, formatPct } from '@/lib/utils/format';

interface KpiCompactProps {
  label: string;
  value: number;
  variacion_pct?: number;
  variacion_label?: string;
  /** Show abbreviated value ($25,4M). Default true. */
  compact?: boolean;
  /** "good" direction for variation color encoding. */
  goodDirection?: 'up' | 'down';
  /** Optional custom value display (overrides CLP formatting — useful for counts). */
  displayValue?: string;
  className?: string;
}

/**
 * KpiCompact — supporting metric, no card wrapper.
 * Lives in a divide-x strip inside one shared card. Three or four max.
 */
export default function KpiCompact({
  label,
  value,
  variacion_pct,
  variacion_label,
  compact = true,
  goodDirection = 'up',
  displayValue,
  className,
}: KpiCompactProps) {
  const hasVar = typeof variacion_pct === 'number';
  const isGood =
    !hasVar
      ? true
      : goodDirection === 'up'
      ? variacion_pct! >= 0
      : variacion_pct! <= 0;
  const trendColor = isGood
    ? 'var(--color-income)'
    : 'var(--color-expense)';

  const TrendIcon =
    !hasVar || variacion_pct === 0
      ? Minus
      : variacion_pct! > 0
      ? TrendingUp
      : TrendingDown;

  return (
    <div className={cn('px-5 py-4', className)}>
      <p
        className="text-[11px] font-semibold uppercase tracking-[0.06em] mb-1.5"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {label}
      </p>
      <p
        className="text-xl font-bold leading-tight tabular"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {displayValue ?? formatCLP(value, compact)}
      </p>

      {hasVar && (
        <div className="flex items-center gap-1 mt-1.5">
          <TrendIcon size={11} style={{ color: trendColor }} aria-hidden="true" />
          <span
            className="text-xs font-semibold tabular"
            style={{ color: trendColor }}
          >
            {formatPct(variacion_pct!)}
          </span>
          {variacion_label && (
            <span
              className="text-[11px]"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {variacion_label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
