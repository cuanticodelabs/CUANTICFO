'use client';

import { Sparkles, User, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import CitationChip, { type Citation } from './CitationChip';
import TraceTooltip from '@/components/ui/TraceTooltip';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessageData {
  id: string;
  role: ChatRole;
  /** Plain-text body. May include simple paragraph breaks via "\n\n". */
  text: string;
  /** Optional citations under the message. */
  citations?: Citation[];
  /** Optional embedded data block — KPI, mini-table — rendered above citations. */
  embed?: ChatEmbed;
  /** Provenance for any numbers in the text. */
  sources?: string[];
  /** Confidence (0-1) shown in the trace tooltip. */
  confidence?: number;
  /** Optional timestamp — short label, e.g., "hace 2 min". */
  timestamp?: string;
}

export type ChatEmbed =
  | {
      type: 'kpi';
      label: string;
      value: string;
      delta?: { value: string; direction: 'up' | 'down' | 'flat' };
    }
  | {
      type: 'table';
      headers: string[];
      rows: string[][];
    };

interface ChatMessageProps {
  message: ChatMessageData;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  if (message.role === 'user') return <UserMessage message={message} />;
  return <AssistantMessage message={message} />;
}

/* ───────────────────────────────────────────────────────────── */

function UserMessage({ message }: ChatMessageProps) {
  return (
    <div className="flex justify-end gap-3 group">
      <div
        className="max-w-[640px] px-4 py-3 rounded-2xl rounded-tr-md text-sm leading-relaxed"
        style={{
          backgroundColor: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-primary)',
        }}
      >
        {message.text}
      </div>
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{
          backgroundColor: 'var(--color-accent-tint)',
          color: 'var(--color-accent)',
          border: '1px solid var(--color-border)',
        }}
        aria-hidden="true"
      >
        <User size={14} />
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────── */

function AssistantMessage({ message }: ChatMessageProps) {
  const paragraphs = message.text.split('\n\n');

  return (
    <div className="flex gap-3 group">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{
          background:
            'linear-gradient(135deg, var(--color-ai) 0%, var(--color-ai-dark) 100%)',
          color: 'var(--color-app-bg)',
        }}
        aria-hidden="true"
      >
        <Sparkles size={14} />
      </div>

      <div className="flex-1 min-w-0 max-w-[760px]">
        {/* Author + trace */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.09em]"
            style={{ color: 'var(--color-ai-dark)' }}
          >
            CFO Asistente
          </span>
          {message.timestamp && (
            <span
              className="text-[11px]"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {message.timestamp}
            </span>
          )}
          {message.sources && message.sources.length > 0 && (
            <TraceTooltip
              sources={message.sources}
              confidence={message.confidence}
            />
          )}
        </div>

        {/* Body */}
        <div className="space-y-3">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-sm leading-relaxed"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {p}
            </p>
          ))}
        </div>

        {/* Embedded data */}
        {message.embed && <Embed embed={message.embed} />}

        {/* Citations */}
        {message.citations && message.citations.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.09em] mr-1"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Fuentes
            </span>
            {message.citations.map((c) => (
              <CitationChip key={c.id} citation={c} />
            ))}
          </div>
        )}

        {/* Action bar — visible on hover */}
        <div className="mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <ActionButton aria-label="Copiar respuesta">
            <Copy size={12} />
          </ActionButton>
          <ActionButton aria-label="Útil">
            <ThumbsUp size={12} />
          </ActionButton>
          <ActionButton aria-label="No útil">
            <ThumbsDown size={12} />
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────── */

function ActionButton({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="p-1.5 rounded-md cursor-pointer transition-colors"
      style={{ color: 'var(--color-text-muted)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
        e.currentTarget.style.color = 'var(--color-text-primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = 'var(--color-text-muted)';
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ───────────────────────────────────────────────────────────── */

function Embed({ embed }: { embed: ChatEmbed }) {
  if (embed.type === 'kpi') {
    const directionColor =
      embed.delta?.direction === 'up'
        ? 'var(--color-income)'
        : embed.delta?.direction === 'down'
        ? 'var(--color-expense)'
        : 'var(--color-text-muted)';
    return (
      <div
        className="mt-4 p-4 rounded-xl inline-block"
        style={{
          backgroundColor: 'var(--color-card)',
          border: '1px solid var(--color-border)',
        }}
      >
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.09em]"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {embed.label}
        </p>
        <p
          className="text-2xl font-bold tracking-tight tabular mt-1"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {embed.value}
        </p>
        {embed.delta && (
          <p
            className="text-xs font-semibold tabular mt-1"
            style={{ color: directionColor }}
          >
            {embed.delta.value}
          </p>
        )}
      </div>
    );
  }

  // Table
  return (
    <div
      className="mt-4 rounded-xl overflow-hidden"
      style={{
        backgroundColor: 'var(--color-card)',
        border: '1px solid var(--color-border)',
      }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr
            style={{
              borderBottom: '1px solid var(--color-border)',
              backgroundColor: 'rgba(255,255,255,0.02)',
            }}
          >
            {embed.headers.map((h) => (
              <th
                key={h}
                className="text-left text-[10px] font-semibold uppercase tracking-[0.09em] px-3 py-2"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {embed.rows.map((row, ri) => (
            <tr
              key={ri}
              style={{
                borderBottom:
                  ri < embed.rows.length - 1
                    ? '1px solid var(--color-border)'
                    : 'none',
              }}
            >
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
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
