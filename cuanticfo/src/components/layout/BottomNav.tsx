'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Sparkles,
  BarChart2,
  MoreHorizontal,
} from 'lucide-react';

const navItems = [
  { label: 'Inicio', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Movimientos', href: '/movimientos', icon: ArrowLeftRight },
  { label: 'CFO', href: '/ai-cfo', icon: Sparkles },
  { label: 'Reportes', href: '/reportes/estado-resultados', icon: BarChart2 },
  { label: 'Más', href: '/alertas', icon: MoreHorizontal },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 pb-safe"
      style={{
        backgroundColor: 'var(--color-card)',
        borderTop: '1px solid var(--color-border)',
      }}
      aria-label="Navegación móvil"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors min-w-0 cursor-pointer relative"
              style={{
                color: isActive
                  ? 'var(--color-accent)'
                  : 'var(--color-text-muted)',
              }}
            >
              <item.icon size={21} aria-hidden="true" />
              <span className="text-[10px] font-medium truncate">{item.label}</span>
              {isActive && (
                <span
                  className="absolute bottom-1 w-1 h-1 rounded-full"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                  aria-hidden="true"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
