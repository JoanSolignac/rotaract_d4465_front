import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  trend?: {
    value: string;
    positive?: boolean;
    label?: string;
  };
  icon?: ReactNode;
}

export const StatCard = ({ label, value, trend, icon }: StatCardProps) => {
  return (
    <div className="glass-panel flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-muted">{label}</p>
        {icon && (
          <span className="rounded-full bg-primary/10 p-2 text-primary" aria-hidden="true">
            {icon}
          </span>
        )}
      </div>
      <p className="text-3xl font-semibold text-text-primary">{value}</p>
      {trend && (
        <p
          className={`text-sm font-medium ${
            trend.positive ? 'text-success' : 'text-danger'
          }`}
        >
          {trend.value} {trend.label && <span className="text-text-secondary">{trend.label}</span>}
        </p>
      )}
    </div>
  );
};
