'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatCLP } from '@/lib/utils/format';
import type { DonutDataPoint } from '@/lib/types';

interface DonutChartProps {
  data: DonutDataPoint[];
  centerLabel?: string;
  centerValue?: number;
  title?: string;
  className?: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm">
        <p className="font-semibold text-slate-700">{payload[0].name}</p>
        <p className="text-slate-500">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function DonutChart({
  data,
  centerLabel = 'Total gastos',
  centerValue,
  title,
  className,
}: DonutChartProps) {
  return (
    <div className={`card p-5 ${className || ''}`}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
          <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">Este mes</span>
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* Chart */}
        <div className="relative flex-shrink-0" style={{ width: 140, height: 140 }}>
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie
                data={data}
                cx={65}
                cy={65}
                innerRadius={45}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {centerValue !== undefined && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-sm font-bold text-slate-900">
                {formatCLP(centerValue, true)}
              </span>
              <span className="text-[10px] text-slate-400">{centerLabel}</span>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-1.5">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-slate-600 flex-1">{item.name}</span>
              <span className="text-xs font-semibold text-slate-700">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
