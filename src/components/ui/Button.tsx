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
    "bg-gradient-to-r from-primary via-[#ff4fa5] to-accent text-white shadow-soft hover:brightness-110 focus-visible:ring-primary-dark border border-white/10 backdrop-blur-lg",
  secondary:
    "bg-white/10 text-secondary shadow-soft hover:bg-white/14 focus-visible:ring-secondary/70 border border-white/15 backdrop-blur-lg",
  ghost:
    "bg-white/0 text-text-primary border border-white/10 hover:bg-white/5 focus-visible:ring-primary/70",
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

