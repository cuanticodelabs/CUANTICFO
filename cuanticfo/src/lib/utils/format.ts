// =====================================================
// FORMAT UTILS — CuantiCFO
// =====================================================

/**
 * Formatea un número como moneda chilena (CLP)
 * Ej: 25430000 → "$25.430.000"
 */
export function formatCLP(value: number, compact = false): string {
  if (compact) {
    if (Math.abs(value) >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1).replace('.', ',')}M`;
    }
    if (Math.abs(value) >= 1_000) {
      return `$${(value / 1_000).toFixed(0)}K`;
    }
  }
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formatea un número como porcentaje
 * Ej: 0.182 → "18,2%"
 */
export function formatPct(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1).replace('.', ',')}%`;
}

/**
 * Formatea una fecha ISO a string legible en español
 * Ej: "2026-04-24" → "24 Abr 2026"
 */
export function formatDate(dateStr: string, short = false): string {
  const date = new Date(dateStr + 'T12:00:00');
  if (short) {
    return date.toLocaleDateString('es-CL', { day: '2-digit', month: 'short' });
  }
  return date.toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Convierte "2026-04" → "Abril 2026"
 */
export function formatPeriodo(periodo: string): string {
  const [year, month] = periodo.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });
}

/**
 * Capitaliza primera letra
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Combina classnames (clsx + tailwind-merge)
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
