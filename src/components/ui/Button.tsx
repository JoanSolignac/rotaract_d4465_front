import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-soft hover:bg-primary-dark focus-visible:ring-primary-dark",
  secondary:
    "bg-secondary text-white shadow-soft hover:bg-secondary/90 focus-visible:ring-secondary/80",
  ghost:
    "bg-transparent text-text-primary border border-border-subtle hover:bg-bg-soft focus-visible:ring-primary",
};

export const Button = ({
  children,
  className,
  fullWidth,
  variant = "primary",
  disabled,
  loading,
  leftIcon,
  ...props
}: ButtonProps) => (
  <button
    className={clsx(
      "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface disabled:cursor-not-allowed disabled:opacity-60",
      variantClasses[variant],
      fullWidth && "w-full",
      className,
    )}
    disabled={disabled || loading}
    {...props}
  >
    {loading && (
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
    )}
    {!loading && leftIcon}
    <span>{children}</span>
  </button>
);

