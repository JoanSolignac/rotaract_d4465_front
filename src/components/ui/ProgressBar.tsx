interface ProgressBarProps {
  label: string;
  value: number;
  colorClass?: string;
}

export const ProgressBar = ({
  label,
  value,
  colorClass = "bg-primary",
}: ProgressBarProps) => (
  <div>
    <div className="mb-2 flex items-center justify-between text-sm font-medium text-text-primary">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-2 w-full rounded-full bg-border-subtle">
      <div
        className={`h-2 rounded-full ${colorClass}`}
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  </div>
);

