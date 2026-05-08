'use client';

import { cn, formatCLP, formatDate } from '@/lib/utils/format';
import type { Movimiento } from '@/lib/types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MovementListMobileProps {
  movimientos: Movimiento[];
  className?: string;
}

const estadoBadge: Record<string, string> = {
  cobrado: 'badge-green',
  pagado:  'badge-green',
  pendiente: 'badge-orange',
  vencido:   'badge-red',
};

const estadoLabel: Record<string, string> = {
  cobrado: 'Pagado',
  pagado:  'Pagado',
  pendiente: 'Pendiente',
  vencido:   'Vencido',
};

export default function MovementListMobile({ movimientos, className }: MovementListMobileProps) {
  return (
    <div className={cn('space-y-0', className)}>
      {movimientos.map((mov, i) => {
        const isIngreso = mov.tipo === 'ingreso';
        return (
          <div
            key={mov.id}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
            style={{
              borderBottom: i < movimientos.length - 1 ? '1px solid var(--color-border)' : 'none',
            }}
          >
            {/* Icon */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: isIngreso
                  ? 'var(--color-income-tint)'
                  : 'var(--color-expense-tint)',
                border: `1px solid ${isIngreso ? 'rgba(74,222,128,0.18)' : 'rgba(248,113,113,0.18)'}`,
              }}
            >
              {isIngreso ? (
                <TrendingUp size={17} style={{ color: 'var(--color-income)' }} />
              ) : (
                <TrendingDown size={17} style={{ color: 'var(--color-expense)' }} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-semibold truncate"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {mov.documento}
              </p>
              <p
                className="text-xs truncate"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {mov.cliente_proveedor}
              </p>
            </div>

            {/* Right side */}
            <div className="text-right flex-shrink-0">
              <p
                className="text-sm font-bold tabular"
                style={{
                  color: isIngreso
                    ? 'var(--color-text-primary)'
                    : 'var(--color-expense)',
                }}
              >
                {formatCLP(mov.monto)}
              </p>
              <span
                className={cn(
                  'text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
                  estadoBadge[mov.estado] || 'badge-gray'
                )}
              >
                {estadoLabel[mov.estado] || mov.estado}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
