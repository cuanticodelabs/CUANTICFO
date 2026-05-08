'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import KpiHero from '@/components/ui/KpiHero';
import KpiCompact from '@/components/ui/KpiCompact';
import InsightCard from '@/components/ui/InsightCard';
import Waterfall from '@/components/charts/Waterfall';
import CashForecast from '@/components/charts/CashForecast';
import {
  mockWaterfallQ2,
  mockCashForecast13w,
  mockCashFlowKpis,
} from '@/lib/mock-data/flujo';
import type { AiInsight } from '@/components/ui/InsightCard';
import { Download, ArrowRight } from 'lucide-react';

const cashFlowInsight: AiInsight = {
  id: 'ins-cash-001',
  severity: 'warn',
  message:
    'En la semana 28 la caja proyectada cae a $12,8M por concentración de IVA y nómina; mover el pago de Google Cloud a S29 absorbe la tensión.',
  sources: [
    'Pronóstico 13 semanas',
    'Calendario tributario SII Q2',
    'Cuentas por pagar al 24/04',
  ],
  confidence: 0.81,
  updatedAt: 'hace 1 hora',
  actions: [
    { label: 'Ver cuentas por pagar', href: '/gastos' },
    { label: 'Crear escenario', variant: 'ghost' },
  ],
};

type View = 'historico' | 'proyectado';

