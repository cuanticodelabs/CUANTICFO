'use client';

import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  strokeWidth?: number;
  ariaLabel?: string;
}

/**
 * Sparkline — inline trend, no axes, no chrome.
 * Used inside KpiHero, KPI monitoring rows, and dashboard previews.
 */
export default function Sparkline({
  data,
  color = 'var(--color-text-muted)',
  height = 40,
  strokeWidth = 2,
  ariaLabel,
}: SparklineProps) {
  const points = data.map((v, i) => ({ i, v }));
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pad = (max - min) * 0.1 || 1;

  return (
    <div
      className="w-full"
      style={{ height }}
      role="img"
      aria-label={ariaLabel ?? 'Tendencia'}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
          <YAxis hide domain={[min - pad, max + pad]} />
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={strokeWidth}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
