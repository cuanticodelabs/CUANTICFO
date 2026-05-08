'use client';

import Link from 'next/link';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import TraceTooltip from './TraceTooltip';

export interface InsightAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'ghost';
}

export interface AiInsight {
  id: string;
  /** One sentence — that's the contract. */
  message: string;
  severity?: 'info' | 'warn' | 'opportunity';
  sources: string[];
  confidence?: number;
  updatedAt?: string;
  actions?: InsightAction[];
}

interface InsightCardProps {
  insight: AiInsight;
  onDismiss?: (id: string) => void;
  className?: string;
}

/**
 * InsightCard — the AI CFO's voice, inline.
 * Indigo tint surface, single sentence, every number traceable.
 */
export default function InsightCard({ insight, onDismiss, className }: InsightCardProps) {
  return (
    <div className={`surface-ai p-5 ${className ?? ''}`}>
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'var(--color-ai)', color: '#ffffff' }}
          aria-hidden="true"
        >
          <Sparkles size={15} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.09em]"
              style={{ color: 'var(--color-ai-dark)' }}
            >
              CFO Asistente
            </span>
            <TraceTooltip
              sources={insight.sources}
              confidence={insight.confidence}
              updatedAt={insight.updatedAt}
            />
          </div>

          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {insight.message}
          </p>

          {insight.actions && insight.actions.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {insight.actions.map((a) =>
                a.href ? (
                  <Link
                    key={a.label}
                    href={a.href}
                    className="inline-flex items-center gap-1 text-xs font-semibold cursor-pointer transition-colors"
                    style={{
                      color:
                        a.variant === 'ghost'
                          ? 'var(--color-text-secondary)'
                          : 'var(--color-ai-dark)',
                    }}
                  >
                    {a.label}
                    {a.variant !== 'ghost' && <ArrowRight size={12} aria-hidden="true" />}
                  </Link>
                ) : (
                  <button
                    key={a.label}
                    type="button"
                    onClick={a.onClick}
                    className="inline-flex items-center gap-1 text-xs font-semibold cursor-pointer transition-colors"
                    style={{
                      color:
                        a.variant === 'ghost'
                          ? 'var(--color-text-secondary)'
                          : 'var(--color-ai-dark)',
                    }}
                  >
                    {a.label}
                    {a.variant !== 'ghost' && <ArrowRight size={12} aria-hidden="true" />}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={() => onDismiss(insight.id)}
            aria-label="Descartar"
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer flex-shrink-0"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
