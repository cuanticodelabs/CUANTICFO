'use client';

import Link from 'next/link';
import { FileText, Database, Calendar, Receipt, ArrowUpRight } from 'lucide-react';

export type CitationKind =
  | 'document'
  | 'table'
  | 'period'
  | 'tax'
  | 'transaction';

export interface Citation {
  id: string;
  kind: CitationKind;
  /** Short label shown in the chip. Be specific: "Factura F-1035" not "factura". */
  label: string;
  /** Optional period context, e.g., "Abril 2026". */
  period?: string;
  /** Optional href to drill into the source. */
  href?: string;
}

const kindIcon: Record<CitationKind, React.ComponentType<{ size?: number }>> = {
  document: FileText,
  table: Database,
  period: Calendar,
  tax: Receipt,
  transaction: ArrowUpRight,
};

interface CitationChipProps {
  citation: Citation;
  className?: string;
}

/**
 * CitationChip — a small clickable pill that links a sentence in chat
 * to the underlying data. The owner clicks it; nothing in the AI's
 * answer should be unverifiable.
 */
export default function CitationChip({ citation, className }: CitationChipProps) {
  const Icon = kindIcon[citation.kind];

  const inner = (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors ${className ?? ''}`}
      style={{
        color: 'var(--color-text-secondary)',
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--color-border)',
      }}
    >
      <Icon size={11} aria-hidden="true" />
      <span className="truncate max-w-[180px]">{citation.label}</span>
      {citation.period && (
        <span
          className="tabular"
          style={{ color: 'var(--color-text-muted)' }}
        >
          · {citation.period}
        </span>
      )}
    </span>
  );

  if (citation.href) {
    return (
      <Link
        href={citation.href}
        className="cursor-pointer inline-block"
        aria-label={`Abrir fuente: ${citation.label}`}
      >
        {inner}
      </Link>
    );
  }
  return inner;
}
