'use client';

import AppShell from '@/components/layout/AppShell';
import KpiCard from '@/components/ui/KpiCard';
import FinancialChartCard from '@/components/ui/FinancialChartCard';
import TaxSummaryCard from '@/components/ui/TaxSummaryCard';
import AlertCard from '@/components/ui/AlertCard';
import MovementTable from '@/components/ui/MovementTable';
import MovementListMobile from '@/components/ui/MovementListMobile';
import ClosePeriodChecklist from '@/components/ui/ClosePeriodChecklist';
import DonutChart from '@/components/charts/DonutChart';
import QuickActionButton from '@/components/ui/QuickActionButton';
import { formatCLP } from '@/lib/utils/format';
import {
  mockKpis,
  mockChartData,
  mockDistribucionGastos,
  mockCuentasBancarias,
  mockCuentasPorCobrar,
  mockCuentasPorPagar,
  mockUltimosMovimientos,
  mockEmpresa,
} from '@/lib/mock-data/dashboard';
import { mockAlertas, mockImpuesto, mockCierre } from '@/lib/mock-data/alertas';
import {
  TrendingUp,
  TrendingDown,
  Upload,
  BookOpen,
  ShoppingBag,
  Receipt,
  BarChart2,
  Droplets,
  ExternalLink,
  Building2,
} from 'lucide-react';

const quickActions = [
  { label: 'Nuevo ingreso',    href: '/ingresos',                icon: TrendingUp,  color: 'green'  as const },
  { label: 'Nuevo gasto',      href: '/gastos',                  icon: TrendingDown, color: 'red'   as const },
  { label: 'Subir documento',  href: '/documentos',              icon: Upload,      color: 'blue'   as const },
  { label: 'Libro de compras', href: '/libros',                  icon: ShoppingBag, color: 'purple' as const },
  { label: 'Libro de ventas',  href: '/libros',                  icon: BookOpen,    color: 'orange' as const },
  { label: 'Preparar F29',     href: '/impuestos/f29',           icon: Receipt,     color: 'blue'   as const },
  { label: 'Estado de resultados', href: '/reportes/estado-resultados', icon: BarChart2, color: 'gray' as const },
  { label: 'Flujo de caja',    href: '/reportes/flujo-caja',    icon: Droplets,    color: 'blue'   as const },
];

