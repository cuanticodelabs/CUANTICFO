'use client';

import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

interface TraceTooltipProps {
  /** Short label for the source data (e.g., "facturas mayo, F29 abril"). */
  sources: string[];
  /** Optional last-updated label. */
  updatedAt?: string;
  /** Optional confidence (0–1). Renders as a thin bar. */
  confidence?: number;
  className?: string;
}

/**
 * TraceTooltip — provenance for any AI- or formula-derived number.
 * Click/hover to reveal "Calculado a partir de…". This is what makes the user trust the number.
 */
export default function TraceTooltip({
  sources,
  updatedAt,
  confidence,
  className,
}: TraceTooltipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  return (
    <span ref={ref} className={`relative inline-flex ${className ?? ''}`}>
      <button
        type="button"
        aria-label="Ver fuente del cálculo"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full transition-colors cursor-pointer"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <Info size={12} aria-hidden="true" />
      </button>

      {open && (
        <span
          role="tooltip"
          className="absolute z-50 left-0 top-5 w-64 p-3 rounded-lg text-xs"
          style={{
            backgroundColor: 'var(--color-text-primary)',
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          }}
        >
          <p className="font-semibold mb-1.5 text-[11px] uppercase tracking-[0.06em] opacity-80">
            Calculado a partir de
          </p>
          <ul className="space-y-1">
            {sources.map((s) => (
              <li key={s} className="flex gap-1.5">
                <span className="opacity-60">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>

          {confidence !== undefined && (
            <div className="mt-2 pt-2 border-t border-white/15">
              <p className="text-[10px] uppercase tracking-[0.06em] opacity-70 mb-1">
                Confianza {Math.round(confidence * 100)}%
              </p>
              <div className="h-1 rounded-full bg-white/15 overflow-hidden">
                <div
                  className="h-full"
                  style={{
                    width: `${Math.round(confidence * 100)}%`,
                    backgroundColor: 'var(--color-ai)',
                  }}
                />
              </div>
            </div>
          )}

          {updatedAt && (
            <p className="mt-2 text-[10px] opacity-60">Actualizado {updatedAt}</p>
          )}
        </span>
      )}
    </span>
  );
}
