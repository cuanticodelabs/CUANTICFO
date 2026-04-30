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
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">

        {/* ── KPI CARDS ── */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {mockKpis.map((kpi) => (
              <KpiCard key={kpi.label} kpi={kpi} />
            ))}
          </div>
        </section>

        {/* ── CHARTS ROW ── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Cuentas por cobrar */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-1">Cuentas por cobrar</h3>
            <p className="text-xs text-slate-500 mb-3">Total · {mockCuentasPorCobrar.clientes} clientes</p>
            <p className="text-2xl font-bold text-slate-900 mb-3">
              {formatCLP(mockCuentasPorCobrar.total)}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Vencidas</span>
                <span className="text-red-600 font-semibold">{formatCLP(mockCuentasPorCobrar.vencidas)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Por vencer (30 días)</span>
                <span className="text-orange-500 font-semibold">{formatCLP(mockCuentasPorCobrar.por_vencer_30d)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Por vencer (&gt;30 días)</span>
                <span className="text-slate-700 font-semibold">{formatCLP(mockCuentasPorCobrar.por_vencer_mas_30d)}</span>
              </div>
            </div>
            <a href="/ingresos" className="mt-3 flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium">
              Ver detalle <ExternalLink size={11} />
            </a>
          </div>

          {/* Cuentas por pagar */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-1">Cuentas por pagar</h3>
            <p className="text-xs text-slate-500 mb-3">Total · {mockCuentasPorPagar.proveedores} proveedores</p>
            <p className="text-2xl font-bold text-slate-900 mb-3">
              {formatCLP(mockCuentasPorPagar.total)}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Vencidas</span>
                <span className="text-red-600 font-semibold">{formatCLP(mockCuentasPorPagar.vencidas)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Por vencer (30 días)</span>
                <span className="text-orange-500 font-semibold">{formatCLP(mockCuentasPorPagar.por_vencer_30d)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Por vencer (&gt;30 días)</span>
                <span className="text-slate-700 font-semibold">{formatCLP(mockCuentasPorPagar.por_vencer_mas_30d)}</span>
              </div>
            </div>
            <a href="/gastos" className="mt-3 flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium">
              Ver detalle <ExternalLink size={11} />
            </a>
          </div>

          {/* Alertas */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-800">Alertas importantes</h3>
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {alertasActivas.length}
              </span>
            </div>
            <div className="space-y-0 divide-y divide-slate-100">
              {alertasActivas.slice(0, 4).map((alerta) => (
                <AlertCard key={alerta.id} alerta={alerta} compact />
              ))}
            </div>
            <a href="/alertas" className="mt-3 flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium">
              Ver todas las alertas <ExternalLink size={11} />
            </a>
          </div>

          {/* Checklist cierre */}
          <div>
            <ClosePeriodChecklist cierre={mockCierre} />
            <a href="/cierres" className="mt-2 flex items-center justify-center gap-1 text-xs text-blue-600 hover:underline font-medium">
              Continuar cierre <ExternalLink size={11} />
            </a>
          </div>
        </section>

        {/* ── CUENTAS BANCARIAS + ACCIONES RÁPIDAS ── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Cuentas bancarias */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-800">Cuentas bancarias</h3>
              <a href="/configuracion" className="text-xs text-blue-600 hover:underline">Ver todas</a>
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
                    <p className="text-sm font-semibold text-slate-800 truncate">{cuenta.banco}</p>
                    <p className="text-xs text-slate-400 truncate">
                      {cuenta.tipo} {cuenta.numero && `· ${cuenta.numero}`}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-slate-900 whitespace-nowrap">
                    {formatCLP(cuenta.saldo, true)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="lg:col-span-2 card p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Acciones rápidas</h3>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
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
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-800">Últimos movimientos</h2>
            <a href="/movimientos" className="text-xs text-blue-600 hover:underline font-medium">
              Ver todos los movimientos →
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
