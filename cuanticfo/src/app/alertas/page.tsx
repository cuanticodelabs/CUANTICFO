'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import AlertCard from '@/components/ui/AlertCard';
import { mockAlertas } from '@/lib/mock-data/alertas';
import { cn } from '@/lib/utils/format';

const tabs = ['Todas', 'Financieras', 'Impuestos'] as const;

export default function AlertasPage() {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('Todas');

  const filtered = mockAlertas.filter((a) => {
    if (activeTab === 'Financieras') return ['caja', 'cobranza', 'gasto'].includes(a.tipo);
    if (activeTab === 'Impuestos') return ['clasificacion', 'cierre', 'documento'].includes(a.tipo);
    return true;
  });

  const altas = filtered.filter(a => a.severidad === 'alta').length;
  const medias = filtered.filter(a => a.severidad === 'media').length;
  const bajas = filtered.filter(a => a.severidad === 'baja').length;

  return (
    <AppShell title="Alertas" subtitle="Centro de alertas y notificaciones CFO">
      <div className="p-4 md:p-6 space-y-5 animate-fade-in">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="card p-4 text-center border-l-4 border-red-400">
            <p className="text-2xl font-bold text-red-600">{altas}</p>
            <p className="text-xs text-slate-500 mt-1">Alta severidad</p>
          </div>
          <div className="card p-4 text-center border-l-4 border-orange-400">
            <p className="text-2xl font-bold text-orange-500">{medias}</p>
            <p className="text-xs text-slate-500 mt-1">Media severidad</p>
          </div>
          <div className="card p-4 text-center border-l-4 border-blue-400">
            <p className="text-2xl font-bold text-blue-600">{bajas}</p>
            <p className="text-xs text-slate-500 mt-1">Baja severidad</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
                activeTab === tab
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              )}
            >
              {tab}
              {tab === 'Todas' && (
                <span className="ml-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {mockAlertas.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Alert list */}
        <div className="space-y-3">
          {filtered.map((alerta) => (
            <AlertCard key={alerta.id} alerta={alerta} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm">No hay alertas en esta categoría</p>
            </div>
          )}
        </div>

      </div>
    </AppShell>
  );
}
