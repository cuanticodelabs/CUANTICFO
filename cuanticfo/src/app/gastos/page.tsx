'use client';

import AppShell from '@/components/layout/AppShell';
import { mockGastos } from '@/lib/mock-data/movimientos';
import { formatCLP, formatDate, cn } from '@/lib/utils/format';
import { Plus, Search, CheckCircle, XCircle } from 'lucide-react';

const estadoBadge: Record<string, string> = {
  pagado:    'badge-green',
  pendiente: 'badge-orange',
  vencido:   'badge-red',
};

export default function GastosPage() {
  const total = mockGastos.reduce((s, g) => s + g.total, 0);
  const pagados = mockGastos.filter(g => g.estado_pago === 'pagado').reduce((s, g) => s + g.total, 0);
  const pendientes = mockGastos.filter(g => g.estado_pago !== 'pagado').reduce((s, g) => s + g.total, 0);

  return (
    <AppShell title="Gastos" subtitle="Facturas recibidas y compras del período">
      <div className="p-4 md:p-6 space-y-5 animate-fade-in">

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total gastos', value: total, color: 'text-red-600' },
            { label: 'Pagados', value: pagados, color: 'text-green-600' },
            { label: 'Por pagar', value: pendientes, color: 'text-orange-500' },
          ].map((k) => (
            <div key={k.label} className="card p-4 text-center">
              <p className="text-xs text-slate-500 mb-1">{k.label}</p>
              <p className={`text-lg md:text-xl font-bold ${k.color}`}>{formatCLP(k.value)}</p>
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="flex gap-2 justify-between">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input placeholder="Buscar gasto..." className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 rounded-xl text-sm text-white hover:bg-blue-700">
            <Plus size={15} /> Nuevo gasto
          </button>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Fecha', 'Folio', 'Proveedor', 'Categoría', 'Tipo', 'Neto', 'IVA', 'Total', 'CF', 'Estado'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 px-4 py-3 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mockGastos.map((gasto) => (
                  <tr key={gasto.id} className="hover:bg-slate-50/60 cursor-pointer">
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{formatDate(gasto.fecha_documento, true)}</td>
                    <td className="px-4 py-3 font-semibold text-slate-700">{gasto.folio}</td>
                    <td className="px-4 py-3 text-slate-700">{gasto.proveedor}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{gasto.categoria}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{gasto.tipo_documento.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3 text-slate-700 text-right">{formatCLP(gasto.neto)}</td>
                    <td className="px-4 py-3 text-slate-500 text-right">{formatCLP(gasto.iva)}</td>
                    <td className="px-4 py-3 font-semibold text-red-600 text-right">{formatCLP(gasto.total)}</td>
                    <td className="px-4 py-3 text-center">
                      {gasto.usa_credito_fiscal
                        ? <CheckCircle size={15} className="text-green-500 mx-auto" />
                        : <XCircle size={15} className="text-slate-300 mx-auto" />
                      }
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', estadoBadge[gasto.estado_pago] || 'badge-gray')}>
                        {gasto.estado_pago}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
