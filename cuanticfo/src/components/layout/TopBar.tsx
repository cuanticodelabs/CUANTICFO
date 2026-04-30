'use client';

import { useState } from 'react';
import { Search, Bell, ChevronDown, Calendar } from 'lucide-react';
import { cn, formatPeriodo } from '@/lib/utils/format';
import { mockUsuario } from '@/lib/mock-data/dashboard';

const PERIODOS = [
  '2026-04', '2026-03', '2026-02', '2026-01',
  '2025-12', '2025-11', '2025-10',
];

interface TopBarProps {
  periodo: string;
  onPeriodoChange: (p: string) => void;
  title?: string;
  subtitle?: string;
}

export default function TopBar({ periodo, onPeriodoChange, title, subtitle }: TopBarProps) {
  const [showPeriodos, setShowPeriodos] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex items-center justify-between gap-4">
      {/* Left: Title */}
      <div className="flex-1 min-w-0">
        {title && (
          <h1 className="text-lg md:text-xl font-bold text-slate-900 truncate">{title}</h1>
        )}
        {subtitle && (
          <p className="text-xs text-slate-500 truncate hidden md:block">{subtitle}</p>
        )}
      </div>

      {/* Center: Controls */}
      <div className="flex items-center gap-2">
        {/* Month Selector */}
        <div className="relative">
          <button
            onClick={() => setShowPeriodos(!showPeriodos)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors',
              'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            )}
          >
            <Calendar size={15} className="text-slate-400" />
            <span className="hidden sm:inline capitalize">
              {formatPeriodo(periodo)}
            </span>
            <span className="sm:hidden">{periodo}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {showPeriodos && (
            <div className="absolute top-full right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
              {PERIODOS.map((p) => (
                <button
                  key={p}
                  onClick={() => { onPeriodoChange(p); setShowPeriodos(false); }}
                  className={cn(
                    'w-full text-left px-4 py-2 text-sm capitalize hover:bg-slate-50 transition-colors',
                    p === periodo ? 'text-blue-600 font-semibold bg-blue-50' : 'text-slate-700'
                  )}
                >
                  {formatPeriodo(p)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filters & New — desktop only */}
        <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
          <Search size={15} />
          <span>Buscar</span>
        </button>

        <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
          + Nuevo
        </button>
      </div>

      {/* Right: Bell + Avatar */}
      <div className="flex items-center gap-3">
        <Link_Bell />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white text-sm font-bold">
            {mockUsuario.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-800 leading-none">{mockUsuario.nombre}</p>
            <p className="text-xs text-slate-400 capitalize">{mockUsuario.rol}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function Link_Bell() {
  return (
    <a href="/alertas" className="relative p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
      <Bell size={20} className="text-slate-500" />
      <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
        5
      </span>
    </a>
  );
}
