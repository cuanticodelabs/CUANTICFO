'use client';

import { useMemo, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import KpiHero from '@/components/ui/KpiHero';
import InsightCard from '@/components/ui/InsightCard';
import ScenarioSlider from '@/components/ui/ScenarioSlider';
import ProjectionChart from '@/components/charts/ProjectionChart';
import {
  mockScenarios,
  projectScenario,
  baseProjection,
  type ScenarioId,
  type ScenarioAssumptions,
} from '@/lib/mock-data/proyecciones';
import type { AiInsight } from '@/components/ui/InsightCard';
import { Save, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { formatCLP } from '@/lib/utils/format';

const projectionInsight: AiInsight = {
  id: 'ins-proj-001',
  severity: 'warn',
  message:
    'En el escenario pesimista (pérdida de cliente top + DSO 60d) tu runway baja a 7,3 meses, bajo el umbral de 8 meses que fijamos como mínimo seguro.',
  sources: [
    'Pronóstico 12 meses · escenario pesimista',
    'Concentración de clientes Abr 2026',
    'Política interna de runway mínimo',
  ],
  confidence: 0.79,
  updatedAt: 'hace 12 min',
  actions: [
    { label: 'Plan de contingencia', href: '/ai-cfo' },
    { label: 'Ver concentración', href: '/reportes/kpis' },
  ],
};

const scenarioOrder: ScenarioId[] = ['base', 'optimista', 'pesimista'];

export default function ProyeccionesPage() {
  const [activeId, setActiveId] = useState<ScenarioId>('base');
  const [assumptions, setAssumptions] = useState<ScenarioAssumptions>(
    mockScenarios.base.assumptions
  );

  const active = mockScenarios[activeId];
  const baseAssumptions = mockScenarios.base.assumptions;

  // Local edits override the scenario default; recompute curve with current sliders.
  const projection = useMemo(
    () =>
      projectScenario({
        ...active,
        assumptions,
      }),
    [active, assumptions]
  );

  // For non-base scenarios, overlay the base curve as a dashed reference.
  const projectionWithBaseline = useMemo(() => {
    if (activeId === 'base') return projection;
    const base = baseProjection();
    return projection.map((p, i) => ({
      ...p,
      baseline: base[i]?.value,
    }));
  }, [activeId, projection]);

  function selectScenario(id: ScenarioId) {
    setActiveId(id);
    setAssumptions(mockScenarios[id].assumptions);
  }

  function reset() {
    setAssumptions(mockScenarios[activeId].assumptions);
  }

  // Derived result KPIs from current sliders — recompute roughly.
  const lastValue = projection[projection.length - 1]?.value ?? 0;
  const initialValue = projection[0]?.value ?? 0;
  const variation = ((lastValue - initialValue) / Math.abs(initialValue)) * 100;

  return (
    <AppShell
      title="Proyecciones"
      subtitle="Modelado de escenarios financieros · 12 meses"
    >
      <div className="px-4 md:px-8 py-6 md:py-8 animate-fade-in space-y-8">
        {/* ───────────────────────────────────────────────────────── */}
        {/* SCENARIO TABS                                              */}
        {/* ───────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            className="inline-flex rounded-lg p-0.5"
            role="tablist"
            aria-label="Escenarios"
            style={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
            }}
          >
            {scenarioOrder.map((id) => {
              const s = mockScenarios[id];
              const isActive = activeId === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => selectScenario(id)}
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
                  {s.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer transition-colors"
              style={{
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-card)',
              }}
            >
              <RotateCcw size={13} aria-hidden="true" />
              Restablecer
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
              <Save size={13} aria-hidden="true" />
              Guardar escenario
            </button>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────── */}
        {/* SCENARIO DESCRIPTION + RESULT HEROES                       */}
        {/* ───────────────────────────────────────────────────────── */}
        <section
          aria-labelledby="proj-hero"
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        >
          <h2 id="proj-hero" className="sr-only">
            Resultado del escenario
          </h2>

          <KpiHero
            label={`Caja proyectada · cierre 12 meses (${active.label})`}
            value={lastValue}
            variacion_pct={variation}
            variacion_label="vs hoy"
            secondary={{
              label: 'Runway',
              value: `${active.result.runwayMeses.toFixed(1)} meses`,
            }}
            sources={[
              'Asunciones del escenario activo',
              'Caja inicial al 24/04',
              'Burn rate promedio 6 meses',
            ]}
          />

          <div
            className="card p-6 flex flex-col h-full"
            style={
              active.result.riesgo === 'Alto'
                ? { borderColor: 'rgba(248,113,113,0.35)' }
                : undefined
            }
          >
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.09em]"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Resumen del escenario
            </p>
            <h3
              className="text-2xl font-semibold tracking-tight mt-3"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {active.label}
            </h3>
            <p
              className="text-sm mt-2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {active.description}
            </p>

            <div
              className="mt-auto pt-4 grid grid-cols-3 gap-4"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.09em]"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Margen final
                </p>
                <p
                  className="text-lg font-bold tabular mt-1"
                  style={{ color: 'var(--color-accent)' }}
                >
                  {active.result.margenFinalPct}%
                </p>
              </div>
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.09em]"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Caja final
                </p>
                <p
                  className="text-lg font-bold tabular mt-1"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {formatCLP(active.result.cajaFinal12m, true)}
                </p>
              </div>
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.09em]"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Riesgo
                </p>
                <p
                  className="text-lg font-bold mt-1 inline-flex items-center gap-1.5"
                  style={{
                    color:
                      active.result.riesgo === 'Bajo'
                        ? 'var(--color-income)'
                        : active.result.riesgo === 'Medio'
                        ? 'var(--color-warning)'
                        : 'var(--color-expense)',
                  }}
                >
                  {active.result.riesgo === 'Bajo' ? (
                    <ShieldCheck size={14} aria-hidden="true" />
                  ) : (
                    <AlertTriangle size={14} aria-hidden="true" />
                  )}
                  {active.result.riesgo}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────── */}
        {/* ASSUMPTIONS + PROJECTION                                   */}
        {/* ───────────────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Sliders panel */}
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3
                className="text-sm font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Supuestos
              </h3>
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.09em]"
                style={{ color: 'var(--color-text-muted)' }}
              >
                12 meses
              </span>
            </div>

            <div className="space-y-7">
              <ScenarioSlider
                label="Crecimiento ingresos"
                value={assumptions.growth}
                min={-10}
                max={25}
                step={1}
                format={(v) => `${v >= 0 ? '+' : ''}${v}% / mes`}
                baseline={baseAssumptions.growth}
                onChange={(v) => setAssumptions({ ...assumptions, growth: v })}
                hint="Crecimiento mensual compuesto de ingresos"
              />

              <ScenarioSlider
                label="Inflación gastos"
                value={assumptions.inflation}
                min={0}
                max={15}
                step={1}
                format={(v) => `+${v}% / mes`}
                baseline={baseAssumptions.inflation}
                onChange={(v) =>
                  setAssumptions({ ...assumptions, inflation: v })
                }
                hint="Crecimiento mensual de gastos operacionales"
              />

              <ScenarioSlider
                label="DSO (días para cobrar)"
                value={assumptions.dso}
                min={20}
                max={90}
                step={1}
                format={(v) => `${v} días`}
                baseline={baseAssumptions.dso}
                onChange={(v) => setAssumptions({ ...assumptions, dso: v })}
                hint="Días promedio entre factura emitida y pago recibido"
              />

              <ScenarioSlider
                label="Nuevas contrataciones"
                value={assumptions.hires}
                min={0}
                max={5}
                step={1}
                format={(v) => (v === 0 ? 'Ninguna' : `${v} ${v === 1 ? 'persona' : 'personas'}`)}
                baseline={baseAssumptions.hires}
                onChange={(v) => setAssumptions({ ...assumptions, hires: v })}
                hint="Costo mensual asumido: $1,5M por persona"
              />
            </div>
          </div>

          {/* Projection chart */}
          <div className="lg:col-span-3 card p-6">
            <div className="flex items-end justify-between mb-4">
              <div>
                <h3
                  className="text-base font-semibold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Proyección de caja · 12 meses
                </h3>
                <p
                  className="text-xs mt-1"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Curva sensible a los supuestos del escenario activo
                </p>
              </div>
            </div>
            <ProjectionChart
              data={projectionWithBaseline}
              primaryLabel={`Caja · ${active.label}`}
              baselineLabel="Base"
              height={320}
            />
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────── */}
        {/* SUPPORTING STRIP — comparative                             */}
        {/* ───────────────────────────────────────────────────────── */}
        <section>
          <div className="card overflow-hidden">
            <div
              className="grid grid-cols-3 divide-x"
              style={{ borderColor: 'var(--color-border)' }}
            >
              {scenarioOrder.map((id) => {
                const s = mockScenarios[id];
                const isActive = id === activeId;
                return (
                  <div
                    key={id}
                    className="px-5 py-4 transition-colors cursor-pointer"
                    onClick={() => selectScenario(id)}
                    style={{
                      backgroundColor: isActive
                        ? 'rgba(212,165,116,0.04)'
                        : 'transparent',
                    }}
                  >
                    <p
                      className="text-[11px] font-semibold uppercase tracking-[0.09em]"
                      style={{
                        color: isActive
                          ? 'var(--color-accent)'
                          : 'var(--color-text-muted)',
                      }}
                    >
                      {s.label}
                    </p>
                    <p
                      className="text-xl font-bold leading-tight tabular mt-1.5"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {formatCLP(s.result.cajaFinal12m, true)}
                    </p>
                    <p
                      className="text-xs mt-1.5"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      Runway{' '}
                      <span
                        className="font-semibold tabular"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {s.result.runwayMeses.toFixed(1)} m
                      </span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────── */}
        {/* AI INSIGHT                                                 */}
        {/* ───────────────────────────────────────────────────────── */}
        <section>
          <InsightCard insight={projectionInsight} />
        </section>
      </div>
    </AppShell>
  );
}
