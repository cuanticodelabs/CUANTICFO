'use client';

import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils/format';
import type { Alerta, SeveridadAlerta } from '@/lib/types';

const severityConfig: Record<
  SeveridadAlerta,
  {
    bgVar: string;
    colorVar: string;
    icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
    label: string;
  }
> = {
  alta: {
    bgVar: 'var(--color-expense-tint)',
    colorVar: 'var(--color-expense)',
    icon: AlertCircle,
    label: 'Alta',
  },
  media: {
    bgVar: 'var(--color-warning-tint)',
    colorVar: 'var(--color-warning)',
    icon: AlertTriangle,
    label: 'Media',
  },
  baja: {
    bgVar: 'var(--color-accent-tint)',
    colorVar: 'var(--color-accent)',
    icon: Info,
    label: 'Baja',
  },
};

interface AlertCardProps {
  alerta: Alerta;
  compact?: boolean;
  className?: string;
}

export default function AlertCard({ alerta, compact = false, className }: AlertCardProps) {
  const config = severityConfig[alerta.severidad];
  const Icon = config.icon;

  if (compact) {
    return (
      <div className={cn('flex items-start gap-2.5 py-2.5', className)}>
        <span
          className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: config.colorVar }}
          aria-hidden="true"
        />
        <Icon
          size={14}
          className="mt-0.5 flex-shrink-0"
          style={{ color: config.colorVar }}
        />
        <div className="flex-1 min-w-0">
          <p
            className="text-sm leading-snug"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {alerta.descripcion}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn('p-4 animate-fade-in rounded-xl', className)}
      style={{
        backgroundColor: config.bgVar,
        border: `1px solid ${config.colorVar}33`,
      }}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0" style={{ color: config.colorVar }}>
          <Icon size={17} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-bold uppercase tracking-[0.09em]"
              style={{ color: config.colorVar }}
            >
              {config.label}
            </span>
            <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
              {formatDate(alerta.created_at, true)}
            </span>
          </div>
          <p
            className="text-sm font-medium leading-snug"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {alerta.descripcion}
          </p>
          {alerta.accion_sugerida && (
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              {alerta.accion_sugerida}
            </p>
          )}
        </div>
        <button
          type="button"
          aria-label="Marcar como resuelta"
          className="text-xs flex-shrink-0 mt-0.5 cursor-pointer transition-opacity hover:opacity-70"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <CheckCircle size={15} />
        </button>
      </div>
    </div>
  );
}