export default function DashboardPage() {
  const alertasActivas = mockAlertas.filter((a) => a.estado === 'activa');

  return (
    <AppShell
      title="Dashboard"
      subtitle={`Resumen financiero de ${mockEmpresa.razon_social}`}
    >
      <div className="p-4 md:p-6 animate-fade-in">

        {/* ── KPI SUMMARY ── */}
        <section>
          {/* Primary: resultado + caja answer the two core questions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            {mockKpis
              .filter((k) => k.tipo === 'resultado' || k.tipo === 'caja')
              .map((kpi) => (
                <KpiCard key={kpi.label} kpi={kpi} variant="featured" />
              ))}
          </div>
          {/* Supporting: ingresos, gastos, IVA — one card, three columns */}
          <div className="card overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-border)]">
              {mockKpis
                .filter((k) => k.tipo !== 'resultado' && k.tipo !== 'caja')
                .map((kpi) => (
                  <KpiCard key={kpi.label} kpi={kpi} variant="compact" />
                ))}
            </div>
          </div>
        </section>

        {/* ── CHARTS ROW ── */}
        <section className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <FinancialChartCard data={mockChartData} />
          </div>
          <div className="lg:col-span-1">
            <TaxSummaryCard data={mockImpuesto} />
          </div>
          <div className="lg:col-span-1">
            <DonutChart
              data={mockDistribucionGastos}
              title="Distribución de gastos"
              centerLabel="Total gastos"
              centerValue={13_250_000}
            />
          </div>
        </section>

        {/* ── CUENTAS POR COBRAR / PAGAR + ALERTAS + CIERRE ── */}
        <section className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Cuentas por cobrar */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Cuentas por cobrar</h3>
            <p className="text-xs mb-3" style={{ color: 'var(--color-text-secondary)' }}>Total · {mockCuentasPorCobrar.clientes} clientes</p>
            <p className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
              {formatCLP(mockCuentasPorCobrar.total)}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>Vencidas</span>
                <span className="amount-negative">{formatCLP(mockCuentasPorCobrar.vencidas)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>Por vencer (30 días)</span>
                <span className="font-semibold" style={{ color: 'var(--color-alert-medium)' }}>{formatCLP(mockCuentasPorCobrar.por_vencer_30d)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>Por vencer (&gt;30 días)</span>
                <span className="font-semibold" style={{ color: 'var(--color-text-contrast)' }}>{formatCLP(mockCuentasPorCobrar.por_vencer_mas_30d)}</span>
              </div>
            </div>
            <a href="/ingresos" className="mt-3 flex items-center gap-1 text-xs hover:underline font-medium" style={{ color: 'var(--color-accent)' }}>
              Ver detalle <ExternalLink size={11} />
            </a>
          </div>

          {/* Cuentas por pagar */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Cuentas por pagar</h3>
            <p className="text-xs mb-3" style={{ color: 'var(--color-text-secondary)' }}>Total · {mockCuentasPorPagar.proveedores} proveedores</p>
            <p className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
              {formatCLP(mockCuentasPorPagar.total)}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>Vencidas</span>
                <span className="amount-negative">{formatCLP(mockCuentasPorPagar.vencidas)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>Por vencer (30 días)</span>
                <span className="font-semibold" style={{ color: 'var(--color-alert-medium)' }}>{formatCLP(mockCuentasPorPagar.por_vencer_30d)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>Por vencer (&gt;30 días)</span>
                <span className="font-semibold" style={{ color: 'var(--color-text-contrast)' }}>{formatCLP(mockCuentasPorPagar.por_vencer_mas_30d)}</span>
              </div>
            </div>
            <a href="/gastos" className="mt-3 flex items-center gap-1 text-xs hover:underline font-medium" style={{ color: 'var(--color-accent)' }}>
              Ver detalle <ExternalLink size={11} />
            </a>
          </div>

          {/* Alertas */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Alertas importantes</h3>
              <span className="text-white text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-alert-high)' }}>
                {alertasActivas.length}
              </span>
            </div>
            <div className="space-y-0 divide-y divide-slate-100">
              {alertasActivas.slice(0, 4).map((alerta) => (
                <AlertCard key={alerta.id} alerta={alerta} compact />
              ))}
            </div>
            <a href="/alertas" className="mt-3 flex items-center gap-1 text-xs hover:underline font-medium" style={{ color: 'var(--color-accent)' }}>
              Ver todas las alertas <ExternalLink size={11} />
            </a>
          </div>

          {/* Checklist cierre */}
          <div>
            <ClosePeriodChecklist cierre={mockCierre} />
            <a href="/cierres" className="mt-2 flex items-center justify-center gap-1 text-xs hover:underline font-medium" style={{ color: 'var(--color-accent)' }}>
              Continuar cierre <ExternalLink size={11} />
            </a>
          </div>
        </section>

        {/* ── CUENTAS BANCARIAS + ACCIONES RÁPIDAS ── */}
        <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Cuentas bancarias */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Cuentas bancarias</h3>
              <a href="/configuracion" className="text-xs hover:underline" style={{ color: 'var(--color-accent)' }}>Ver todas</a>
            </div>
            <div className="space-y-3">
              {mockCuentasBancarias.map((cuenta) => (
                <div key={cuenta.id} className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: cuenta.color + '20' }}
                  >
                    <Building2 size={16} style={{ color: cuenta.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>{cuenta.banco}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                      {cuenta.tipo} {cuenta.numero && `· ${cuenta.numero}`}
                    </p>
                  </div>
                  <p className="text-sm font-bold whitespace-nowrap" style={{ color: 'var(--color-text-primary)' }}>
                    {formatCLP(cuenta.saldo, true)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="lg:col-span-2 card p-5">
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Acciones rápidas</h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {quickActions.map((action) => (
                <QuickActionButton
                  key={action.label}
                  label={action.label}
                  href={action.href}
                  icon={action.icon}
                  color={action.color}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── ÚLTIMOS MOVIMIENTOS ── */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2
              className="text-[11px] font-semibold uppercase tracking-[0.09em]"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Últimos movimientos
            </h2>
            <a href="/movimientos" className="text-xs font-medium hover:underline" style={{ color: 'var(--color-accent)' }}>
              Ver todos →
            </a>
          </div>
          {/* Desktop */}
          <div className="hidden md:block">
            <MovementTable movimientos={mockUltimosMovimientos} />
          </div>
          {/* Mobile */}
          <div className="md:hidden card overflow-hidden">
            <MovementListMobile movimientos={mockUltimosMovimientos} />
          </div>
        </section>

      </div>
    </AppShell>
  );
}