export default function FlujoCajaPage() {
  const [view, setView] = useState<View>('historico');
  const k = mockCashFlowKpis;

  return (
    <AppShell
      title="Flujo de caja"
      subtitle="Movimiento de caja del trimestre y pronóstico a 13 semanas"
    >
      <div className="px-4 md:px-8 py-6 md:py-8 animate-fade-in space-y-8">
        {/* ───────────────────────────────────────────────────────── */}
        {/* PAGE STATUS + ACTIONS                                      */}
        {/* ───────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            className="inline-flex rounded-lg p-0.5"
            style={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
            }}
            role="tablist"
            aria-label="Vista de flujo de caja"
          >
            {(
              [
                { id: 'historico', label: 'Histórico Q2' },
                { id: 'proyectado', label: 'Proyectado 13 sem' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                role="tab"
                aria-selected={view === opt.id}
                onClick={() => setView(opt.id)}
                className="px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer transition-colors tabular"
                style={{
                  color:
                    view === opt.id
                      ? 'var(--color-app-bg)'
                      : 'var(--color-text-secondary)',
                  backgroundColor:
                    view === opt.id ? 'var(--color-accent)' : 'transparent',
                }}
              >
                {opt.label}
              </button>
            ))}
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
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────── */}
        {/* HERO KPIs                                                  */}
        {/* ───────────────────────────────────────────────────────── */}
        <section
          aria-labelledby="cash-hero"
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        >
          <h2 id="cash-hero" className="sr-only">
            Indicadores de caja
          </h2>

          <KpiHero
            label="Caja al cierre Q2"
            value={k.cajaFinalQ2}
            variacion_pct={k.variacionQ2Pct}
            variacion_label="vs caja inicial"
            secondary={{ label: 'Runway', value: `${k.runwayMeses} meses` }}
            sources={[
              'Saldos bancarios al 24/04',
              'Movimientos esperados Q2',
              'Calendario tributario SII',
            ]}
          />

          <KpiHero
            label="Caja mínima del trimestre"
            value={k.puntoMinimo.valor}
            variacion_pct={-31.7}
            variacion_label={`semana ${k.puntoMinimo.semana}`}
            goodDirection="up"
            secondary={{ label: 'Sobre umbral', value: '+ $2,8M' }}
            sources={[
              'Pronóstico 13 semanas',
              'Cuentas por pagar al 24/04',
              'Burn rate promedio 6 meses',
            ]}
          />
        </section>

        {/* ───────────────────────────────────────────────────────── */}
        {/* SUPPORTING STRIP — flow KPIs                               */}
        {/* ───────────────────────────────────────────────────────── */}
        <section>
          <div className="card overflow-hidden">
            <div
              className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <KpiCompact
                label="Ingresos esperados 90d"
                value={k.ingresosEsperados90d}
                goodDirection="up"
              />
              <KpiCompact
                label="Gastos esperados 90d"
                value={k.gastosEsperados90d}
                goodDirection="down"
              />
              <KpiCompact
                label="Flujo neto 90d"
                value={k.flujoNeto90d}
                goodDirection="up"
              />
              <KpiCompact label="Caja actual" value={k.cajaActual} />
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────── */}
        {/* MAIN VIEW — Waterfall OR Forecast                          */}
        {/* ───────────────────────────────────────────────────────── */}
        {view === 'historico' ? (
          <section className="card p-6">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
              <div>
                <h3
                  className="text-base font-semibold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Cascada de caja · Q2 2026
                </h3>
                <p
                  className="text-xs mt-1"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Cómo $18,8M se transformaron en $27,3M en el trimestre
                </p>
              </div>
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.09em] px-2 py-1 rounded-md"
                style={{
                  color: 'var(--color-accent)',
                  backgroundColor: 'var(--color-accent-tint)',
                  border: '1px solid rgba(212,165,116,0.18)',
                }}
              >
                Cierre proyectado
              </span>
            </div>
            <Waterfall items={mockWaterfallQ2} height={300} />
          </section>
        ) : (
          <section className="card p-6">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
              <div>
                <h3
                  className="text-base font-semibold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Pronóstico de caja · 13 semanas
                </h3>
                <p
                  className="text-xs mt-1"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Estimación basada en ingresos comprometidos, gastos recurrentes y
                  calendario tributario
                </p>
              </div>
            </div>
            <CashForecast
              data={mockCashForecast13w}
              confidence={0.8}
              threshold={{ value: 10_000_000, label: 'Mínimo operacional' }}
              height={320}
            />
          </section>
        )}

        {/* ───────────────────────────────────────────────────────── */}
        {/* AI INSIGHT                                                 */}
        {/* ───────────────────────────────────────────────────────── */}
        <section>
          <InsightCard insight={cashFlowInsight} />
        </section>

        {/* ───────────────────────────────────────────────────────── */}
        {/* DRILL: top movements                                       */}
        {/* ───────────────────────────────────────────────────────── */}
        <section className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-sm font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Próximos pagos críticos · 30 días
            </h3>
            <Link
              href="/gastos"
              className="inline-flex items-center gap-1 text-xs font-semibold cursor-pointer"
              style={{ color: 'var(--color-accent)' }}
            >
              Ver todos
              <ArrowRight size={11} aria-hidden="true" />
            </Link>
          </div>

          <div
            className="divide-y"
            style={{ borderColor: 'var(--color-border)' }}
          >
            {[
              {
                fecha: '30 Abr',
                concepto: 'IVA Mensual F29',
                proveedor: 'SII',
                monto: -2_150_000,
                impacto: 'Alto',
              },
              {
                fecha: '5 May',
                concepto: 'Nómina Mayo',
                proveedor: 'Equipo',
                monto: -6_362_500,
                impacto: 'Alto',
              },
              {
                fecha: '8 May',
                concepto: 'Google Cloud · suscripción',
                proveedor: 'Google',
                monto: -1_240_000,
                impacto: 'Medio',
              },
              {
                fecha: '12 May',
                concepto: 'Arriendo oficina',
                proveedor: 'Inmobiliaria Norte',
                monto: -795_000,
                impacto: 'Medio',
              },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-[0.09em] tabular w-14"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {row.fecha}
                  </span>
                  <div className="min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {row.concepto}
                    </p>
                    <p
                      className="text-xs truncate"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {row.proveedor}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-[0.09em] px-2 py-0.5 rounded-full"
                    style={{
                      color:
                        row.impacto === 'Alto'
                          ? 'var(--color-expense)'
                          : 'var(--color-warning)',
                      backgroundColor:
                        row.impacto === 'Alto'
                          ? 'var(--color-expense-tint)'
                          : 'var(--color-warning-tint)',
                      border:
                        row.impacto === 'Alto'
                          ? '1px solid rgba(248,113,113,0.18)'
                          : '1px solid rgba(251,146,60,0.18)',
                    }}
                  >
                    {row.impacto}
                  </span>
                  <span
                    className="text-sm font-semibold tabular font-mono w-32 text-right"
                    style={{ color: 'var(--color-expense)' }}
                  >
                    {new Intl.NumberFormat('es-CL', {
                      style: 'currency',
                      currency: 'CLP',
                      minimumFractionDigits: 0,
                    }).format(row.monto)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
