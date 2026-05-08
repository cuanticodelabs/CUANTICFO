'use client';

import AppShell from '@/components/layout/AppShell';
import {
  Upload,
  FileText,
  FolderOpen,
  Mail,
  ScanLine,
  Sparkles,
} from 'lucide-react';

const sources = [
  {
    id: 'upload',
    title: 'Subir manualmente',
    description: 'Arrastra PDF, XML o imágenes — el sistema extrae los datos',
    icon: Upload,
    primary: true,
  },
  {
    id: 'email',
    title: 'Recibir por correo',
    description:
      'docs@cuanticfo.cl — los documentos enviados se categorizan solos',
    icon: Mail,
    primary: false,
  },
  {
    id: 'scan',
    title: 'Escanear desde móvil',
    description: 'Toma una foto desde la app móvil; el OCR captura el folio',
    icon: ScanLine,
    primary: false,
  },
];

export default function DocumentosPage() {
  return (
    <AppShell
      title="Documentos"
      subtitle="Facturas, boletas y comprobantes — un solo repositorio"
    >
      <div className="px-4 md:px-8 py-6 md:py-8 animate-fade-in space-y-6">
        {/* Status row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            className="flex items-center gap-4 text-xs"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span className="flex items-center gap-2">
              <FolderOpen size={12} aria-hidden="true" />
              <span className="tabular">0</span> documentos almacenados
            </span>
            <span style={{ color: 'var(--color-border-strong)' }}>·</span>
            <span>Próximamente con Supabase Storage</span>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer transition-opacity hover:opacity-90"
            style={{
              color: 'var(--color-app-bg)',
              background:
                'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
            }}
          >
            <Upload size={13} aria-hidden="true" />
            Subir documento
          </button>
        </div>

        {/* Empty state — richer */}
        <section className="card p-8 md:p-10">
          <div className="max-w-xl mx-auto text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{
                background:
                  'linear-gradient(135deg, var(--color-accent-tint) 0%, rgba(212,165,116,0.1) 100%)',
                border: '1px solid rgba(212,165,116,0.18)',
              }}
              aria-hidden="true"
            >
              <FolderOpen size={24} style={{ color: 'var(--color-accent)' }} />
            </div>
            <h2
              className="text-xl font-semibold tracking-tight mb-2"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Tu repositorio está vacío
            </h2>
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Aquí vas a tener todas tus facturas, boletas y comprobantes
              en un solo lugar — vinculados automáticamente al movimiento que
              les corresponde.
            </p>

            <p
              className="inline-flex items-center gap-1.5 text-[11px]"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <FileText size={11} aria-hidden="true" />
              PDF · XML · JPG · PNG — hasta 10 MB por archivo
            </p>
          </div>
        </section>

        {/* Cómo cargar documentos */}
        <section>
          <h3
            className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-3"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Cómo cargar documentos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {sources.map((s) => (
              <div
                key={s.id}
                className="card p-5 transition-colors cursor-pointer card-hover"
                style={
                  s.primary
                    ? { borderColor: 'rgba(212,165,116,0.3)' }
                    : undefined
                }
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{
                    backgroundColor: s.primary
                      ? 'var(--color-accent-tint)'
                      : 'rgba(255,255,255,0.04)',
                    color: s.primary
                      ? 'var(--color-accent)'
                      : 'var(--color-text-secondary)',
                    border: s.primary
                      ? '1px solid rgba(212,165,116,0.2)'
                      : '1px solid var(--color-border)',
                  }}
                  aria-hidden="true"
                >
                  <s.icon size={16} />
                </div>
                <p
                  className="text-sm font-semibold mb-1"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {s.title}
                </p>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* AI extraction note */}
        <section
          className="surface-ai p-5 flex items-start gap-3"
          aria-label="Nota sobre extracción automática"
        >
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
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.09em] mb-1"
              style={{ color: 'var(--color-ai-dark)' }}
            >
              Procesamiento automático
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Cada documento se OCRea, se le extraen folio, RUT y monto, y se
              vincula al ingreso o gasto correspondiente — listo para tu
              cierre y el F29.
            </p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
