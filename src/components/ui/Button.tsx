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
    "bg-gradient-to-r from-primary via-[#ff4d9f] to-accent text-white shadow-soft hover:from-primary-dark hover:to-accent focus-visible:ring-primary-dark",
  secondary:
    "bg-gradient-to-r from-[#2a1a3f] to-[#1c122f] text-secondary shadow-soft hover:brightness-110 focus-visible:ring-secondary/70 border border-border-subtle",
  ghost:
    "bg-white/5 text-text-primary border border-border-subtle hover:bg-white/10 focus-visible:ring-primary",
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

