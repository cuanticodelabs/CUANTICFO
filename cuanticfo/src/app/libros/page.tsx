'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { mockIngresos, mockGastos } from '@/lib/mock-data/movimientos';
import { formatCLP, formatDate, cn } from '@/lib/utils/format';
import { Download, FileSpreadsheet } from 'lucide-react';

const libros = ['Libro de ventas', 'Libro de compras', 'Libro de honorarios'];

export default function LibrosPage() {
  const [activeLibro, setActiveLibro] = useState('Libro de ventas');

  const data = activeLibro === 'Libro de ventas' ? mockIngresos : mockGastos;
  const totalNeto = data.reduce((s, d) => s + d.neto, 0);
  const totalIva  = data.reduce((s, d) => s + d.iva, 0);
  const totalMonto = data.reduce((s, d) => s + d.total, 0);

  return (
    <AppShell title="Libros contables" subtitle="Libros de compras, ventas y honorarios del período">
      <div className="p-4 md:p-6 space-y-5 animate-fade-in">

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {libros.map((libro) => (
            <button
              key={libro}
              onClick={() => setActiveLibro(libro)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all border',
                activeLibro === libro
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              )}
            >
              {libro}
            </button>
          ))}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Neto', value: totalNeto },
            { label: 'Total IVA', value: totalIva },
            { label: 'Total Monto', value: totalMonto },
          ].map((k) => (
            <div key={k.label} className="card p-4 text-center">
              <p className="text-xs text-slate-500 mb-1">{k.label}</p>
              <p className="text-lg font-bold text-slate-900">{formatCLP(k.value)}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 bg-white hover:bg-slate-50">
            <FileSpreadsheet size={15} /> Exportar Excel
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 bg-white hover:bg-slate-50">
            <Download size={15} /> Exportar PDF
          </button>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['N°', 'Fecha', 'Folio', activeLibro === 'Libro de ventas' ? 'Cliente' : 'Proveedor', 'Tipo Doc.', 'Neto', 'IVA', 'Exento', 'Total'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 px-4 py-3 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.map((row, i) => (
                  <tr key={row.id} className="hover:bg-slate-50/60 cursor-pointer">
                    <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                      {formatDate('fecha_emision' in row ? row.fecha_emision : row.fecha_documento, true)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-blue-600">{row.folio}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {'cliente' in row ? row.cliente : row.proveedor}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{row.tipo_documento.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{formatCLP(row.neto)}</td>
                    <td className="px-4 py-3 text-right text-slate-500">{formatCLP(row.iva)}</td>
                    <td className="px-4 py-3 text-right text-slate-500">{formatCLP(row.exento)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900">{formatCLP(row.total)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 border-t-2 border-slate-200 font-bold">
                  <td colSpan={5} className="px-4 py-3 text-sm text-slate-700">TOTALES</td>
                  <td className="px-4 py-3 text-right text-slate-900">{formatCLP(totalNeto)}</td>
                  <td className="px-4 py-3 text-right text-slate-900">{formatCLP(totalIva)}</td>
                  <td className="px-4 py-3 text-right text-slate-900">$0</td>
                  <td className="px-4 py-3 text-right text-slate-900">{formatCLP(totalMonto)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
