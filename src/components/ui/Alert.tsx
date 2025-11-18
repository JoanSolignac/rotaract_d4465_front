import { ReactNode } from 'react';

interface AlertProps {
  tone?: 'info' | 'success' | 'danger' | 'warning';
  title?: string;
  children?: ReactNode;
}

const toneConfig = {
  info: {
    border: 'border-primary/40',
    bg: 'bg-primary/10',
    text: 'text-primary',
  },
  success: {
    border: 'border-success/40',
    bg: 'bg-success/10',
    text: 'text-success',
  },
  danger: {
    border: 'border-danger/40',
    bg: 'bg-danger/10',
    text: 'text-danger',
  },
  warning: {
    border: 'border-warning/40',
    bg: 'bg-warning/10',
    text: 'text-warning',
  },
} as const;

export const Alert = ({ tone = 'info', title, children }: AlertProps) => {
  const config = toneConfig[tone];
  return (
    <div className={`rounded-xl border ${config.border} ${config.bg} p-4`}>
      {title && <p className={`font-semibold ${config.text}`}>{title}</p>}
      {children && <p className="text-sm text-text-primary/80">{children}</p>}
    </div>
  );
};
