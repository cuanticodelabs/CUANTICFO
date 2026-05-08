'use client';

import AppShell from '@/components/layout/AppShell';
import {
  mockEstadoResultados,
  mockEstadoResultadosHistorico,
} from '@/lib/mock-data/reportes';
import { mockDistribucionGastosBars } from '@/lib/mock-data/dashboard';
import HBarList from '@/components/charts/HBarList';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { formatCLP } from '@/lib/utils/format';
import { Download, Share2, Printer } from 'lucide-react';

interface PnlRowProps {
  label: string;
  value: number;
  /** "subtotal" rows are heavier and get a top border. */
  subtotal?: boolean;
  /** "total" rows are the headline numbers (Margen bruto, Resultado op., etc.). */
  total?: boolean;
  /** Indent level (0 = none, 1 = nested line item). */
  indent?: number;
}

function PnlRow({ label, value, subtotal, total, indent = 0 }: PnlRowProps) {
  const isNegative = value < 0;
  const valueColor = total
    ? 'var(--color-accent)'
    : subtotal
    ? 'var(--color-text-primary)'
    : isNegative
    ? 'var(--color-expense)'
    : 'var(--color-text-secondary)';

  return (
    <div
      className="flex items-baseline justify-between py-2.5"
      style={{
        borderTop: subtotal || total ? '1px solid var(--color-border)' : 'none',
        marginTop: subtotal || total ? 6 : 0,
      }}
    >
      <span
        className={`text-sm ${total ? 'font-semibold' : subtotal ? 'font-semibold' : 'font-normal'}`}
        style={{
          color: total
            ? 'var(--color-text-primary)'
            : subtotal
            ? 'var(--color-text-primary)'
            : 'var(--color-text-secondary)',
          paddingLeft: indent * 16,
        }}
      >
        {label}
      </span>
      <span
        className={`text-sm tabular font-mono ${total ? 'text-base' : ''} font-semibold`}
        style={{ color: valueColor }}
      >
        {formatCLP(value)}
      </span>
    </div>
  );
}

