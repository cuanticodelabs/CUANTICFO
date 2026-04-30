'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import MovementTable from '@/components/ui/MovementTable';
import MovementListMobile from '@/components/ui/MovementListMobile';
import { mockMovimientos } from '@/lib/mock-data/movimientos';
import { cn } from '@/lib/utils/format';
import { Search, SlidersHorizontal, Plus } from 'lucide-react';

const tabs = ['Todos', 'Ingresos', 'Gastos', 'Transferencias'];

export default function MovimientosPage() {
  const [activeTab, setActiveTab] = useState('Todos');
  const [search, setSearch] = useState('');

  const filtered = mockMovimientos.filter((m) => {
    if (activeTab === 'Ingresos') return m.tipo === 'ingreso';
    if (activeTab === 'Gastos') return m.tipo === 'gasto';
    if (activeTab === 'Transferencias') return m.tipo === 'transferencia';
    return true;
  }).filter((m) =>
    search === '' ||
    m.documento.toLowerCase().includes(search.toLowerCase()) ||
    m.cliente_proveedor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell title="Movimientos" subtitle="Todos los movimientos financieros del período">
      <div className="p-4 md:p-6 space-y-4 animate-fade-in">

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
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
              </button>
            ))}
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-52">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar movimiento..."
                className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 bg-white hover:bg-slate-50">
              <SlidersHorizontal size={15} />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 rounded-xl text-sm text-white hover:bg-blue-700">
              <Plus size={15} />
              <span className="hidden sm:inline">Nuevo</span>
            </button>
          </div>
        </div>

        {/* Table / List */}
        <div className="hidden md:block">
          <MovementTable movimientos={filtered} />
        </div>
        <div className="md:hidden card overflow-hidden">
          <MovementListMobile movimientos={filtered} />
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p className="text-sm">No se encontraron movimientos</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
