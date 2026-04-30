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
  CheckSquare,
  Building2,
  Users,
  Tag,
  Settings,
  ChevronLeft,
  ChevronRight,
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
    title: 'PRINCIPAL',
    items: [
      { label: 'Inicio', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'MOVIMIENTOS',
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
      { label: 'Libros contables', href: '/libros', icon: BookOpen },
      { label: 'Cuentas contables', href: '/cuentas', icon: BookMarked },
      { label: 'Cierre mensual', href: '/cierres', icon: Calendar },
    ],
  },
  {
    title: 'IMPUESTOS',
    items: [
      { label: 'Preparador F29', href: '/impuestos/f29', icon: Receipt },
      { label: 'Impuestos mensuales', href: '/impuestos', icon: BookMarked },
    ],
  },
  {
    title: 'REPORTES',
    items: [
      { label: 'Estado de resultados', href: '/reportes/estado-resultados', icon: BarChart2 },
      { label: 'Flujo de caja', href: '/reportes/flujo-caja', icon: Droplets },
    ],
  },
  {
    title: 'CONFIGURACIÓN',
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
        'hidden md:flex flex-col h-screen sticky top-0 transition-all duration-300 z-30',
        collapsed ? 'w-16' : 'w-64'
      )}
      style={{ backgroundColor: '#0f1729' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <BarChart2 size={16} className="text-white" />
        </div>
        {!collapsed && (
          <span className="text-white font-bold text-lg tracking-tight">CuantiCFO</span>
        )}
      </div>

      {/* Company Selector */}
      {!collapsed && (
        <div className="mx-3 mt-3 mb-1 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-700 rounded-md flex items-center justify-center flex-shrink-0">
              <Building2 size={14} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{mockEmpresa.razon_social}</p>
              <p className="text-blue-300 text-xs truncate">{mockEmpresa.rut}</p>
            </div>
            <ChevronRight size={14} className="text-white/40 flex-shrink-0" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {navSections.map((section) => (
          <div key={section.title} className="mb-4">
            {!collapsed && (
              <p className="text-white/30 text-[10px] font-semibold tracking-widest uppercase px-3 mb-1">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 transition-all duration-150',
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-white/60 hover:bg-white/8 hover:text-white'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon
                    size={18}
                    className={cn('flex-shrink-0', isActive ? 'text-white' : 'text-white/60')}
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

      {/* Alerts badge */}
      {!collapsed && (
        <Link
          href="/alertas"
          className="mx-3 mb-2 px-3 py-2 rounded-lg bg-red-500/15 border border-red-500/20 flex items-center gap-2 hover:bg-red-500/25 transition-colors"
        >
          <Bell size={16} className="text-red-400" />
          <span className="text-red-300 text-xs font-medium">5 alertas activas</span>
          <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">5</span>
        </Link>
      )}

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 px-4 py-3 border-t border-white/10 text-white/40 hover:text-white/70 transition-colors text-sm"
      >
        {collapsed ? (
          <ChevronRight size={16} />
        ) : (
          <>
            <ChevronLeft size={16} />
            <span>Colapsar menú</span>
          </>
        )}
      </button>
    </aside>
  );
}
