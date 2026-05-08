'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn, formatCLP } from '@/lib/utils/format';

type Direction = 'positive' | 'negative' | 'neutral' | 'auto';

interface AmountCellProps {
  value: number;
  direction?: Direction;
  compact?: boolean;
  showIcon?: boolean;
  showSign?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * AmountCell — the canonical way to render any CLP value.
 * Always tabular-nums. Direction encoded with both color AND icon (WCAG AA).
 */
export default function AmountCell({
  value,
  direction = 'auto',
  compact = false,
  showIcon = false,
  showSign = false,
  size = 'md',
  className,
}: AmountCellProps) {
  const dir: Direction =
    direction === 'auto'
      ? value > 0
        ? 'positive'
        : value < 0
        ? 'negative'
        : 'neutral'
      : direction;

  const colorVar =
    dir === 'positive'
      ? 'var(--color-income)'
      : dir === 'negative'
      ? 'var(--color-expense)'
      : 'var(--color-text-primary)';

  const Icon = dir === 'positive' ? TrendingUp : dir === 'negative' ? TrendingDown : Minus;

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }[size];

  const iconSize = size === 'sm' ? 11 : size === 'md' ? 13 : 14;

  const display = formatCLP(Math.abs(value), compact);
  const sign = showSign ? (value > 0 ? '+' : value < 0 ? '−' : '') : '';

  return (
    <span
      className={cn('inline-flex items-center gap-1 font-semibold tabular', sizeClasses, className)}
      style={{ color: colorVar }}
    >
      {showIcon && <Icon size={iconSize} aria-hidden="true" />}
      {sign}
      {display}
    </span>
  );
}
