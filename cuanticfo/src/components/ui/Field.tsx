'use client';

import { useId } from 'react';

interface FieldProps {
  label: string;
  /** Optional helper text shown under the label. */
  hint?: string;
  /** Optional error text — replaces the hint when present. */
  error?: string;
  /** Optional required marker. */
  required?: boolean;
  children: (props: {
    id: string;
    'aria-describedby': string | undefined;
    'aria-invalid': boolean | undefined;
  }) => React.ReactNode;
}

/**
 * Field — accessible label/hint/error wrapper.
 * The label uses htmlFor on the id supplied to the render-prop child.
 */
export default function Field({
  label,
  hint,
  error,
  required,
  children,
}: FieldProps) {
  const id = useId();
  const descId = `${id}-desc`;
  const describedBy = error || hint ? descId : undefined;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[11px] font-semibold uppercase tracking-[0.09em] mb-1.5"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {label}
        {required && (
          <span
            aria-hidden="true"
            className="ml-1"
            style={{ color: 'var(--color-expense)' }}
          >
            *
          </span>
        )}
        {required && <span className="sr-only"> requerido</span>}
      </label>

      {children({
        id,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
      })}

      {(error || hint) && (
        <p
          id={descId}
          className="text-[11px] mt-1.5"
          style={{
            color: error ? 'var(--color-expense)' : 'var(--color-text-muted)',
          }}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}