export default function EstadoResultadosPage() {
  const er = mockEstadoResultados;
  const margenBrutoPct = (er.margen_bruto / er.ingresos_operacionales) * 100;
  const margenOperacionalPct =
    (er.resultado_operacional / er.ingresos_operacionales) * 100;

  return (
    <AppShell
      title="Estado de resultados"
      subtitle="Abril 2026 · CuantiCode Labs SpA"
    >
      <div className="px-4 md:px-8 py-6 md:py-8 animate-fade-in">
        {/* ───────────────────────────────────────────────────────── */}
        {/* DOCUMENT TOOLBAR                                           */}
        {/* ───────────────────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Informe ejecutivo · Mensual
          </p>
          <div className="flex items-center gap-1">
            <ToolbarButton aria-label="Imprimir">
              <Printer size={14} />
            </ToolbarButton>
            <ToolbarButton aria-label="Compartir">
              <Share2 size={14} />
            </ToolbarButton>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-colors ml-1"
              style={{
                color: 'var(--color-app-bg)',
                background:
                  'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
              }}
            >
              <Download size={13} aria-hidden="true" />
              PDF
            </button>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────── */}
        {/* DOCUMENT — single 720px reading column                    */}
        {/* ───────────────────────────────────────────────────────── */}
        <article
          className="card max-w-3xl mx-auto p-8 md:p-10 space-y-10"
          aria-label="Informe estado de resultados"
        >
          {/* Header */}
          <header
            className="pb-6"
            style={{ borderBottom: '1px solid var(--color-border)' }}
          >
            <h1
              className="text-2xl md:text-3xl font-semibold tracking-tight"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Estado de resultados · Abril 2026
            </h1>
            <p
              className="text-sm mt-2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              CuantiCode Labs SpA · Período mensual cerrado al 30 de abril de 2026
            </p>
            <div
              className="mt-4 grid grid-cols-3 gap-6"
              style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}
            >
              <Stat
                label="Margen bruto"
                value={`${margenBrutoPct.toFixed(0)}%`}
                sub={formatCLP(er.margen_bruto, true)}
              />
              <Stat
                label="Resultado op."
                value={`${margenOperacionalPct.toFixed(0)}%`}
                sub={formatCLP(er.resultado_operacional, true)}
                accent
              />
              <Stat
                label="Antes impuestos"
                value={formatCLP(er.resultado_antes_impuestos, true)}
              />
            </div>
          </header>

          {/* Summary section */}
          <section>
            <SectionLabel>Resumen</SectionLabel>
            <p
              className="text-base leading-relaxed"
              style={{ color: 'var(--color-text-primary)' }}
            >
              La empresa generó un{' '}
              <strong style={{ color: 'var(--color-accent)' }}>
                resultado antes de impuestos de {formatCLP(er.resultado_antes_impuestos, true)}
              </strong>{' '}
              en abril, con un margen operacional del{' '}
              <strong className="tabular">{margenOperacionalPct.toFixed(0)}%</strong>,{' '}
              cuatro puntos sobre el promedio histórico. La rentabilidad fue impulsada por un
              cambio favorable en el mix de ingresos hacia Servicios (+22% MoM), categoría con
              el margen más alto del portafolio.
            </p>
          </section>

          {/* Exhibit 1 — Detailed P&L */}
          <section>
            <SectionLabel>Exhibit 1 · Detalle del resultado</SectionLabel>
            <div className="space-y-0">
              <PnlRow
                label="Ingresos operacionales"
                value={er.ingresos_operacionales}
              />
              <PnlRow label="Costos directos" value={er.costos_directos} indent={1} />
              <PnlRow label="Margen bruto" value={er.margen_bruto} subtotal />

              <div className="pt-3" />
              <PnlRow
                label="Gastos administración"
                value={er.gastos_administracion}
                indent={1}
              />
              <PnlRow label="Gastos ventas" value={er.gastos_ventas} indent={1} />
              <PnlRow
                label="Gastos tecnología"
                value={er.gastos_tecnologia}
                indent={1}
              />
              <PnlRow
                label="Resultado operacional"
                value={er.resultado_operacional}
                total
              />

              <div className="pt-3" />
              <PnlRow label="Otros ingresos" value={er.otros_ingresos} indent={1} />
              <PnlRow label="Otros egresos" value={er.otros_egresos} indent={1} />
              <PnlRow
                label="Resultado antes de impuestos"
                value={er.resultado_antes_impuestos}
                total
              />
            </div>
          </section>

          {/* Exhibit 2 — Trend */}
          <section>
            <SectionLabel>Exhibit 2 · Evolución del resultado · 6 meses</SectionLabel>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={mockEstadoResultadosHistorico} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="2 4"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="mes"
                  tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => formatCLP(v, true)}
                  width={55}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border-strong)',
                    borderRadius: 8,
                    fontSize: 12,
                    color: 'var(--color-text-primary)',
                  }}
                  formatter={(v) => formatCLP(Number(v))}
                />
                <Line
                  type="monotone"
                  dataKey="resultado"
                  stroke="var(--color-accent)"
                  strokeWidth={2.5}
                  dot={{ fill: 'var(--color-accent)', r: 3, strokeWidth: 0 }}
                  activeDot={{
                    r: 5,
                    fill: 'var(--color-accent)',
                    stroke: 'var(--color-app-bg)',
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
            <p
              className="text-[11px] mt-3"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Fuente: cierres mensuales noviembre 2025 — abril 2026.
            </p>
          </section>

          {/* Exhibit 3 — Distribution */}
          <section>
            <SectionLabel>Exhibit 3 · Distribución de gastos · Abril</SectionLabel>
            <HBarList
              items={mockDistribucionGastosBars}
              showAmount={true}
            />
          </section>

          {/* Findings */}
          <section>
            <SectionLabel>Findings</SectionLabel>
            <ul className="space-y-3">
              <Finding>
                Margen operacional al{' '}
                <strong className="tabular">
                  {margenOperacionalPct.toFixed(0)}%
                </strong>{' '}
                — 4 puntos sobre marzo. El mix de Servicios explica la subida; sostenerlo
                cierra el Q2 con margen ≈30%.
              </Finding>
              <Finding warn>
                Tecnología subió{' '}
                <strong className="tabular">+31% YoY</strong> sin un alza proporcional de
                ingresos. Investigar el contrato vigente de Google Cloud antes del cierre
                de mayo.
              </Finding>
              <Finding>
                DSO bajó a{' '}
                <strong className="tabular">47 días</strong> (vs 52 días en marzo); la
                cobranza está convergiendo al objetivo interno de 45 días.
              </Finding>
            </ul>
          </section>
        </article>
      </div>
    </AppShell>
  );
}

/* ───────────────────────────────────────────────────────────── */
/* Document atoms                                                 */
/* ───────────────────────────────────────────────────────────── */

function ToolbarButton({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="p-2 rounded-md cursor-pointer transition-colors"
      style={{ color: 'var(--color-text-muted)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
        e.currentTarget.style.color = 'var(--color-text-primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = 'var(--color-text-muted)';
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-4"
      style={{ color: 'var(--color-text-muted)' }}
    >
      {children}
    </h2>
  );
}

function Stat({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p
        className="text-[10px] font-semibold uppercase tracking-[0.09em]"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {label}
      </p>
      <p
        className="text-xl font-semibold tabular tracking-tight mt-1"
        style={{
          color: accent ? 'var(--color-accent)' : 'var(--color-text-primary)',
        }}
      >
        {value}
      </p>
      {sub && (
        <p
          className="text-[11px] tabular mt-0.5"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

function Finding({
  children,
  warn,
}: {
  children: React.ReactNode;
  warn?: boolean;
}) {
  return (
    <li className="flex items-start gap-3 text-sm leading-relaxed">
      <span
        className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full"
        style={{
          backgroundColor: warn
            ? 'var(--color-warning)'
            : 'var(--color-accent)',
        }}
        aria-hidden="true"
      />
      <span style={{ color: 'var(--color-text-primary)' }}>{children}</span>
    </li>
  );
}
