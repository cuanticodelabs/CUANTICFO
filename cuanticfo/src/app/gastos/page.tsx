'use client';

import { useMemo, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import KpiCompact from '@/components/ui/KpiCompact';
import { mockGastos } from '@/lib/mock-data/movimientos';
import { formatCLP, formatDate, cn } from '@/lib/utils/format';
import {
  Plus,
  Search,
  Download,
  SlidersHorizontal,
  TrendingDown,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const estadoBadge: Record<string, string> = {
  pagado: 'badge-green',
  pendiente: 'badge-orange',
  vencido: 'badge-red',
};

const estadoLabel: Record<string, string> = {
  pagado: 'Pagado',
  pendiente: 'Pendiente',
  vencido: 'Vencido',
};

export default function GastosPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      mockGastos.filter(
        (g) =>
          search === '' ||
          g.proveedor.toLowerCase().includes(search.toLowerCase()) ||
          g.folio.toLowerCase().includes(search.toLowerCase()) ||
          g.categoria.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const total = mockGastos.reduce((s, g) => s + g.total, 0);
  const pagados = mockGastos
    .filter((g) => g.estado_pago === 'pagado')
    .reduce((s, g) => s + g.total, 0);
  const pendientes = mockGastos
    .filter((g) => g.estado_pago === 'pendiente')
    .reduce((s, g) => s + g.total, 0);
  const conCF = mockGastos.filter((g) => g.usa_credito_fiscal).reduce((s, g) => s + g.iva, 0);

  return (
    <AppShell title="Gastos" subtitle="Facturas recibidas y compras · Abril 2026">
      <div className="px-4 md:px-8 py-6 md:py-8 animate-fade-in space-y-6">
        {/* Status + actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            className="flex items-center gap-4 text-xs"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span className="flex items-center gap-2">
              <TrendingDown
                size={12}
                style={{ color: 'var(--color-expense)' }}
                aria-hidden="true"
              />
              <span className="tabular">{mockGastos.length}</span> gastos registrados
            </span>
            <span style={{ color: 'var(--color-border-strong)' }}>·</span>
            <span>
              Total{' '}
              <span
                className="font-semibold tabular"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {formatCLP(total, true)}
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
              <Download size={13} aria-hidden="true" />
              Exportar
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer transition-opacity hover:opacity-90"
              style={{
                color: 'var(--color-app-bg)',
                background:
                  'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
              }}
            >
              <Plus size={13} aria-hidden="true" />
              Nuevo gasto
            </button>
          </div>
        </div>

        {/* KPI strip */}
        <section>
          <div className="card overflow-hidden">
            <div
              className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <KpiCompact label="Total gastos" value={total} compact={true} />
              <KpiCompact label="Pagados" value={pagados} compact={true} />
              <KpiCompact label="Por pagar" value={pendientes} compact={true} />
              <KpiCompact label="IVA con crédito fiscal" value={conCF} compact={true} />
            </div>
          </div>
        </section>

        {/* Search bar */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--color-text-muted)' }}
              aria-hidden="true"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por proveedor, folio o categoría…"
              aria-label="Buscar gasto"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg outline-none transition-colors"
              style={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>
          <button
            type="button"
            aria-label="Filtros"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer transition-colors"
            style={{
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-card)',
            }}
          >
            <SlidersHorizontal size={13} aria-hidden="true" />
            Filtros
          </button>
          <span
            className="text-[11px] tabular ml-auto"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
          </span>
        </div>

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
                    { label: 'Fecha', align: 'left' },
                    { label: 'Folio', align: 'left' },
                    { label: 'Proveedor', align: 'left' },
                    { label: 'Categoría', align: 'left' },
                    { label: 'Tipo', align: 'left' },
                    { label: 'Neto', align: 'right' },
                    { label: 'IVA', align: 'right' },
                    { label: 'Total', align: 'right' },
                    { label: 'CF', align: 'center' },
                    { label: 'Estado', align: 'center' },
                  ].map((h) => (
                    <th
                      key={h.label}
                      scope="col"
                      className={cn(
                        'text-[10px] font-semibold uppercase tracking-[0.09em] px-4 py-3 whitespace-nowrap',
                        h.align === 'right' && 'text-right',
                        h.align === 'center' && 'text-center',
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
                {filtered.map((g, i) => (
                  <tr
                    key={g.id}
                    className="transition-colors cursor-pointer"
                    style={{
                      borderBottom:
                        i < filtered.length - 1
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
                      className="px-4 py-3 whitespace-nowrap text-xs tabular"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {formatDate(g.fecha_documento, true)}
                    </td>
                    <td
                      className="px-4 py-3 font-semibold whitespace-nowrap font-mono text-[13px]"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {g.folio}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {g.proveedor}
                    </td>
                    <td
                      className="px-4 py-3 text-xs"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {g.categoria}
                    </td>
                    <td
                      className="px-4 py-3 text-xs capitalize"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {g.tipo_documento.replace(/_/g, ' ')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className="text-sm tabular font-mono"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {formatCLP(g.neto)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className="text-sm tabular font-mono"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {formatCLP(g.iva)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className="text-sm font-semibold tabular font-mono"
                        style={{ color: 'var(--color-expense)' }}
                      >
                        {formatCLP(g.total)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {g.usa_credito_fiscal ? (
                        <CheckCircle
                          size={14}
                          aria-label="Usa crédito fiscal"
                          style={{ color: 'var(--color-income)' }}
                          className="mx-auto"
                        />
                      ) : (
                        <XCircle
                          size={14}
                          aria-label="Sin crédito fiscal"
                          style={{ color: 'var(--color-text-muted)' }}
                          className="mx-auto"
                        />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={cn(
                          'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                          estadoBadge[g.estado_pago] || 'badge-gray'
                        )}
                      >
                        {estadoLabel[g.estado_pago] || g.estado_pago}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div
              className="text-center py-12"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <p className="text-sm">No se encontraron gastos que coincidan</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
