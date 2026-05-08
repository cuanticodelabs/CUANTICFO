'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Sparkles, Paperclip } from 'lucide-react';

interface ChatComposerProps {
  /** Suggestion chips shown above the input. */
  suggestions?: string[];
  /** Submit handler. */
  onSubmit: (text: string) => void;
  /** Disabled while waiting for response. */
  busy?: boolean;
}

export default function ChatComposer({
  suggestions,
  onSubmit,
  busy,
}: ChatComposerProps) {
  const [value, setValue] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);

  // Auto-grow up to 5 lines.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [value]);

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed || busy) return;
    onSubmit(trimmed);
    setValue('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="space-y-3">
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSubmit(s)}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs cursor-pointer transition-colors"
              style={{
                color: 'var(--color-text-secondary)',
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
              }}
              onMouseEnter={(e) => {
                if (busy) return;
                e.currentTarget.style.borderColor = 'var(--color-accent)';
                e.currentTarget.style.color = 'var(--color-accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}
            >
              <Sparkles size={11} aria-hidden="true" />
              {s}
            </button>
          ))}
        </div>
      )}

      <div
        className="rounded-xl flex items-end gap-2 p-2 transition-colors focus-within:outline-none"
        style={{
          backgroundColor: 'var(--color-card)',
          border: '1px solid var(--color-border)',
        }}
      >
        <button
          type="button"
          aria-label="Adjuntar"
          className="p-2 rounded-lg cursor-pointer transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <Paperclip size={15} aria-hidden="true" />
        </button>

        <textarea
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Pregúntame algo sobre tus números…"
          disabled={busy}
          className="flex-1 bg-transparent outline-none resize-none text-sm leading-relaxed py-2 px-1"
          style={{
            color: 'var(--color-text-primary)',
            fontFamily: 'inherit',
            maxHeight: 140,
          }}
          aria-label="Mensaje al CFO Asistente"
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!value.trim() || busy}
          aria-label="Enviar mensaje"
          className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background:
              'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
            color: 'var(--color-app-bg)',
          }}
        >
          <ArrowUp size={16} aria-hidden="true" />
        </button>
      </div>

      <p
        className="text-[11px] text-center"
        style={{ color: 'var(--color-text-muted)' }}
      >
        El CFO Asistente puede equivocarse. Verifica los números importantes con
        los enlaces de fuentes.
      </p>
    </div>
  );
}
