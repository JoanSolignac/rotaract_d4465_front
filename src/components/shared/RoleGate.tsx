import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { roleRouteMap, type UserRole } from "../../types/auth";

interface RoleGateProps {
  roles: UserRole[];
  children: ReactNode;
}

export const RoleGate = ({ roles, children }: RoleGateProps) => {
  const { role, isLoading, tokens } = useAuth();

  const isResolvingRole = isLoading || (!!tokens?.accessToken && !role);

  if (isResolvingRole) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  if (!role) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!roles.includes(role)) {
    return <Navigate to={roleRouteMap[role]} replace />;
  }

  return <>{children}</>;
};
