'use client';

import { Plus, MessageSquare } from 'lucide-react';

export interface ChatThread {
  id: string;
  title: string;
  /** Short timestamp label, e.g. "hoy", "ayer", "lun". */
  when: string;
  /** Optional preview of last message. */
  preview?: string;
}

interface ThreadListProps {
  threads: ChatThread[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
}

export default function ThreadList({
  threads,
  activeId,
  onSelect,
  onNew,
}: ThreadListProps) {
  // Group by relative time bucket
  const groups = threads.reduce<Record<string, ChatThread[]>>((acc, t) => {
    (acc[t.when] ??= []).push(t);
    return acc;
  }, {});

  return (
    <div className="h-full flex flex-col">
      <div
        className="px-4 py-4"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        <button
          type="button"
          onClick={onNew}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-opacity hover:opacity-90"
          style={{
            color: 'var(--color-app-bg)',
            background:
              'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
          }}
        >
          <Plus size={13} aria-hidden="true" />
          Nuevo hilo
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3">
        {Object.entries(groups).map(([bucket, items]) => (
          <div key={bucket} className="mb-4">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.12em] px-3 mb-1.5"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {bucket}
            </p>
            {items.map((t) => {
              const isActive = t.id === activeId;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onSelect(t.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className="w-full text-left px-3 py-2 rounded-lg mb-0.5 cursor-pointer transition-colors flex items-start gap-2.5"
                  style={{
                    backgroundColor: isActive
                      ? 'var(--color-card)'
                      : 'transparent',
                    border: `1px solid ${isActive ? 'var(--color-border)' : 'transparent'}`,
                  }}
                  onMouseEnter={(e) => {
                    if (isActive) return;
                    e.currentTarget.style.backgroundColor =
                      'rgba(255,255,255,0.02)';
                  }}
                  onMouseLeave={(e) => {
                    if (isActive) return;
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <MessageSquare
                    size={13}
                    className="flex-shrink-0 mt-0.5"
                    style={{
                      color: isActive
                        ? 'var(--color-accent)'
                        : 'var(--color-text-muted)',
                    }}
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-xs font-semibold truncate"
                      style={{
                        color: isActive
                          ? 'var(--color-text-primary)'
                          : 'var(--color-text-secondary)',
                      }}
                    >
                      {t.title}
                    </p>
                    {t.preview && (
                      <p
                        className="text-[11px] truncate mt-0.5"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {t.preview}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
