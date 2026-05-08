'use client';

import { forwardRef } from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, style, ...rest },
  ref
) {
  return (
    <input
      ref={ref}
      {...rest}
      className={`w-full px-3 py-2 text-sm rounded-lg outline-none transition-colors tabular ${className ?? ''}`}
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
    />
  );
});

export default Input;
