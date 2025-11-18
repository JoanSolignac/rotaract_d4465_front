import { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  title?: string;
  subtitle?: string;
  description?: string;
  className?: string;
  children: ReactNode;
  action?: ReactNode;
}

export const Card = ({
  title,
  subtitle,
  description,
  className,
  children,
  action,
}: CardProps) => (
  <article className={clsx("material-card p-6", className)}>
    {(title || subtitle || description || action) && (
      <header className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          {title && (
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm font-semibold text-text-secondary">
              {subtitle}
            </p>
          )}
          {description && (
            <p className="text-sm text-text-secondary">{description}</p>
          )}
        </div>
        {action}
      </header>
    )}
    <div>{children}</div>
  </article>
);
