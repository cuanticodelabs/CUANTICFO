'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { formatCLP } from '@/lib/utils/format';
import type { ChartDataPoint } from '@/lib/types';
import ChartDataTable from '@/components/charts/ChartDataTable';

interface FinancialChartCardProps {
  data: ChartDataPoint[];
  title?: string;
  className?: string;
}

interface TooltipPayloadEntry {
  name: string;
  value: number;
  color: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-lg p-3 text-sm"
        style={{
          backgroundColor: 'var(--color-card)',
          border: '1px solid var(--color-border-strong)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}
      >
        <p
          className="font-semibold mb-2 text-xs uppercase tracking-[0.06em]"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {label}
        </p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 mt-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
              aria-hidden="true"
            />
            <span
              className="capitalize text-xs"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {entry.name}
            </span>
            <span
              className="font-semibold tabular ml-auto"
              style={{ color: entry.color }}
            >
              {formatCLP(entry.value, true)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function FinancialChartCard({
  data,
  title = 'Ingresos vs gastos · 6 meses',
  className,
}: FinancialChartCardProps) {
  return (
    <div className={`card p-5 ${className || ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-sm font-semibold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {title}
        </h3>
        <div className="flex items-center gap-3 text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
          <span className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: 'var(--color-accent)' }}
              aria-hidden="true"
            />
            Ingresos
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: 'var(--color-expense)' }}
              aria-hidden="true"
            />
            Gastos
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid
            strokeDasharray="2 4"
            stroke="var(--color-border)"
            vertical={false}
          />
          <XAxis
            dataKey="mes"
            tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatCLP(v, true)}
            width={55}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-border-strong)', strokeWidth: 1, strokeDasharray: '2 2' }} />
          <Line
            type="monotone"
            dataKey="ingresos"
            stroke="var(--color-accent)"
            strokeWidth={2.5}
            dot={{ fill: 'var(--color-accent)', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: 'var(--color-accent)', stroke: 'var(--color-app-bg)', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="gastos"
            stroke="var(--color-expense)"
            strokeWidth={2.5}
            dot={{ fill: 'var(--color-expense)', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: 'var(--color-expense)', stroke: 'var(--color-app-bg)', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <ChartDataTable
        caption={title}
        headers={['Mes', 'Ingresos', 'Gastos']}
        rows={data.map((d) => [d.mes, formatCLP(d.ingresos), formatCLP(d.gastos)])}
      />
    </div>
  );
}
