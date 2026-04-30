'use client';

import { TrendingUp, TrendingDown, DollarSign, AlertCircle, Banknote, FileText, CreditCard } from 'lucide-react';
import { cn, formatCLP, formatPct } from '@/lib/utils/format';
import type { KpiData } from '@/lib/types';
import { Sparklines, SparklinesLine } from 'react-sparklines';

const iconMap = {
  ingreso: DollarSign,
  gasto: CreditCard,
  resultado: TrendingUp,
  iva: FileText,
  caja: Banknote,
  cobrar: FileText,
  pagar: CreditCard,
  alerta: AlertCircle,
};

const colorMap = {
  ingreso:   { bg: '#eff6ff', icon: '#2563eb', text: '#1d4ed8' },
  gasto:     { bg: '#fef2f2', icon: '#dc2626', text: '#b91c1c' },
  resultado: { bg: '#f0fdf4', icon: '#16a34a', text: '#15803d' },
  iva:       { bg: '#fff7ed', icon: '#ea580c', text: '#c2410c' },
  caja:      { bg: '#eff6ff', icon: '#2563eb', text: '#1d4ed8' },
  cobrar:    { bg: '#faf5ff', icon: '#7c3aed', text: '#6d28d9' },
  pagar:     { bg: '#fef2f2', icon: '#dc2626', text: '#b91c1c' },
  alerta:    { bg: '#fff7ed', icon: '#ea580c', text: '#c2410c' },
};

const sparklineColor = {
  ingreso: '#2563eb',
  gasto: '#dc2626',
  resultado: '#16a34a',
  iva: '#ea580c',
  caja: '#2563eb',
  cobrar: '#7c3aed',
  pagar: '#dc2626',
  alerta: '#ea580c',
};

interface KpiCardProps {
  kpi: KpiData;
  className?: string;
}

export default function KpiCard({ kpi, className }: KpiCardProps) {
  const Icon = iconMap[kpi.tipo] || DollarSign;
  const colors = colorMap[kpi.tipo];
  const sparkColor = sparklineColor[kpi.tipo];
  const isPositive = kpi.variacion_pct >= 0;

  return (
    <div className={cn('card card-hover p-4', className)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: colors.bg }}
          >
            <Icon size={18} style={{ color: colors.icon }} />
          </div>
          <span className="text-xs text-slate-500 font-medium">{kpi.label}</span>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
            {formatCLP(kpi.value)}
          </p>
          <div className="flex items-center gap-1 mt-1">
            {isPositive ? (
              <TrendingUp size={13} className="text-green-500" />
            ) : (
              <TrendingDown size={13} className="text-red-500" />
            )}
            <span
              className={cn(
                'text-xs font-semibold',
                isPositive ? 'text-green-600' : 'text-red-600'
              )}
            >
              {formatPct(kpi.variacion_pct)}
            </span>
            <span className="text-xs text-slate-400">{kpi.variacion_label}</span>
          </div>
        </div>

        {kpi.sparkline && (
          <div className="w-20 h-10 opacity-70">
            <Sparklines data={kpi.sparkline} height={40} width={80}>
              <SparklinesLine
                color={sparkColor}
                style={{ fill: 'none', strokeWidth: 2 }}
              />
            </Sparklines>
          </div>
        )}
      </div>
    </div>
  );
}
