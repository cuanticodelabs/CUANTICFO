'use client';

import { cn, formatCLP, formatDate } from '@/lib/utils/format';
import type { Movimiento } from '@/lib/types';
import { TrendingUp, TrendingDown, ArrowLeftRight } from 'lucide-react';

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

interface MovementTableProps {
  movimientos: Movimiento[];
  className?: string;
}

export default function MovementTable({ movimientos, className }: MovementTableProps) {
  return (
    <div className={cn('card overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-app-bg)' }}>
              <th className="text-left text-[11px] font-semibold px-4 py-3 uppercase tracking-[0.07em]" style={{ color: 'var(--color-text-muted)' }}>Fecha</th>
              <th className="text-left text-[11px] font-semibold px-4 py-3 uppercase tracking-[0.07em]" style={{ color: 'var(--color-text-muted)' }}>Tipo</th>
              <th className="text-left text-[11px] font-semibold px-4 py-3 uppercase tracking-[0.07em]" style={{ color: 'var(--color-text-muted)' }}>Documento</th>
              <th className="text-left text-[11px] font-semibold px-4 py-3 uppercase tracking-[0.07em] hidden md:table-cell" style={{ color: 'var(--color-text-muted)' }}>Cliente / Proveedor</th>
              <th className="text-left text-[11px] font-semibold px-4 py-3 uppercase tracking-[0.07em] hidden lg:table-cell" style={{ color: 'var(--color-text-muted)' }}>Categoría</th>
              <th className="text-right text-[11px] font-semibold px-4 py-3 uppercase tracking-[0.07em]" style={{ color: 'var(--color-text-muted)' }}>Monto</th>
              <th className="text-center text-[11px] font-semibold px-4 py-3 uppercase tracking-[0.07em] hidden sm:table-cell" style={{ color: 'var(--color-text-muted)' }}>Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {movimientos.map((mov) => (
              <tr key={mov.id} className="hover:bg-slate-50/60 transition-colors cursor-pointer">
                <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {formatDate(mov.fecha, true)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: mov.tipo === 'ingreso' ? 'var(--color-income)' : 'var(--color-expense)' }}
                  >
                    {mov.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium whitespace-nowrap" style={{ color: 'var(--color-text-contrast)' }}>
                  {mov.documento}
                </td>
                <td className="px-4 py-3 hidden md:table-cell" style={{ color: 'var(--color-text-secondary)' }}>
                  {mov.cliente_proveedor}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell" style={{ color: 'var(--color-text-muted)' }}>
                  {mov.categoria}
                </td>
                <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                  <span style={{ color: mov.monto > 0 ? 'var(--color-text-primary)' : 'var(--color-expense)' }}>
                    {formatCLP(mov.monto)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center hidden sm:table-cell">
                  <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', estadoBadge[mov.estado] || 'badge-gray')}>
                    {estadoLabel[mov.estado] || mov.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
