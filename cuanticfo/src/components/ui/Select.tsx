'use client';

import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, className, style, ...rest },
  ref
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        {...rest}
        className={`w-full px-3 py-2 pr-9 text-sm rounded-lg outline-none transition-colors appearance-none cursor-pointer ${className ?? ''}`}
        style={{
          backgroundColor: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-primary)',
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-accent)';
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border)';
          rest.onBlur?.(e);
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        aria-hidden="true"
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: 'var(--color-text-muted)' }}
      />
    </div>
  );
});

export default Select;
