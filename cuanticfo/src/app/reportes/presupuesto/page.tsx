'use client';

import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import KpiHero from '@/components/ui/KpiHero';
import KpiCompact from '@/components/ui/KpiCompact';
import InsightCard from '@/components/ui/InsightCard';
import VarianceHeatmap from '@/components/charts/VarianceHeatmap';
import HBarList from '@/components/charts/HBarList';
import {
  mockVarianceRows,
  presupuestoMonths,
  mockBudgetKpis,
} from '@/lib/mock-data/presupuesto';
import type { AiInsight } from '@/components/ui/InsightCard';
import { Download, AlertTriangle } from 'lucide-react';

const budgetInsight: AiInsight = {
  id: 'ins-budget-001',
  severity: 'warn',
  message:
    'Tecnología supera el presupuesto en 41% YTD ($5,5M sobre lo planificado); el contrato con Google Cloud explica $3,4M de ese gap y vence en agosto — buen momento para renegociar.',
  sources: [
    'Variaciones presupuestarias YTD 2026',
    'Contrato proveedor #GC-2024',
    'Histórico de uso 12 meses',
  ],
  confidence: 0.84,
  updatedAt: 'hace 30 min',
  actions: [
    { label: 'Ver categoría Tecnología', href: '/gastos?categoria=tecnologia' },
    { label: 'Crear alerta de renovación', variant: 'ghost' },
  ],
};

export default function PresupuestoPage() {
  const k = mockBudgetKpis;

  // Variation per category (YTD %) — feeds the side-bar list
  const ytdPerCategory = mockVarianceRows
    .map((row) => {
      const actual = row.cells.reduce((s, c) => s + c.actual, 0);
      const budget = row.cells.reduce((s, c) => s + c.budget, 0);
      const variation = budget === 0 ? 0 : ((actual - budget) / budget) * 100;
      return {
        name: row.category,
        value: actual,
        variation,
      };
    })
    .sort((a, b) => b.variation - a.variation);

  return (
    <AppShell
      title="Presupuesto vs Real"
      subtitle="Variaciones por categoría · Año en curso 2026"
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
              <AlertTriangle
                size={12}
                style={{ color: 'var(--color-expense)' }}
                aria-hidden="true"
              />
              <span className="tabular">{k.categoriasEnRiesgo}</span>{' '}
              {k.categoriasEnRiesgo === 1 ? 'categoría' : 'categorías'} sobre presupuesto
            </span>
            <span style={{ color: 'var(--color-border-strong)' }}>·</span>
            <span>
              Mes con mayor desvío:{' '}
              <span
                className="font-semibold tabular"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {k.mesPeorDesempeno.mes} (+{k.mesPeorDesempeno.variacion}%)
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
            <Link
              href="/configuracion/categorias"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer transition-colors"
              style={{
                color: 'var(--color-app-bg)',
                background:
                  'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
              }}
            >
              Editar presupuesto
            </Link>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────── */}
        {/* HERO KPIs                                                  */}
        {/* ───────────────────────────────────────────────────────── */}
        <section
          aria-labelledby="budget-hero"
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        >
          <h2 id="budget-hero" className="sr-only">
            Indicadores presupuestarios
          </h2>

          <KpiHero
            label="Real YTD"
            value={k.realYTD}
            variacion_pct={k.variacionPctYTD}
            variacion_label="vs presupuesto YTD"
            goodDirection="down"
            secondary={{ label: 'Desvío', value: '+ $5,4M' }}
            sources={[
              'Movimientos contabilizados Ene–Jun 2026',
              'Presupuesto aprobado 2026',
            ]}
          />

          <KpiHero
            label="Presupuesto YTD"
            value={k.presupuestoYTD}
            variacion_pct={0}
            variacion_label="aprobado para 2026"
            goodDirection="up"
            secondary={{ label: 'Cumplimiento', value: '107%' }}
            sources={['Presupuesto 2026 (rev. 2025-12)']}
          />
        </section>

        {/* ───────────────────────────────────────────────────────── */}
        {/* SUPPORTING STRIP                                           */}
        {/* ───────────────────────────────────────────────────────── */}
        <section>
          <div className="card overflow-hidden">
            <div
              className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <KpiCompact
                label="Categorías sobre presup."
                value={k.categoriasEnRiesgo}
                displayValue={String(k.categoriasEnRiesgo)}
              />
              <KpiCompact
                label="Categorías en meta"
                value={mockVarianceRows.length - k.categoriasEnRiesgo}
                displayValue={String(mockVarianceRows.length - k.categoriasEnRiesgo)}
              />
              <KpiCompact
                label="Mayor desvío YTD"
                value={5_500_000}
                variacion_pct={41}
                variacion_label="Tecnología"
                goodDirection="down"
              />
              <KpiCompact
                label="Mejor categoría"
                value={70_000}
                variacion_pct={-7.7}
                variacion_label="Otros"
                goodDirection="down"
              />
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────── */}
        {/* AI INSIGHT                                                 */}
        {/* ───────────────────────────────────────────────────────── */}
        <section>
          <InsightCard insight={budgetInsight} />
        </section>

        {/* ───────────────────────────────────────────────────────── */}
        {/* HEATMAP + RANKING                                          */}
        {/* ───────────────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3 card p-6">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
              <div>
                <h3
                  className="text-base font-semibold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Variación por categoría · 6 meses
                </h3>
                <p
                  className="text-xs mt-1"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Click en una celda para ver los movimientos del mes
                </p>
              </div>
            </div>
            <VarianceHeatmap
              months={presupuestoMonths}
              rows={mockVarianceRows}
              onCellClick={(category, month) => {
                // Hook to drilldown — for now, console for the dev path
                if (typeof window !== 'undefined') {
                  console.log('drill', category, month);
                }
              }}
            />
          </div>

          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3
                className="text-base font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Ranking de desviación
              </h3>
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.09em]"
                style={{ color: 'var(--color-text-muted)' }}
              >
                YTD
              </span>
            </div>
            <HBarList
              items={ytdPerCategory.map((c) => ({
                name: c.name,
                value: c.value,
                variation: c.variation,
              }))}
              showAmount={true}
            />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
