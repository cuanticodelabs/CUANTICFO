'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Receipt,
  BarChart2,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils/format';

const navItems = [
  { label: 'Inicio', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Movimientos', href: '/movimientos', icon: ArrowLeftRight },
  { label: 'Impuestos', href: '/impuestos/f29', icon: Receipt },
  { label: 'Reportes', href: '/reportes/estado-resultados', icon: BarChart2 },
  { label: 'Más', href: '/alertas', icon: MoreHorizontal },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 pb-safe" aria-label="Navegación móvil">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors min-w-0',
                isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <item.icon size={22} aria-hidden="true" />
              <span className="text-[10px] font-medium truncate">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 bg-blue-600 rounded-full" aria-hidden="true" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
