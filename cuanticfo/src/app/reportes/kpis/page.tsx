'use client';

import { useMemo, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import KpiCompact from '@/components/ui/KpiCompact';
import KpiMonitorRow from '@/components/ui/KpiMonitorRow';
import InsightCard from '@/components/ui/InsightCard';
import {
  mockKpiMonitor,
  summarizeKpiStatus,
} from '@/lib/mock-data/kpis';
import type { AiInsight } from '@/components/ui/InsightCard';
import type { KpiStatus } from '@/components/ui/KpiMonitorRow';
import { Download, Plus, Filter } from 'lucide-react';

const kpiInsight: AiInsight = {
  id: 'ins-kpi-001',
  severity: 'warn',
  message:
    'Tu top cliente representa el 38% de los ingresos y subió 6 puntos en 6 meses; el objetivo interno de ≤30% está siendo violado. Diversificar antes del cierre Q3 reduce el riesgo de caja en escenario pesimista.',
  sources: [
    'KPI Concentración top cliente · 6 meses',
    'Política interna de concentración (≤30%)',
    'Pronóstico Q3 escenario pesimista',
  ],
  confidence: 0.82,
  updatedAt: 'hace 1 hora',
  actions: [
    { label: 'Ver pipeline', href: '/ingresos' },
    { label: 'Plan de diversificación', href: '/ai-cfo' },
  ],
};

type Filter = 'todos' | 'fuera' | KpiStatus;

const filterLabels: Record<Filter, string> = {
  todos: 'Todos',
  'on-target': 'En meta',
  'near-target': 'Cerca',
  'off-target': 'Fuera de meta',
  fuera: 'Requieren atención',
};

export default function KpisPage() {
  const [filter, setFilter] = useState<Filter>('todos');
  const counts = summarizeKpiStatus(mockKpiMonitor);

  const filtered = useMemo(() => {
    if (filter === 'todos') return mockKpiMonitor;
    if (filter === 'fuera')
      return mockKpiMonitor.filter(
        (k) => k.status === 'off-target' || k.status === 'near-target'
      );
    return mockKpiMonitor.filter((k) => k.status === filter);
  }, [filter]);

  // Group filtered KPIs by their `group` field for readability.
  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.forEach((k) => {
      const g = k.group ?? 'Otros';
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(k);
    });
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <AppShell
      title="Monitoreo de KPIs"
      subtitle="Indicadores clave con umbrales definidos por la organización"
    >
      <div className="px-4 md:px-8 py-6 md:py-8 animate-fade-in space-y-8">
        {/* ───────────────────────────────────────────────────────── */}
        {/* PAGE STATUS + ACTIONS                                      */}
        {/* ───────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            className="flex items-center gap-4 text-xs"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: 'var(--color-income)' }}
                aria-hidden="true"
              />
              <span className="tabular">{counts['on-target']}</span> en meta
            </span>
            <span style={{ color: 'var(--color-border-strong)' }}>·</span>
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: 'var(--color-warning)' }}
                aria-hidden="true"
              />
              <span className="tabular">{counts['near-target']}</span> cerca
            </span>
            <span style={{ color: 'var(--color-border-strong)' }}>·</span>
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: 'var(--color-expense)' }}
                aria-hidden="true"
              />
              <span className="tabular">{counts['off-target']}</span> fuera
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
              Nuevo KPI
            </button>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────── */}
        {/* SUMMARY STRIP                                              */}
        {/* ───────────────────────────────────────────────────────── */}
        <section>
          <div className="card overflow-hidden">
            <div
              className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <KpiCompact
                label="KPIs monitoreados"
                value={mockKpiMonitor.length}
                displayValue={String(mockKpiMonitor.length)}
              />
              <KpiCompact
                label="En meta"
                value={counts['on-target']}
                displayValue={String(counts['on-target'])}
              />
              <KpiCompact
                label="Cerca"
                value={counts['near-target']}
                displayValue={String(counts['near-target'])}
              />
              <KpiCompact
                label="Fuera de meta"
                value={counts['off-target']}
                displayValue={String(counts['off-target'])}
              />
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────── */}
        {/* AI INSIGHT (only if there's an off-target metric)          */}
        {/* ───────────────────────────────────────────────────────── */}
        {counts['off-target'] > 0 && (
          <section>
            <InsightCard insight={kpiInsight} />
          </section>
        )}

        {/* ───────────────────────────────────────────────────────── */}
        {/* FILTER BAR                                                 */}
        {/* ───────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter
            size={13}
            style={{ color: 'var(--color-text-muted)' }}
            aria-hidden="true"
          />
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.09em] mr-1"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Filtrar
          </span>
          {(['todos', 'fuera', 'on-target', 'near-target', 'off-target'] as Filter[]).map((f) => {
            const isActive = filter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className="text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer transition-colors"
                style={{
                  color: isActive
                    ? 'var(--color-app-bg)'
                    : 'var(--color-text-secondary)',
                  backgroundColor: isActive
                    ? 'var(--color-accent)'
                    : 'var(--color-card)',
                  border: `1px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'}`,
                }}
              >
                {filterLabels[f]}
              </button>
            );
          })}
        </div>

        {/* ───────────────────────────────────────────────────────── */}
        {/* KPI LIST — grouped                                          */}
        {/* ───────────────────────────────────────────────────────── */}
        <section className="space-y-4">
          {grouped.length === 0 ? (
            <div
              className="card p-8 text-center"
              style={{ color: 'var(--color-text-muted)' }}
            >
              No hay KPIs que coincidan con el filtro.
            </div>
          ) : (
            grouped.map(([group, kpis]) => (
              <div key={group} className="card overflow-hidden">
                <div
                  className="px-4 py-3 flex items-center justify-between"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.12em]"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {group}
                  </p>
                  <p
                    className="text-[11px] tabular"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {kpis.length} {kpis.length === 1 ? 'indicador' : 'indicadores'}
                  </p>
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                  {kpis.map((k) => (
                    <KpiMonitorRow key={k.id} kpi={k} />
                  ))}
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </AppShell>
  );
}
