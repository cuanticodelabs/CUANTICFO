'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { formatCLP } from '@/lib/utils/format';
import type { ChartDataPoint } from '@/lib/types';

interface FinancialChartCardProps {
  data: ChartDataPoint[];
  title?: string;
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl shadow-lg p-3 text-sm" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
        <p className="font-semibold mb-2" style={{ color: 'var(--color-text-contrast)' }}>{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="capitalize" style={{ color: 'var(--color-text-secondary)' }}>{entry.name}:</span>
            <span className="font-semibold" style={{ color: entry.color }}>
              {formatCLP(entry.value, true)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function FinancialChartCard({ data, title = 'Evolución ingresos vs gastos', className }: FinancialChartCardProps) {
  return (
    <div className={`card p-5 ${className || ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{title}</h3>
        <span className="text-xs px-2 py-1 rounded-lg" style={{ color: 'var(--color-text-muted)', backgroundColor: 'var(--color-app-bg)' }}>Últimos 6 meses</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-app-bg)" />
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
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
            formatter={(value) => (
              <span style={{ color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>{value}</span>
            )}
          />
          <Line
            type="monotone"
            dataKey="ingresos"
            stroke="var(--color-accent)"
            strokeWidth={2.5}
            dot={{ fill: 'var(--color-accent)', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="gastos"
            stroke="var(--color-expense)"
            strokeWidth={2.5}
            dot={{ fill: 'var(--color-expense)', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
