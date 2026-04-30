'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils/format';
import type { LucideIcon } from 'lucide-react';

interface QuickActionButtonProps {
  label: string;
  href: string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'gray';
  className?: string;
}

const colorMap = {
  blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   hover: 'hover:bg-blue-100' },
  green:  { bg: 'bg-green-50',  icon: 'text-green-600',  hover: 'hover:bg-green-100' },
  red:    { bg: 'bg-red-50',    icon: 'text-red-600',    hover: 'hover:bg-red-100' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600', hover: 'hover:bg-orange-100' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', hover: 'hover:bg-purple-100' },
  gray:   { bg: 'bg-slate-50',  icon: 'text-slate-600',  hover: 'hover:bg-slate-100' },
};

export default function QuickActionButton({
  label,
  href,
  icon: Icon,
  color = 'blue',
  className,
}: QuickActionButtonProps) {
  const colors = colorMap[color];
  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-150',
        colors.bg,
        colors.hover,
        'hover:shadow-sm active:scale-95',
        className
      )}
    >
      <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', colors.bg)}>
        <Icon size={20} className={colors.icon} />
      </div>
      <span className="text-[11px] font-semibold text-slate-600 text-center leading-tight">
        {label}
      </span>
    </Link>
  );
}
