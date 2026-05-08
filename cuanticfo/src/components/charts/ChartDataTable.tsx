'use client';

import { Table } from 'lucide-react';

interface ChartDataTableProps {
  /** Caption — what this table represents. */
  caption: string;
  headers: string[];
  rows: (string | number)[][];
  /** Optional summary explaining the table for screen readers. */
  summary?: string;
  className?: string;
}

/**
 * ChartDataTable — collapsible <details> with a tabular fallback for any chart.
 *
 * Required by:
 *  - WCAG 2.1 SC 1.1.1 (Non-text Content)
 *  - DESIGN.md: "All charts have a <details><summary>Ver tabla de datos</summary>
 *               <table>…</table></details> fallback"
 *
 * The <details> element is keyboard accessible by default and announces its
 * open/closed state via screen readers.
 */
export default function ChartDataTable({
  caption,
  headers,
  rows,
  summary,
  className,
}: ChartDataTableProps) {
  return (
    <details
      className={`mt-4 rounded-lg overflow-hidden group ${className ?? ''}`}
      style={{ border: '1px solid var(--color-border)' }}
    >
      <summary
        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold cursor-pointer transition-colors list-none"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        <Table size={12} aria-hidden="true" />
        Ver tabla de datos
        <span
          className="ml-auto text-[10px] font-normal tabular"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {rows.length} {rows.length === 1 ? 'fila' : 'filas'}
        </span>
      </summary>

      <div className="overflow-x-auto" style={{ borderTop: '1px solid var(--color-border)' }}>
        <table className="w-full text-sm">
          <caption className="sr-only">
            {caption}
            {summary && `. ${summary}`}
          </caption>
          <thead>
            <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
              {headers.map((h, i) => (
                <th
                  key={i}
                  scope="col"
                  className="text-left text-[10px] font-semibold uppercase tracking-[0.09em] px-3 py-2"
                  style={{
                    color: 'var(--color-text-muted)',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className="px-3 py-2 text-xs tabular"
                    style={{
                      color:
                        ci === 0
                          ? 'var(--color-text-primary)'
                          : 'var(--color-text-secondary)',
                      fontFamily: ci > 0 ? 'var(--font-mono)' : undefined,
                      borderBottom:
                        ri < rows.length - 1
                          ? '1px solid var(--color-border)'
                          : 'none',
                    }}
                    {...(ci === 0 ? { scope: 'row' } : {})}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
