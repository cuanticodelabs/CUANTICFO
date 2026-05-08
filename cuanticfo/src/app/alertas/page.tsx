'use client';

import { useMemo, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import AlertCard from '@/components/ui/AlertCard';
import { mockAlertas } from '@/lib/mock-data/alertas';
import {
  Bell,
  CheckCircle,
  ArchiveRestore,
} from 'lucide-react';

const tabs = [
  { id: 'todas', label: 'Todas' },
  { id: 'activas', label: 'Activas' },
  { id: 'resueltas', label: 'Resueltas' },
] as const;
type TabId = (typeof tabs)[number]['id'];

const groups = [
  { id: 'todas', label: 'Todas las categorías' },
  { id: 'financieras', label: 'Financieras' },
  { id: 'tributarias', label: 'Tributarias' },
] as const;
type GroupId = (typeof groups)[number]['id'];

export default function AlertasPage() {
  const [activeTab, setActiveTab] = useState<TabId>('activas');
  const [activeGroup, setActiveGroup] = useState<GroupId>('todas');

  const filtered = useMemo(() => {
    return mockAlertas
      .filter((a) => {
        if (activeTab === 'activas') return a.estado === 'activa';
        if (activeTab === 'resueltas') return a.estado !== 'activa';
        return true;
      })
      .filter((a) => {
        if (activeGroup === 'financieras')
          return ['caja', 'cobranza', 'gasto'].includes(a.tipo);
        if (activeGroup === 'tributarias')
          return ['clasificacion', 'cierre', 'documento'].includes(a.tipo);
        return true;
      });
  }, [activeTab, activeGroup]);

  const altas = mockAlertas.filter(
    (a) => a.severidad === 'alta' && a.estado === 'activa'
  ).length;
  const medias = mockAlertas.filter(
    (a) => a.severidad === 'media' && a.estado === 'activa'
  ).length;
  const bajas = mockAlertas.filter(
    (a) => a.severidad === 'baja' && a.estado === 'activa'
  ).length;
  const totalActivas = altas + medias + bajas;

  return (
    <AppShell title="Alertas" subtitle="Centro de alertas y notificaciones">
      <div className="px-4 md:px-8 py-6 md:py-8 animate-fade-in space-y-6">
        {/* Status row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            className="flex items-center gap-4 text-xs"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span className="flex items-center gap-2">
              <Bell size={12} aria-hidden="true" />
              <span className="tabular">{totalActivas}</span> alertas activas
            </span>
            <span style={{ color: 'var(--color-border-strong)' }}>·</span>
            <span>
              <span
                className="font-semibold tabular"
                style={{ color: 'var(--color-expense)' }}
              >
                {altas}
              </span>{' '}
              críticas
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
              <ArchiveRestore size={13} aria-hidden="true" />
              Ver descartadas
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer transition-colors"
              style={{
                color: 'var(--color-income)',
                border: '1px solid rgba(74,222,128,0.2)',
                backgroundColor: 'var(--color-income-tint)',
              }}
            >
              <CheckCircle size={13} aria-hidden="true" />
              Marcar todas como resueltas
            </button>
          </div>
        </div>

        {/* Severity strip */}
        <section>
          <div className="card overflow-hidden">
            <div
              className="grid grid-cols-3 divide-x"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <SeverityCell
                label="Alta"
                count={altas}
                color="var(--color-expense)"
              />
              <SeverityCell
                label="Media"
                count={medias}
                color="var(--color-warning)"
              />
              <SeverityCell
                label="Baja"
                count={bajas}
                color="var(--color-accent)"
              />
            </div>
          </div>
        </section>

        {/* Tabs (state) + Filter (group) */}
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div
            className="inline-flex rounded-lg p-0.5"
            role="tablist"
            aria-label="Estado de alertas"
            style={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const count =
                tab.id === 'activas'
                  ? totalActivas
                  : tab.id === 'todas'
                  ? mockAlertas.length
                  : mockAlertas.filter((a) => a.estado !== 'activa').length;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer transition-colors flex items-center gap-1.5"
                  style={{
                    color: isActive
                      ? 'var(--color-app-bg)'
                      : 'var(--color-text-secondary)',
                    backgroundColor: isActive
                      ? 'var(--color-accent)'
                      : 'transparent',
                  }}
                >
                  {tab.label}
                  <span
                    className="text-[10px] tabular"
                    style={{
                      color: isActive
                        ? 'var(--color-app-bg)'
                        : 'var(--color-text-muted)',
                      opacity: isActive ? 0.7 : 1,
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Group filter chips */}
          <div className="flex items-center gap-1.5">
            {groups.map((g) => {
              const isActive = activeGroup === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setActiveGroup(g.id)}
                  className="text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer transition-colors"
                  style={{
                    color: isActive
                      ? 'var(--color-text-primary)'
                      : 'var(--color-text-muted)',
                    backgroundColor: isActive
                      ? 'rgba(255,255,255,0.04)'
                      : 'transparent',
                    border: `1px solid ${isActive ? 'var(--color-border)' : 'transparent'}`,
                  }}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Alert list */}
        <section className="space-y-3">
          {filtered.length === 0 ? (
            <div
              className="card p-12 text-center"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <CheckCircle
                size={28}
                className="mx-auto mb-3"
                style={{ color: 'var(--color-income)' }}
                aria-hidden="true"
              />
              <p
                className="text-sm font-semibold mb-1"
                style={{ color: 'var(--color-text-primary)' }}
              >
                No hay alertas en esta vista
              </p>
              <p className="text-xs">
                Todo está bajo control para los filtros seleccionados.
              </p>
            </div>
          ) : (
            filtered.map((alerta) => (
              <AlertCard key={alerta.id} alerta={alerta} />
            ))
          )}
        </section>
      </div>
    </AppShell>
  );
}

/* ───────────────────────────────────────────────────────────── */

function SeverityCell({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.06em]"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {label}
        </p>
      </div>
      <p
        className="text-2xl font-bold tabular leading-none"
        style={{ color }}
      >
        {count}
      </p>
      <p
        className="text-[11px] mt-1.5"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {count === 0 ? 'Sin alertas' : count === 1 ? 'alerta activa' : 'alertas activas'}
      </p>
    </div>
  );
}
