'use client';

import { AlertTriangle, AlertCircle, Info, CheckCircle, Clock } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils/format';
import type { Alerta, SeveridadAlerta } from '@/lib/types';

const severityConfig: Record<SeveridadAlerta, {
  bg: string; text: string; icon: React.ComponentType<any>; label: string;
}> = {
  alta:  { bg: 'bg-red-50',    text: 'text-red-600',    icon: AlertCircle,   label: 'Alta' },
  media: { bg: 'bg-orange-50', text: 'text-orange-600', icon: AlertTriangle, label: 'Media' },
  baja:  { bg: 'bg-blue-50',   text: 'text-blue-600',   icon: Info,          label: 'Baja' },
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
      <div className={cn('flex items-start gap-2 py-2', className)}>
        <Icon size={16} className={cn('mt-0.5 flex-shrink-0', config.text)} />
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-snug" style={{ color: 'var(--color-text-contrast)' }}>{alerta.descripcion}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'card p-4 animate-fade-in',
        config.bg,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('mt-0.5 flex-shrink-0', config.text)}>
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('text-xs font-bold uppercase tracking-wide', config.text)}>
              {config.label}
            </span>
            <span className="text-xs text-slate-400">
              {formatDate(alerta.created_at, true)}
            </span>
          </div>
          <p className="text-sm font-medium leading-snug" style={{ color: 'var(--color-text-primary)' }}>
            {alerta.descripcion}
          </p>
          {alerta.accion_sugerida && (
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>{alerta.accion_sugerida}</p>
          )}
        </div>
        <button className="text-xs flex-shrink-0 mt-0.5 hover:opacity-70" style={{ color: 'var(--color-text-muted)' }}>
          <CheckCircle size={16} />
        </button>
      </div>
    </div>
  );
}
