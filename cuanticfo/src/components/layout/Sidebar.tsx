'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  FileText,
  BookOpen,
  BookMarked,
  Calendar,
  Receipt,
  BarChart2,
  Droplets,
  Bell,
  Building2,
  Users,
  Tag,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Target,
  TrendingUpDown,
  Gauge,
} from 'lucide-react';
import { cn } from '@/lib/utils/format';
import { mockEmpresa } from '@/lib/mock-data/dashboard';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'EXECUTIVE',
    items: [
      { label: 'Resumen', href: '/dashboard', icon: LayoutDashboard },
      { label: 'CFO Asistente', href: '/ai-cfo', icon: Sparkles },
    ],
  },
  {
    title: 'FLUJOS',
    items: [
      { label: 'Movimientos', href: '/movimientos', icon: ArrowLeftRight },
      { label: 'Ingresos', href: '/ingresos', icon: TrendingUp },
      { label: 'Gastos', href: '/gastos', icon: TrendingDown },
      { label: 'Documentos', href: '/documentos', icon: FileText },
    ],
  },
  {
    title: 'CONTABILIDAD',
    items: [
      { label: 'Libros', href: '/libros', icon: BookOpen },
      { label: 'Cuentas', href: '/cuentas', icon: BookMarked },
      { label: 'Cierre mensual', href: '/cierres', icon: Calendar },
    ],
  },
  {
    title: 'IMPUESTOS',
    items: [
      { label: 'Preparador F29', href: '/impuestos/f29', icon: Receipt },
      { label: 'Mensuales', href: '/impuestos', icon: BookMarked },
    ],
  },
  {
    title: 'INTELIGENCIA',
    items: [
      { label: 'Estado de resultados', href: '/reportes/estado-resultados', icon: BarChart2 },
      { label: 'Flujo de caja', href: '/reportes/flujo-caja', icon: Droplets },
      { label: 'Presupuesto vs real', href: '/reportes/presupuesto', icon: Target },
      { label: 'Proyecciones', href: '/reportes/proyecciones', icon: TrendingUpDown },
      { label: 'KPIs', href: '/reportes/kpis', icon: Gauge },
    ],
  },
  {
    title: 'AJUSTES',
    items: [
      { label: 'Empresas', href: '/configuracion', icon: Building2 },
      { label: 'Usuarios', href: '/configuracion/usuarios', icon: Users },
      { label: 'Categorías', href: '/configuracion/categorias', icon: Tag },
      { label: 'Configuración', href: '/configuracion/ajustes', icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'sidebar hidden md:flex flex-col h-screen sticky top-0 transition-all duration-300 z-30',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-5"
        style={{ borderBottom: '1px solid var(--color-sidebar-border)' }}
      >
        <div
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
          }}
        >
          <span
            className="text-[13px] font-bold tracking-tight"
            style={{ color: 'var(--color-app-bg)' }}
          >
            C
          </span>
        </div>
        {!collapsed && (
          <span
            className="font-semibold text-[15px] tracking-tight"
            style={{ color: 'var(--color-sidebar-text)' }}
          >
            CuantiCFO
          </span>
        )}
      </div>

      {/* Company Selector */}
      {!collapsed && (
        <div className="mx-3 mt-3 mb-1">
          <button
            type="button"
            aria-label={`Empresa activa: ${mockEmpresa.razon_social}. Cambiar empresa`}
            className="w-full px-3 py-2 rounded-lg transition-colors text-left cursor-pointer"
            style={{ backgroundColor: 'var(--color-sidebar-hover)' }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'var(--color-accent-tint)', color: 'var(--color-accent)' }}
                aria-hidden="true"
              >
                <Building2 size={13} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs font-semibold truncate"
                  style={{ color: 'var(--color-sidebar-text)' }}
                >
                  {mockEmpresa.razon_social}
                </p>
                <p
                  className="text-[11px] truncate tabular"
                  style={{ color: 'var(--color-sidebar-text-muted)' }}
                >
                  {mockEmpresa.rut}
                </p>
              </div>
              <ChevronRight
                size={13}
                style={{ color: 'var(--color-sidebar-text-muted)' }}
                className="flex-shrink-0"
                aria-hidden="true"
              />
            </div>
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2" aria-label="Navegación principal">
        {navSections.map((section) => (
          <div key={section.title} className="mb-4">
            {!collapsed && (
              <p
                className="text-[10px] font-semibold tracking-[0.12em] uppercase px-3 mb-1.5"
                style={{ color: 'var(--color-sidebar-text-muted)' }}
              >
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'group relative flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 transition-colors duration-150 cursor-pointer'
                  )}
                  style={{
                    color: isActive
                      ? 'var(--color-accent)'
                      : 'var(--color-sidebar-text-muted)',
                    backgroundColor: isActive ? 'var(--color-sidebar-hover)' : 'transparent',
                  }}
                  title={collapsed ? item.label : undefined}
                >
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r-full"
                      style={{ backgroundColor: 'var(--color-accent)' }}
                    />
                  )}
                  <item.icon
                    size={17}
                    aria-hidden="true"
                    className="flex-shrink-0"
                  />
                  {!collapsed && (
                    <span className="text-sm font-medium truncate">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Alerts banner */}
      {!collapsed && (
        <Link
          href="/alertas"
          className="mx-3 mb-3 px-3 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
          style={{
            backgroundColor: 'var(--color-expense-tint)',
            border: '1px solid rgba(248, 113, 113, 0.18)',
          }}
        >
          <Bell size={14} style={{ color: 'var(--color-expense)' }} aria-hidden="true" />
          <span
            className="text-xs font-medium"
            style={{ color: 'var(--color-expense)' }}
          >
            5 alertas activas
          </span>
          <span
            className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular"
            style={{
              backgroundColor: 'var(--color-expense)',
              color: 'var(--color-app-bg)',
            }}
          >
            5
          </span>
        </Link>
      )}

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        aria-expanded={!collapsed}
        aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
        className="flex items-center gap-2 px-4 py-3 transition-colors text-sm cursor-pointer"
        style={{
          borderTop: '1px solid var(--color-sidebar-border)',
          color: 'var(--color-sidebar-text-muted)',
        }}
      >
        {collapsed ? (
          <ChevronRight size={15} aria-hidden="true" />
        ) : (
          <>
            <ChevronLeft size={15} aria-hidden="true" />
            <span aria-hidden="true">Colapsar</span>
          </>
        )}
      </button>
    </aside>
  );
}
