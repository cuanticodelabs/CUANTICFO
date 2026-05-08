'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import KpiCompact from '@/components/ui/KpiCompact';
import MovementTable from '@/components/ui/MovementTable';
import MovementListMobile from '@/components/ui/MovementListMobile';
import { mockMovimientos } from '@/lib/mock-data/movimientos';
import { Search, SlidersHorizontal, Plus, ArrowLeftRight } from 'lucide-react';

const tabs = ['Todos', 'Ingresos', 'Gastos', 'Transferencias'] as const;
type Tab = (typeof tabs)[number];

export default function MovimientosPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Todos');
  const [search, setSearch] = useState('');

  const filtered = mockMovimientos
    .filter((m) => {
      if (activeTab === 'Ingresos') return m.tipo === 'ingreso';
      if (activeTab === 'Gastos') return m.tipo === 'gasto';
      if (activeTab === 'Transferencias') return m.tipo === 'transferencia';
      return true;
    })
    .filter(
      (m) =>
        search === '' ||
        m.documento.toLowerCase().includes(search.toLowerCase()) ||
        m.cliente_proveedor.toLowerCase().includes(search.toLowerCase())
    );

  const totalIngresos = mockMovimientos
    .filter((m) => m.tipo === 'ingreso')
    .reduce((s, m) => s + m.monto, 0);
  const totalGastos = Math.abs(
    mockMovimientos
      .filter((m) => m.tipo === 'gasto')
      .reduce((s, m) => s + m.monto, 0)
  );
  const neto = totalIngresos - totalGastos;

  return (
    <AppShell title="Movimientos" subtitle="Vista unificada · Abril 2026">
      <div className="px-4 md:px-8 py-6 md:py-8 animate-fade-in space-y-6">
        {/* Status + actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            className="flex items-center gap-4 text-xs"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span className="flex items-center gap-2">
              <ArrowLeftRight size={12} aria-hidden="true" />
              <span className="tabular">{mockMovimientos.length}</span> movimientos
            </span>
            <span style={{ color: 'var(--color-border-strong)' }}>·</span>
            <span>
              Neto{' '}
              <span
                className="font-semibold tabular"
                style={{
                  color:
                    neto >= 0
                      ? 'var(--color-income)'
                      : 'var(--color-expense)',
                }}
              >
                {neto >= 0 ? '+' : ''}
                {new Intl.NumberFormat('es-CL', {
                  style: 'currency',
                  currency: 'CLP',
                  minimumFractionDigits: 0,
                }).format(neto)}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
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
              Nuevo
            </button>
          </div>
        </div>

        {/* Strip */}
        <section>
          <div className="card overflow-hidden">
            <div
              className="grid grid-cols-3 divide-x"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <KpiCompact
                label="Ingresos"
                value={totalIngresos}
                compact={true}
                goodDirection="up"
              />
              <KpiCompact
                label="Gastos"
                value={totalGastos}
                compact={true}
                goodDirection="down"
              />
              <KpiCompact label="Neto" value={neto} compact={true} />
            </div>
          </div>
        </section>

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div
            className="inline-flex rounded-lg p-0.5 self-start"
            role="tablist"
            aria-label="Tipo de movimiento"
            style={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab)}
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
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 items-center">
            <div className="relative flex-1 sm:w-64">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--color-text-muted)' }}
                aria-hidden="true"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar movimiento…"
                aria-label="Buscar movimiento"
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
              className="p-2 rounded-lg cursor-pointer transition-colors"
              style={{
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-card)',
              }}
            >
              <SlidersHorizontal size={13} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Table / List */}
        <div className="hidden md:block">
          <MovementTable movimientos={filtered} />
        </div>
        <div className="md:hidden card overflow-hidden">
          <MovementListMobile movimientos={filtered} />
        </div>

        {filtered.length === 0 && (
          <div
            className="text-center py-12 card"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <p className="text-sm">No se encontraron movimientos</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
