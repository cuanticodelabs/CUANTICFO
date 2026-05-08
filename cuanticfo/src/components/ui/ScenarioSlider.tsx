'use client';

interface ScenarioSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  /** Display formatter, e.g., (v) => `+${v}%`. Defaults to `${v}`. */
  format?: (v: number) => string;
  /** Optional baseline value highlighted on the track. */
  baseline?: number;
  onChange: (v: number) => void;
  /** Optional helper text shown below the label. */
  hint?: string;
}

/**
 * ScenarioSlider — native range, restyled. Champagne accent track + thumb.
 * Used for projection assumptions where felt control beats type-in inputs.
 */
export default function ScenarioSlider({
  label,
  value,
  min,
  max,
  step = 1,
  format = (v) => `${v}`,
  baseline,
  onChange,
  hint,
}: ScenarioSliderProps) {
  const range = max - min;
  const pctValue = ((value - min) / range) * 100;
  const pctBaseline =
    baseline !== undefined ? ((baseline - min) / range) * 100 : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.09em]"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {label}
          </p>
          {hint && (
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              {hint}
            </p>
          )}
        </div>
        <span
          className="text-sm font-semibold tabular"
          style={{ color: 'var(--color-accent)' }}
        >
          {format(value)}
        </span>
      </div>

      <div className="relative h-6 flex items-center">
        {/* Track background */}
        <div
          className="absolute left-0 right-0 h-1.5 rounded-full"
          style={{ backgroundColor: 'var(--color-border)' }}
        />

        {/* Active fill */}
        <div
          className="absolute h-1.5 rounded-full transition-[width] duration-150 ease-out"
          style={{
            left: 0,
            width: `${pctValue}%`,
            backgroundColor: 'var(--color-accent)',
          }}
        />

        {/* Baseline tick */}
        {pctBaseline !== null && (
          <div
            className="absolute w-0.5 h-3 rounded-full"
            style={{
              left: `calc(${pctBaseline}% - 1px)`,
              backgroundColor: 'var(--color-text-muted)',
              opacity: 0.6,
            }}
            aria-hidden="true"
          />
        )}

        {/* The actual range input — invisible but functional */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
          className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
        />

        {/* Visible thumb */}
        <div
          className="absolute w-4 h-4 rounded-full pointer-events-none"
          style={{
            left: `calc(${pctValue}% - 8px)`,
            backgroundColor: 'var(--color-accent)',
            border: '2px solid var(--color-app-bg)',
            boxShadow: '0 0 0 1px var(--color-accent), 0 2px 4px rgba(0,0,0,0.3)',
            transition: 'left 150ms ease-out',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Range labels */}
      <div
        className="flex items-center justify-between mt-1.5 text-[10px] tabular"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <span>{format(min)}</span>
        {pctBaseline !== null && (
          <span style={{ position: 'absolute', left: `${pctBaseline}%`, transform: 'translateX(-50%)' }}>
            base
          </span>
        )}
        <span>{format(max)}</span>
      </div>
    </div>
  );
}
