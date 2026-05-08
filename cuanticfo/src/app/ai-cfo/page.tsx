'use client';

import { useState, useRef, useEffect } from 'react';
import AppShell from '@/components/layout/AppShell';
import ThreadList from '@/components/ai/ThreadList';
import ChatMessage, { type ChatMessageData } from '@/components/ai/ChatMessage';
import ChatComposer from '@/components/ai/ChatComposer';
import InsightCard from '@/components/ui/InsightCard';
import {
  mockThreads,
  mockSuggestions,
  mockConversation,
} from '@/lib/mock-data/ai';
import { mockInsights } from '@/lib/mock-data/insights';
import { Sparkles, Share2, Trash2, MoreHorizontal } from 'lucide-react';

export default function AiCfoPage() {
  const [threads] = useState(mockThreads);
  const [activeId, setActiveId] = useState(mockThreads[0].id);
  const [messages, setMessages] = useState<ChatMessageData[]>(mockConversation);
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages.length, busy]);

  function handleSend(text: string) {
    const userMsg: ChatMessageData = {
      id: `m-${Date.now()}`,
      role: 'user',
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setBusy(true);

    // Simulate a CFO reply — static, deterministic, no real backend.
    window.setTimeout(() => {
      const reply: ChatMessageData = {
        id: `m-${Date.now() + 1}`,
        role: 'assistant',
        text:
          'Para responder esto bien necesito repasar tus números más recientes. Te dejo un primer corte basado en lo que tengo cargado al cierre del 24/04; cuando termine el cierre de mayo te lo afino.',
        timestamp: 'hace un momento',
        sources: ['Mock — sin backend conectado'],
        confidence: 0.6,
      };
      setMessages((prev) => [...prev, reply]);
      setBusy(false);
    }, 700);
  }

  function handleNewThread() {
    setMessages([
      {
        id: 'm-welcome',
        role: 'assistant',
        text:
          'Empecemos un hilo nuevo. ¿Qué te gustaría revisar? Puedo repasar tu caja, comparar trimestres, o ayudarte a cerrar el mes.',
        timestamp: 'ahora',
      },
    ]);
  }

  const activeThread = threads.find((t) => t.id === activeId) ?? threads[0];
  const isEmpty = messages.length === 1 && messages[0].id === 'm-welcome';

  return (
    <AppShell title="CFO Asistente" subtitle="Conversación con contexto financiero">
      <div className="ai-cfo-grid h-[calc(100vh-72px)]">
        {/* ─────────────────────── Threads rail ─────────────────────── */}
        <aside
          className="hidden lg:flex flex-col h-full overflow-hidden"
          style={{
            backgroundColor: 'rgba(255,255,255,0.01)',
            borderRight: '1px solid var(--color-border)',
          }}
          aria-label="Hilos de conversación"
        >
          <ThreadList
            threads={threads}
            activeId={activeId}
            onSelect={(id) => {
              setActiveId(id);
              // For the demo, the conversation only changes for t-001.
              if (id === 't-001') setMessages(mockConversation);
              else handleNewThread();
            }}
            onNew={() => {
              handleNewThread();
              setActiveId('new');
            }}
          />
        </aside>

        {/* ─────────────────────── Main conversation ─────────────────────── */}
        <main className="flex flex-col h-full overflow-hidden">
          {/* Conversation header */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: '1px solid var(--color-border)' }}
          >
            <div className="min-w-0 flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background:
                    'linear-gradient(135deg, var(--color-ai) 0%, var(--color-ai-dark) 100%)',
                  color: 'var(--color-app-bg)',
                }}
                aria-hidden="true"
              >
                <Sparkles size={14} />
              </div>
              <div className="min-w-0">
                <h2
                  className="text-sm font-semibold truncate"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {activeThread.title}
                </h2>
                <p
                  className="text-[11px] truncate"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Datos al 24/04/2026 · Confianza media 0,84
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <HeaderButton aria-label="Compartir hilo">
                <Share2 size={14} />
              </HeaderButton>
              <HeaderButton aria-label="Eliminar hilo">
                <Trash2 size={14} />
              </HeaderButton>
              <HeaderButton aria-label="Más opciones">
                <MoreHorizontal size={14} />
              </HeaderButton>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            role="log"
            aria-live="polite"
            aria-label="Conversación con CFO Asistente"
            className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6"
          >
            {/* Mobile thread switcher — only visible below lg, where the rail is hidden */}
            <div
              className="lg:hidden -mt-2 mb-2 flex items-center gap-2"
              aria-label="Cambiar de hilo"
            >
              <label className="sr-only" htmlFor="thread-mobile">
                Hilo activo
              </label>
              <select
                id="thread-mobile"
                value={activeId}
                onChange={(e) => {
                  const id = e.target.value;
                  setActiveId(id);
                  if (id === 't-001') setMessages(mockConversation);
                  else handleNewThread();
                }}
                className="flex-1 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer outline-none"
                style={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {threads.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  handleNewThread();
                  setActiveId('new');
                }}
                className="px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-opacity hover:opacity-90"
                style={{
                  color: 'var(--color-app-bg)',
                  background:
                    'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
                }}
              >
                + Nuevo
              </button>
            </div>

            {isEmpty ? (
              <EmptyChatState />
            ) : (
              messages.map((m) => <ChatMessage key={m.id} message={m} />)
            )}
            {busy && <TypingIndicator />}
          </div>

          {/* Composer */}
          <div
            className="px-4 md:px-6 py-4"
            style={{ borderTop: '1px solid var(--color-border)' }}
          >
            <ChatComposer
              suggestions={isEmpty ? mockSuggestions : undefined}
              onSubmit={handleSend}
              busy={busy}
            />
          </div>
        </main>

        {/* ─────────────────────── Insights rail (hidden below xl) ─────────────────────── */}
        <aside
          className="hidden xl:flex flex-col h-full overflow-hidden"
          style={{
            backgroundColor: 'rgba(255,255,255,0.01)',
            borderLeft: '1px solid var(--color-border)',
          }}
          aria-label="Insights proactivos"
        >
          <div
            className="px-5 py-4"
            style={{ borderBottom: '1px solid var(--color-border)' }}
          >
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Insights proactivos
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Lo que tu CFO te diría sin que preguntes
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {mockInsights.map((ins) => (
              <InsightCard key={ins.id} insight={ins} />
            ))}
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

