'use client';

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

/**
 * Toggle — accessible switch with visible label.
 * Uses a styled checkbox for native semantics.
 */
export default function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
}: ToggleProps) {
  return (
    <label
      className="flex items-start gap-3 cursor-pointer select-none"
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <span className="relative inline-flex items-center mt-0.5 flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
          aria-label={label}
        />
        <span
          className="w-9 h-5 rounded-full transition-colors"
          style={{
            backgroundColor: checked
              ? 'var(--color-accent)'
              : 'var(--color-border-strong)',
          }}
          aria-hidden="true"
        />
        <span
          className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform"
          style={{
            backgroundColor: 'var(--color-app-bg)',
            transform: checked ? 'translateX(16px)' : 'translateX(0)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.4)',
          }}
          aria-hidden="true"
        />
      </span>

      <div className="min-w-0">
        <p
          className="text-sm font-medium"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {label}
        </p>
        {description && (
          <p
            className="text-xs mt-0.5"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {description}
          </p>
        )}
      </div>
    </label>
  );
}
