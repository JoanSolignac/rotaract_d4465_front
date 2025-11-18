import { InputHTMLAttributes, ReactNode } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  error?: string;
  icon?: ReactNode;
}

export const TextField = ({
  label,
  helperText,
  error,
  icon,
  className,
  type = 'text',
  ...props
}: TextFieldProps) => {
  const inputClasses = [
    'w-full rounded-xl border border-border-soft bg-white/90 px-4 py-3 text-base text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all',
    icon ? 'pl-11' : '',
    error ? 'border-danger' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-text-secondary">
      {label}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
            {icon}
          </span>
        )}
        <input type={type} className={inputClasses} {...props} />
      </div>
      <span className="min-h-[1.25rem] text-xs">
        {error ? <span className="text-danger">{error}</span> : helperText}
      </span>
    </label>
  );
};
