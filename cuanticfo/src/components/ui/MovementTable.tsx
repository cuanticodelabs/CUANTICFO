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
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 uppercase tracking-wide">
                Fecha
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 uppercase tracking-wide">
                Tipo
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 uppercase tracking-wide">
                Documento
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 uppercase tracking-wide hidden md:table-cell">
                Cliente / Proveedor
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 uppercase tracking-wide hidden lg:table-cell">
                Categoría
              </th>
              <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3 uppercase tracking-wide">
                Monto
              </th>
              <th className="text-center text-xs font-semibold text-slate-500 px-4 py-3 uppercase tracking-wide hidden sm:table-cell">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {movimientos.map((mov) => (
              <tr key={mov.id} className="hover:bg-slate-50/60 transition-colors cursor-pointer">
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-xs">
                  {formatDate(mov.fecha, true)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'text-xs font-semibold',
                      mov.tipo === 'ingreso' ? 'text-green-600' : 'text-red-500'
                    )}
                  >
                    {mov.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700 font-medium whitespace-nowrap">
                  {mov.documento}
                </td>
                <td className="px-4 py-3 text-slate-600 hidden md:table-cell">
                  {mov.cliente_proveedor}
                </td>
                <td className="px-4 py-3 text-slate-500 hidden lg:table-cell">
                  {mov.categoria}
                </td>
                <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                  <span className={mov.monto > 0 ? 'text-slate-900' : 'text-red-600'}>
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
