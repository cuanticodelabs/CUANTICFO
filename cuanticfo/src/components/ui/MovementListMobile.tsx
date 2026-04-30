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
            className={cn(
              'flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors',
              i < movimientos.length - 1 ? 'border-b border-slate-100' : ''
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
                isIngreso ? 'bg-green-50' : 'bg-red-50'
              )}
            >
              {isIngreso ? (
                <TrendingUp size={17} className="text-green-600" />
              ) : (
                <TrendingDown size={17} className="text-red-500" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {mov.documento}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {mov.cliente_proveedor}
              </p>
            </div>

            {/* Right side */}
            <div className="text-right flex-shrink-0">
              <p
                className={cn(
                  'text-sm font-bold',
                  isIngreso ? 'text-slate-900' : 'text-red-600'
                )}
              >
                {formatCLP(mov.monto)}
              </p>
              <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full', estadoBadge[mov.estado] || 'badge-gray')}>
                {estadoLabel[mov.estado] || mov.estado}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