/* ───────────────────────────────────────────────────────────── */
/* Helpers                                                        */
/* ───────────────────────────────────────────────────────────── */

function HeaderButton({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="p-2 rounded-md cursor-pointer transition-colors"
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

function EmptyChatState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto py-12">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
        style={{
          background:
            'linear-gradient(135deg, var(--color-ai) 0%, var(--color-ai-dark) 100%)',
          color: 'var(--color-app-bg)',
        }}
        aria-hidden="true"
      >
        <Sparkles size={20} />
      </div>
      <h3
        className="text-lg font-semibold mb-2"
        style={{ color: 'var(--color-text-primary)' }}
      >
        ¿Qué querés revisar hoy?
      </h3>
      <p
        className="text-sm mb-1"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        Tengo cargado el cierre de marzo y los movimientos al 24 de abril.
      </p>
      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
        Cada número que cite tendrá un enlace a su fuente.
      </p>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background:
            'linear-gradient(135deg, var(--color-ai) 0%, var(--color-ai-dark) 100%)',
          color: 'var(--color-app-bg)',
        }}
        aria-hidden="true"
      >
        <Sparkles size={14} />
      </div>
      <div
        className="px-4 py-3 rounded-2xl rounded-tl-md flex items-center gap-1"
        style={{
          backgroundColor: 'var(--color-card)',
          border: '1px solid var(--color-border)',
        }}
      >
        <Dot delay={0} />
        <Dot delay={150} />
        <Dot delay={300} />
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block w-1.5 h-1.5 rounded-full"
      style={{
        backgroundColor: 'var(--color-text-muted)',
        animation: `typingDot 1.2s ${delay}ms infinite ease-in-out`,
      }}
    />
  );
}
