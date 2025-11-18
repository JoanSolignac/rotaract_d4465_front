import { ReactNode } from "react";
import clsx from "clsx";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  align?: "left" | "center";
}

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  actions,
  align = "left",
}: SectionHeadingProps) => (
  <div
    className={clsx(
      "flex flex-col gap-4",
      align === "center" && "text-center items-center",
    )}
  >
    {eyebrow && (
      <span className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">
        {eyebrow}
      </span>
    )}
    <div className="flex flex-col gap-2">
      <h3 className="text-3xl font-semibold text-text-primary">{title}</h3>
      {description && (
        <p className="text-base text-text-secondary">{description}</p>
      )}
    </div>
    {actions && <div className="flex gap-3">{actions}</div>}
  </div>
);

