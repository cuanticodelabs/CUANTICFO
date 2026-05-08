'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, ChevronDown, Calendar, Command } from 'lucide-react';
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

  useEffect(() => {
    if (!showPeriodos) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowPeriodos(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showPeriodos]);

  const initials = mockUsuario.nombre
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <header
      className="sticky top-0 z-20 px-4 md:px-8 py-4 flex items-center justify-between gap-4"
      style={{
        backgroundColor: 'var(--color-app-bg)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      {/* Left: Title */}
      <div className="flex-1 min-w-0">
        {title && (
          <h1
            className="text-[18px] md:text-[22px] font-semibold tracking-tight truncate"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {title}
          </h1>
        )}
        {subtitle && (
          <p
            className="text-xs truncate hidden md:block mt-0.5"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Center: Period + ⌘K */}
      <div className="flex items-center gap-2">
        {/* Command bar trigger */}
        <button
          type="button"
          aria-label="Buscar"
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors"
          style={{
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
        >
          <Command size={12} aria-hidden="true" />
          <span>Buscar</span>
          <kbd
            className="text-[10px] px-1.5 py-0.5 rounded font-mono"
            style={{ backgroundColor: 'var(--color-app-bg)', color: 'var(--color-text-muted)' }}
          >
            ⌘K
          </kbd>
        </button>

        {/* Period selector */}
        <div className="relative">
          <button
            onClick={() => setShowPeriodos(!showPeriodos)}
            aria-expanded={showPeriodos}
            aria-haspopup="listbox"
            aria-controls="periodo-listbox"
            aria-label={`Período: ${formatPeriodo(periodo)}`}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer'
            )}
            style={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          >
            <Calendar
              size={13}
              style={{ color: 'var(--color-text-muted)' }}
              aria-hidden="true"
            />
            <span className="hidden sm:inline capitalize tabular">
              {formatPeriodo(periodo)}
            </span>
            <span className="sm:hidden tabular">{periodo}</span>
            <ChevronDown
              size={13}
              style={{ color: 'var(--color-text-muted)' }}
              aria-hidden="true"
            />
          </button>

          {showPeriodos && (
            <div
              id="periodo-listbox"
              role="listbox"
              aria-label="Seleccionar período"
              className="absolute top-full right-0 mt-1 w-44 rounded-lg py-1 z-50"
              style={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              }}
            >
              {PERIODOS.map((p) => {
                const isSelected = p === periodo;
                return (
                  <button
                    key={p}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onPeriodoChange(p);
                      setShowPeriodos(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm capitalize transition-colors cursor-pointer tabular"
                    style={{
                      color: isSelected
                        ? 'var(--color-accent)'
                        : 'var(--color-text-primary)',
                      backgroundColor: isSelected
                        ? 'var(--color-accent-tint)'
                        : 'transparent',
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    {formatPeriodo(p)}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right: Bell + Avatar */}
      <div className="flex items-center gap-3">
        <Link
          href="/alertas"
          className="relative p-1.5 rounded-lg transition-colors cursor-pointer"
          aria-label="Alertas, 5 sin leer"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <Bell size={18} aria-hidden="true" />
          <span
            className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full text-[9px] font-bold flex items-center justify-center tabular"
            style={{
              backgroundColor: 'var(--color-expense)',
              color: 'var(--color-app-bg)',
            }}
            aria-hidden="true"
          >
            5
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              backgroundColor: 'var(--color-accent-tint)',
              color: 'var(--color-accent)',
              border: '1px solid var(--color-border)',
            }}
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="hidden md:block">
            <p
              className="text-xs font-semibold leading-none"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {mockUsuario.nombre}
            </p>
            <p
              className="text-[11px] capitalize mt-0.5"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {mockUsuario.rol}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
