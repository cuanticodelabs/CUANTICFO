'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import Field from '@/components/ui/Field';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Toggle from '@/components/ui/Toggle';
import { mockEmpresa, mockUsuario } from '@/lib/mock-data/dashboard';
import type { Empresa } from '@/lib/types';
import {
  Building2,
  Users,
  Plug,
  CheckCircle,
  AlertCircle,
  Plus,
  MoreHorizontal,
} from 'lucide-react';

type SectionId = 'general' | 'usuarios' | 'integraciones';

const sections: {
  id: SectionId;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties; 'aria-hidden'?: boolean }>;
}[] = [
  {
    id: 'general',
    label: 'General',
    description: 'Empresa, periodo fiscal, moneda, idioma',
    icon: Building2,
  },
  {
    id: 'usuarios',
    label: 'Usuarios',
    description: 'Equipo, roles, autenticación',
    icon: Users,
  },
  {
    id: 'integraciones',
    label: 'Integraciones',
    description: 'SII, n8n, exportadores',
    icon: Plug,
  },
];

export default function ConfiguracionPage() {
  const [active, setActive] = useState<SectionId>('general');

  return (
    <AppShell title="Configuración" subtitle="Empresa · Usuarios · Integraciones">
      <div className="px-4 md:px-8 py-6 md:py-8 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          {/* ─────────────────────── Section rail ─────────────────────── */}
          <nav aria-label="Secciones de configuración" className="lg:sticky lg:top-6 lg:self-start">
            <ul className="space-y-1">
              {sections.map((s) => {
                const isActive = s.id === active;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setActive(s.id)}
                      aria-current={isActive ? 'page' : undefined}
                      className="w-full text-left px-3 py-2.5 rounded-lg cursor-pointer transition-colors flex items-start gap-3"
                      style={{
                        backgroundColor: isActive
                          ? 'var(--color-card)'
                          : 'transparent',
                        border: `1px solid ${isActive ? 'var(--color-border)' : 'transparent'}`,
                      }}
                      onMouseEnter={(e) => {
                        if (isActive) return;
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                      }}
                      onMouseLeave={(e) => {
                        if (isActive) return;
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <s.icon
                        size={15}
                        aria-hidden={true}
                        style={{
                          color: isActive
                            ? 'var(--color-accent)'
                            : 'var(--color-text-muted)',
                        }}
                      />
                      <div>
                        <p
                          className="text-sm font-semibold"
                          style={{
                            color: isActive
                              ? 'var(--color-text-primary)'
                              : 'var(--color-text-secondary)',
                          }}
                        >
                          {s.label}
                        </p>
                        <p
                          className="text-[11px] mt-0.5"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          {s.description}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>

            <p
              className="text-[11px] mt-6 px-3"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Los cambios se guardan automáticamente.
            </p>
          </nav>

          {/* ─────────────────────── Section content ─────────────────────── */}
          <div className="min-w-0 max-w-2xl">
            {active === 'general' && <GeneralSection />}
            {active === 'usuarios' && <UsuariosSection />}
            {active === 'integraciones' && <IntegracionesSection />}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

/* ───────────────────────────────────────────────────────────── */
/* General — empresa + fiscal                                     */
/* ───────────────────────────────────────────────────────────── */

function GeneralSection() {
  const [empresa, setEmpresa] = useState<Empresa>({ ...mockEmpresa });
  const [autoCierre, setAutoCierre] = useState(true);
  const [notificaciones, setNotificaciones] = useState(false);

  return (
    <div className="space-y-8">
      <SectionHeader
        title="General"
        description="Información tributaria de la empresa y preferencias del sistema"
      />

      {/* Datos de la empresa */}
      <SectionGroup title="Datos de la empresa">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Razón social" required>
            {(p) => (
              <Input
                {...p}
                value={empresa.razon_social}
                onChange={(e) => setEmpresa({ ...empresa, razon_social: e.target.value })}
              />
            )}
          </Field>
          <Field label="RUT empresa" required hint="Formato: 12.345.678-9">
            {(p) => (
              <Input
                {...p}
                value={empresa.rut}
                onChange={(e) => setEmpresa({ ...empresa, rut: e.target.value })}
              />
            )}
          </Field>
          <Field label="Giro comercial">
            {(p) => (
              <Input
                {...p}
                value={empresa.giro}
                onChange={(e) => setEmpresa({ ...empresa, giro: e.target.value })}
              />
            )}
          </Field>
          <Field label="Banco principal">
            {(p) => (
              <Input
                {...p}
                value={empresa.banco_principal ?? ''}
                onChange={(e) =>
                  setEmpresa({ ...empresa, banco_principal: e.target.value })
                }
              />
            )}
          </Field>
        </div>
      </SectionGroup>

      {/* Régimen tributario */}
      <SectionGroup title="Régimen tributario">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Régimen" required>
            {(p) => (
              <Select
                {...p}
                value={empresa.regimen_tributario}
                onChange={(e) =>
                  setEmpresa({
                    ...empresa,
                    regimen_tributario: e.target.value as Empresa['regimen_tributario'],
                  })
                }
                options={[
                  { value: 'general', label: 'Renta efectiva (general)' },
                  { value: 'pyme', label: 'PYME transparente' },
                  { value: 'simplificado', label: 'Renta presunta' },
                ]}
              />
            )}
          </Field>
          <Field label="Tasa PPM (%)" hint="Pago provisional mensual">
            {(p) => (
              <Input
                {...p}
                type="number"
                step="0.1"
                value={empresa.tasa_ppm}
                onChange={(e) =>
                  setEmpresa({ ...empresa, tasa_ppm: parseFloat(e.target.value) || 0 })
                }
              />
            )}
          </Field>
          <Field label="Correo del contador">
            {(p) => (
              <Input
                {...p}
                type="email"
                value={empresa.correo_contador ?? ''}
                onChange={(e) =>
                  setEmpresa({ ...empresa, correo_contador: e.target.value })
                }
              />
            )}
          </Field>
          <Field label="Inicio de actividades">
            {(p) => (
              <Input
                {...p}
                type="date"
                value={empresa.fecha_inicio_actividades ?? ''}
                onChange={(e) =>
                  setEmpresa({
                    ...empresa,
                    fecha_inicio_actividades: e.target.value,
                  })
                }
              />
            )}
          </Field>
        </div>
      </SectionGroup>

      {/* Preferencias */}
      <SectionGroup title="Preferencias">
        <div className="space-y-4">
          <Toggle
            checked={autoCierre}
            onChange={setAutoCierre}
            label="Cierre mensual automático"
            description="Bloquea movimientos del período al completar el checklist"
          />
          <Toggle
            checked={notificaciones}
            onChange={setNotificaciones}
            label="Notificaciones por correo"
            description="Recibe un resumen semanal y alertas críticas"
          />
        </div>
      </SectionGroup>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────── */
/* Usuarios                                                       */
/* ───────────────────────────────────────────────────────────── */

const mockTeam = [
  {
    id: '1',
    nombre: mockUsuario.nombre,
    email: mockUsuario.email,
    rol: 'cfo' as const,
    twoFa: true,
    me: true,
  },
  {
    id: '2',
    nombre: 'María Rojas',
    email: 'maria@cuanticode.cl',
    rol: 'contador' as const,
    twoFa: false,
    me: false,
  },
  {
    id: '3',
    nombre: 'Pedro Soto',
    email: 'pedro@cuanticode.cl',
    rol: 'socio_lectura' as const,
    twoFa: true,
    me: false,
  },
];

const rolLabel: Record<string, string> = {
  admin: 'Administrador',
  cfo: 'CFO / Owner',
  contador: 'Contador',
  socio_lectura: 'Solo lectura',
};

function UsuariosSection() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Usuarios"
        description="Equipo con acceso a esta empresa, sus roles y métodos de autenticación"
      />

      <SectionGroup
        title="Equipo"
        action={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-opacity hover:opacity-90"
            style={{
              color: 'var(--color-app-bg)',
              background:
                'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
            }}
          >
            <Plus size={12} aria-hidden="true" />
            Invitar usuario
          </button>
        }
      >
        <div className="card overflow-hidden">
          <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {mockTeam.map((u) => {
              const initials = u.nombre
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2);
              return (
                <div
                  key={u.id}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{
                      backgroundColor: 'var(--color-accent-tint)',
                      color: 'var(--color-accent)',
                      border: '1px solid var(--color-border)',
                    }}
                    aria-hidden="true"
                  >
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {u.nombre}
                      {u.me && (
                        <span
                          className="ml-2 text-[10px] font-semibold uppercase tracking-[0.06em] px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: 'var(--color-accent-tint)',
                            color: 'var(--color-accent)',
                          }}
                        >
                          Tú
                        </span>
                      )}
                    </p>
                    <p
                      className="text-xs truncate"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {u.email}
                    </p>
                  </div>

                  <div className="hidden md:flex items-center gap-3 flex-shrink-0">
                    <span
                      className="text-[11px] font-medium px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        color: 'var(--color-text-secondary)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      {rolLabel[u.rol]}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 text-[11px] font-medium"
                      style={{
                        color: u.twoFa
                          ? 'var(--color-income)'
                          : 'var(--color-text-muted)',
                      }}
                      title={u.twoFa ? '2FA habilitado' : '2FA deshabilitado'}
                    >
                      {u.twoFa ? (
                        <CheckCircle size={11} aria-hidden="true" />
                      ) : (
                        <AlertCircle size={11} aria-hidden="true" />
                      )}
                      2FA
                    </span>
                  </div>

                  <button
                    type="button"
                    aria-label={`Más opciones para ${u.nombre}`}
                    className="p-1.5 rounded-md cursor-pointer transition-colors"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </SectionGroup>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────── */
/* Integraciones                                                  */
/* ───────────────────────────────────────────────────────────── */

const mockIntegrations = [
  {
    id: 'sii',
    name: 'Servicio de Impuestos Internos',
    description: 'Sincroniza F29, libros y certificación tributaria con el SII',
    status: 'connected' as const,
    detail: 'RUT firma electrónica · 77.123.456-8',
  },
  {
    id: 'n8n',
    name: 'n8n Workflows',
    description: 'Automatizaciones para ingresos, gastos, cierre y F29',
    status: 'connected' as const,
    detail: '6 workflows activos',
  },
  {
    id: 'banco-chile',
    name: 'Banco de Chile',
    description: 'Importación automática de cartola bancaria',
    status: 'connected' as const,
    detail: 'Última sincronización hace 2 horas',
  },
  {
    id: 'mercado-pago',
    name: 'Mercado Pago',
    description: 'Importación de saldos y conciliación de pagos',
    status: 'disconnected' as const,
    detail: 'Conecta para sincronizar saldos en el dashboard',
  },
  {
    id: 'gsheets',
    name: 'Google Sheets',
    description: 'Exportación programada de reportes a hojas de cálculo',
    status: 'disconnected' as const,
    detail: 'Disponible para tu plan',
  },
];

function IntegracionesSection() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Integraciones"
        description="Servicios externos conectados a CuantiCFO"
      />

      <div className="space-y-3">
        {mockIntegrations.map((i) => (
          <div
            key={i.id}
            className="card p-4 flex items-start gap-3"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor:
                  i.status === 'connected'
                    ? 'var(--color-income-tint)'
                    : 'rgba(255,255,255,0.04)',
                color:
                  i.status === 'connected'
                    ? 'var(--color-income)'
                    : 'var(--color-text-muted)',
                border: `1px solid ${
                  i.status === 'connected'
                    ? 'rgba(74,222,128,0.2)'
                    : 'var(--color-border)'
                }`,
              }}
              aria-hidden="true"
            >
              <Plug size={16} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p
                  className="text-sm font-semibold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {i.name}
                </p>
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.06em] px-1.5 py-0.5 rounded"
                  style={{
                    color:
                      i.status === 'connected'
                        ? 'var(--color-income)'
                        : 'var(--color-text-muted)',
                    backgroundColor:
                      i.status === 'connected'
                        ? 'var(--color-income-tint)'
                        : 'rgba(255,255,255,0.04)',
                  }}
                >
                  {i.status === 'connected' ? (
                    <>
                      <CheckCircle size={9} aria-hidden="true" />
                      Conectado
                    </>
                  ) : (
                    'Disponible'
                  )}
                </span>
              </div>
              <p
                className="text-xs mt-0.5"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {i.description}
              </p>
              <p
                className="text-[11px] mt-1"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {i.detail}
              </p>
            </div>

            <button
              type="button"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-colors flex-shrink-0"
              style={{
                color:
                  i.status === 'connected'
                    ? 'var(--color-text-secondary)'
                    : 'var(--color-app-bg)',
                background:
                  i.status === 'connected'
                    ? 'var(--color-card)'
                    : 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
                border: i.status === 'connected'
                  ? '1px solid var(--color-border)'
                  : 'none',
              }}
            >
              {i.status === 'connected' ? 'Configurar' : 'Conectar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────── */
/* Section atoms                                                  */
/* ───────────────────────────────────────────────────────────── */

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2
        className="text-xl font-semibold tracking-tight"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {title}
      </h2>
      <p
        className="text-sm mt-1"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {description}
      </p>
    </div>
  );
}

function SectionGroup({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-[10px] font-semibold uppercase tracking-[0.12em]"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}
