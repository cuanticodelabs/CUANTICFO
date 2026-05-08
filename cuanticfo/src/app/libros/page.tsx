'use client';

import { useState, useMemo } from 'react';
import AppShell from '@/components/layout/AppShell';
import KpiCompact from '@/components/ui/KpiCompact';
import { mockIngresos, mockGastos } from '@/lib/mock-data/movimientos';
import { formatCLP, formatDate, cn } from '@/lib/utils/format';
import { Download, FileSpreadsheet, BookOpen } from 'lucide-react';

const libros = ['Libro de ventas', 'Libro de compras', 'Libro de honorarios'] as const;
type Libro = (typeof libros)[number];

export default function LibrosPage() {
  const [activeLibro, setActiveLibro] = useState<Libro>('Libro de ventas');

  const data = useMemo(() => {
    if (activeLibro === 'Libro de ventas') return mockIngresos;
    if (activeLibro === 'Libro de compras')
      return mockGastos.filter((g) => g.tipo_documento !== 'boleta_honorarios');
    return mockGastos.filter((g) => g.tipo_documento === 'boleta_honorarios');
  }, [activeLibro]);

  const totalNeto = data.reduce((s, d) => s + d.neto, 0);
  const totalIva = data.reduce((s, d) => s + d.iva, 0);
  const totalExento = data.reduce((s, d) => s + d.exento, 0);
  const totalMonto = data.reduce((s, d) => s + d.total, 0);

  const counterpartyHeader =
    activeLibro === 'Libro de ventas' ? 'Cliente' : 'Proveedor';

  return (
    <AppShell
      title="Libros contables"
      subtitle="Ventas, compras y honorarios · Abril 2026"
    >
      <div className="px-4 md:px-8 py-6 md:py-8 animate-fade-in space-y-6">
        {/* Status row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            className="flex items-center gap-4 text-xs"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span className="flex items-center gap-2">
              <BookOpen size={12} aria-hidden="true" />
              <span className="tabular">{data.length}</span> documentos en{' '}
              {activeLibro.toLowerCase()}
            </span>
            <span style={{ color: 'var(--color-border-strong)' }}>·</span>
            <span>
              Total{' '}
              <span
                className="font-semibold tabular"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {formatCLP(totalMonto, true)}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer transition-colors"
              style={{
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-card)',
              }}
            >
              <FileSpreadsheet size={13} aria-hidden="true" />
              Excel
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer transition-colors"
              style={{
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-card)',
              }}
            >
              <Download size={13} aria-hidden="true" />
              PDF
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="inline-flex rounded-lg p-0.5"
          role="tablist"
          aria-label="Libro contable"
          style={{
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
          }}
        >
          {libros.map((libro) => {
            const isActive = activeLibro === libro;
            return (
              <button
                key={libro}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveLibro(libro)}
                className="px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer transition-colors"
                style={{
                  color: isActive
                    ? 'var(--color-app-bg)'
                    : 'var(--color-text-secondary)',
                  backgroundColor: isActive
                    ? 'var(--color-accent)'
                    : 'transparent',
                }}
              >
                {libro}
              </button>
            );
          })}
        </div>

        {/* Summary strip */}
        <section>
          <div className="card overflow-hidden">
            <div
              className="grid grid-cols-3 divide-x"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <KpiCompact label="Total neto" value={totalNeto} compact={true} />
              <KpiCompact label="Total IVA" value={totalIva} compact={true} />
              <KpiCompact label="Total monto" value={totalMonto} compact={true} />
            </div>
          </div>
        </section>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                  }}
                >
                  {[
                    { label: 'N°', align: 'left' },
                    { label: 'Fecha', align: 'left' },
                    { label: 'Folio', align: 'left' },
                    { label: counterpartyHeader, align: 'left' },
                    { label: 'Tipo doc.', align: 'left' },
                    { label: 'Neto', align: 'right' },
                    { label: 'IVA', align: 'right' },
                    { label: 'Exento', align: 'right' },
                    { label: 'Total', align: 'right' },
                  ].map((h) => (
                    <th
                      key={h.label}
                      scope="col"
                      className={cn(
                        'text-[10px] font-semibold uppercase tracking-[0.09em] px-4 py-3 whitespace-nowrap',
                        h.align === 'right' && 'text-right',
                        h.align === 'left' && 'text-left'
                      )}
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr
                    key={row.id}
                    className="transition-colors cursor-pointer"
                    style={{
                      borderBottom:
                        i < data.length - 1
                          ? '1px solid var(--color-border)'
                          : 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'rgba(255,255,255,0.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td
                      className="px-4 py-3 text-xs tabular font-mono"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {String(i + 1).padStart(3, '0')}
                    </td>
                    <td
                      className="px-4 py-3 whitespace-nowrap text-xs tabular"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {formatDate(
                        'fecha_emision' in row
                          ? row.fecha_emision
                          : row.fecha_documento,
                        true
                      )}
                    </td>
                    <td
                      className="px-4 py-3 font-semibold whitespace-nowrap font-mono text-[13px]"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      {row.folio}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {'cliente' in row ? row.cliente : row.proveedor}
                    </td>
                    <td
                      className="px-4 py-3 text-xs capitalize"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {row.tipo_documento.replace(/_/g, ' ')}
                    </td>
                    <td
                      className="px-4 py-3 text-right text-sm tabular font-mono"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {formatCLP(row.neto)}
                    </td>
                    <td
                      className="px-4 py-3 text-right text-sm tabular font-mono"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {formatCLP(row.iva)}
                    </td>
                    <td
                      className="px-4 py-3 text-right text-sm tabular font-mono"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {row.exento > 0 ? formatCLP(row.exento) : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className="text-sm font-semibold tabular font-mono"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {formatCLP(row.total)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr
                  style={{
                    borderTop: '2px solid var(--color-border-strong)',
                    backgroundColor: 'rgba(212,165,116,0.04)',
                  }}
                >
                  <td
                    colSpan={5}
                    className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.12em]"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    Totales
                  </td>
                  <td
                    className="px-4 py-3 text-right text-sm font-bold tabular font-mono"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {formatCLP(totalNeto)}
                  </td>
                  <td
                    className="px-4 py-3 text-right text-sm font-bold tabular font-mono"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {formatCLP(totalIva)}
                  </td>
                  <td
                    className="px-4 py-3 text-right text-sm font-bold tabular font-mono"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {totalExento > 0 ? formatCLP(totalExento) : '—'}
                  </td>
                  <td
                    className="px-4 py-3 text-right text-base font-bold tabular font-mono"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    {formatCLP(totalMonto)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
