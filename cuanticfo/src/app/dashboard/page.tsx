'use client';

import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import KpiHero from '@/components/ui/KpiHero';
import KpiCompact from '@/components/ui/KpiCompact';
import InsightCard from '@/components/ui/InsightCard';
import AlertCard from '@/components/ui/AlertCard';
import MovementTable from '@/components/ui/MovementTable';
import MovementListMobile from '@/components/ui/MovementListMobile';
import FinancialChartCard from '@/components/ui/FinancialChartCard';
import HBarList from '@/components/charts/HBarList';
import {
  mockKpis,
  mockChartData,
  mockDistribucionGastosBars,
  mockCuentasPorCobrar,
  mockUltimosMovimientos,
  mockEmpresa,
} from '@/lib/mock-data/dashboard';
import { mockAlertas } from '@/lib/mock-data/alertas';
import { mockFeaturedInsight } from '@/lib/mock-data/insights';
import {
  ArrowRight,
  Download,
  Plus,
} from 'lucide-react';

export default function DashboardPage() {
  const alertasActivas = mockAlertas.filter((a) => a.estado === 'activa');
  const topAlertas = alertasActivas.slice(0, 3);

  const kpiResultado = mockKpis.find((k) => k.tipo === 'resultado')!;
  const kpiCaja = mockKpis.find((k) => k.tipo === 'caja')!;
  const kpiIngresos = mockKpis.find((k) => k.tipo === 'ingreso')!;
  const kpiGastos = mockKpis.find((k) => k.tipo === 'gasto')!;
  const kpiIva = mockKpis.find((k) => k.tipo === 'iva')!;

  const margenPct = (kpiResultado.value / kpiIngresos.value) * 100;

  return (
    <AppShell
      title="Resumen ejecutivo"
      subtitle={`${mockEmpresa.razon_social} · Abril 2026 · Cierre el 30`}
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
                style={{ backgroundColor: 'var(--color-warning)' }}
                aria-hidden="true"
              />
              Próxima IVA en{' '}
              <span
                className="font-semibold tabular"
                style={{ color: 'var(--color-text-primary)' }}
              >
                12 días
              </span>
            </span>
            <span style={{ color: 'var(--color-border-strong)' }}>·</span>
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: 'var(--color-expense)' }}
                aria-hidden="true"
              />
              <span className="tabular">{topAlertas.length} alertas activas</span>
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
              href="/ingresos"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer transition-colors"
              style={{
                color: 'var(--color-app-bg)',
                background:
                  'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
              }}
            >
              <Plus size={13} aria-hidden="true" />
              Nuevo movimiento
            </Link>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────── */}
        {/* HERO — the two questions                                   */}
        {/* ───────────────────────────────────────────────────────── */}
        <section
          aria-labelledby="hero-section"
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        >
          <h2 id="hero-section" className="sr-only">
            Indicadores principales
          </h2>

          <KpiHero
            label="Resultado del mes"
            value={kpiResultado.value}
            variacion_pct={kpiResultado.variacion_pct}
            variacion_label={kpiResultado.variacion_label}
            sparkline={kpiResultado.sparkline}
            secondary={{ label: 'Margen', value: `${margenPct.toFixed(0)}%` }}
            sources={[
              'Ingresos Abr 2026',
              'Gastos operacionales Abr 2026',
              'Cierre Mar 2026',
            ]}
          />

          <KpiHero
            label="Caja disponible"
            value={kpiCaja.value}
            variacion_pct={kpiCaja.variacion_pct}
            variacion_label={kpiCaja.variacion_label}
            sparkline={kpiCaja.sparkline}
            secondary={{ label: 'Runway', value: '8,4 meses' }}
            sources={[
              'Saldos bancarios al 24/04',
              'Burn rate promedio 6 meses',
            ]}
          />
        </section>

        {/* ───────────────────────────────────────────────────────── */}
        {/* COMPACT STRIP — supporting metrics                         */}
        {/* ───────────────────────────────────────────────────────── */}
        <section aria-labelledby="supporting-section">
          <h2 id="supporting-section" className="sr-only">
            Métricas de apoyo
          </h2>
          <div className="card overflow-hidden">
            <div
              className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <KpiCompact
                label="Ingresos"
                value={kpiIngresos.value}
                variacion_pct={kpiIngresos.variacion_pct}
                variacion_label="vs Mar"
                goodDirection="up"
              />
              <KpiCompact
                label="Gastos"
                value={kpiGastos.value}
                variacion_pct={kpiGastos.variacion_pct}
                variacion_label="vs Mar"
                goodDirection="down"
              />
              <KpiCompact
                label="Por cobrar"
                value={mockCuentasPorCobrar.total}
                variacion_pct={-3.2}
                variacion_label="vs Mar"
                goodDirection="down"
              />
              <KpiCompact
                label="IVA a pagar"
                value={kpiIva.value}
                variacion_pct={kpiIva.variacion_pct}
                variacion_label="vs Mar"
                goodDirection="down"
              />
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────── */}
        {/* AI INSIGHT + ALERTAS                                       */}
        {/* ───────────────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3">
            <InsightCard insight={mockFeaturedInsight} />
          </div>

          <div className="lg:col-span-2 card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3
                className="text-[10px] font-semibold uppercase tracking-[0.09em]"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Alertas activas
              </h3>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full tabular"
                style={{
                  backgroundColor: 'var(--color-expense-tint)',
                  color: 'var(--color-expense)',
                  border: '1px solid rgba(248,113,113,0.2)',
                }}
              >
                {alertasActivas.length}
              </span>
            </div>

            <div
              className="divide-y"
              style={{ borderColor: 'var(--color-border)' }}
            >
              {topAlertas.map((alerta) => (
                <AlertCard key={alerta.id} alerta={alerta} compact />
              ))}
            </div>

            <Link
              href="/alertas"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold cursor-pointer"
              style={{ color: 'var(--color-accent)' }}
            >
              Ver todas
              <ArrowRight size={11} aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────── */}
        {/* CHARTS: 6-month evolution + Distribución de gastos         */}
        {/* ───────────────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3">
            <FinancialChartCard data={mockChartData} title="Ingresos vs gastos · 6 meses" />
          </div>

          <div className="lg:col-span-2 card p-5">
            <div className="flex items-center justify-between mb-5">
              <h3
                className="text-sm font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Distribución de gastos
              </h3>
              <Link
                href="/gastos"
                className="text-xs font-medium cursor-pointer transition-colors hover:underline"
                style={{ color: 'var(--color-accent)' }}
              >
                Ver detalle
              </Link>
            </div>
            <HBarList items={mockDistribucionGastosBars} totalLabel="Total Abr 2026" />
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────── */}
        {/* ÚLTIMOS MOVIMIENTOS                                        */}
        {/* ───────────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2
                className="text-[10px] font-semibold uppercase tracking-[0.09em]"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Últimos movimientos
              </h2>
              <p
                className="text-sm mt-1"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Actualizado hace 4 horas
              </p>
            </div>
            <Link
              href="/movimientos"
              className="inline-flex items-center gap-1 text-xs font-semibold cursor-pointer"
              style={{ color: 'var(--color-accent)' }}
            >
              Ver todos
              <ArrowRight size={11} aria-hidden="true" />
            </Link>
          </div>
          <div className="hidden md:block">
            <MovementTable movimientos={mockUltimosMovimientos} />
          </div>
          <div className="md:hidden card overflow-hidden">
            <MovementListMobile movimientos={mockUltimosMovimientos} />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
