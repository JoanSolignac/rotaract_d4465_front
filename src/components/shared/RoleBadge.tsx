import { UserRole } from "../../types/auth";
import { roleChipClasses } from "../../utils/roles";
import clsx from "clsx";

export const RoleBadge = ({ role }: { role: UserRole }) => (
  <span
    className={clsx(
      "inline-flex items-center rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-wide",
      roleChipClasses[role],
    )}
  >
    {role}
  </span>
);

