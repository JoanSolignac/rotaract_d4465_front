import clsx from "clsx";
import { ReactNode } from "react";

type MetricVariant = "primary" | "secondary" | "neutral";

interface MetricCardProps {
  label: string;
  value: string | number;
  trendLabel?: string;
  trendValue?: string;
  icon?: ReactNode;
  variant?: MetricVariant;
}

const variantMap: Record<MetricVariant, string> = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  neutral: "bg-accent/10 text-accent",
};

export const MetricCard = ({
  label,
  value,
  trendLabel,
  trendValue,
  icon,
  variant = "primary",
}: MetricCardProps) => (
  <div className="material-card flex flex-col gap-4 p-5">
    <div className="flex items-center gap-3">
      {icon && (
        <div className={clsx("rounded-xl p-3 text-xl", variantMap[variant])}>
          {icon}
        </div>
      )}
      <p className="text-sm font-medium text-text-secondary">{label}</p>
    </div>
    <div className="text-3xl font-semibold text-text-primary">{value}</div>
    {trendLabel && (
      <p className="text-sm text-text-secondary">
        {trendLabel}{" "}
        {trendValue && (
          <span className="font-semibold text-primary">{trendValue}</span>
        )}
      </p>
    )}
  </div>
);
