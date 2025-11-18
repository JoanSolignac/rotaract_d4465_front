import { useMemo, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import clsx from "clsx";
import { useAuth } from "../hooks/useAuth";
import { roleRouteMap, type UserRole } from "../types/auth";

interface NavItem {
  label: string;
  path: string;
}

const navigation: Record<UserRole, NavItem[]> = {
  INTERESADO: [{ label: "Convocatorias", path: roleRouteMap.INTERESADO }],
  SOCIO: [{ label: "Proyectos", path: roleRouteMap.SOCIO }],
  "PRESIDENTE DEL CLUB": [
    { label: "Convocatorias", path: `${roleRouteMap["PRESIDENTE DEL CLUB"]}#convocatorias` },
    { label: "Proyectos", path: `${roleRouteMap["PRESIDENTE DEL CLUB"]}#proyectos` },
    { label: "Miembros", path: `${roleRouteMap["PRESIDENTE DEL CLUB"]}#miembros` },
    { label: "Mi Club", path: `${roleRouteMap["PRESIDENTE DEL CLUB"]}#mi-club` },
  ],
  "REPRESENTANTE DISTRITAL": [
    { label: "Clubes", path: roleRouteMap["REPRESENTANTE DISTRITAL"] },
  ],
};

export const DashboardLayout = () => {
  const { user, role, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const items = useMemo(
    () => (role && navigation[role] ? navigation[role] : []),
    [role],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-soft via-bg-soft to-white/90">
      <nav className="fixed top-0 z-20 w-full border-b border-default bg-white shadow-lg">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-semibold text-heading">
              Rotaract D4465
            </span>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-base text-sm text-body hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary md:hidden"
            aria-controls="navbar-solid"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="sr-only">Abrir menú principal</span>
            <svg
              className="h-6 w-6"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14" />
            </svg>
          </button>
          <div
            id="navbar-solid"
            className={clsx(
              "w-full md:block md:w-auto",
              menuOpen ? "block" : "hidden md:block",
            )}
          >
            <ul className="mt-4 flex flex-col rounded-base border border-default bg-white p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-transparent md:p-0">
              {items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      clsx(
                        "block rounded px-3 py-2 text-heading transition hover:bg-neutral-tertiary md:hover:bg-transparent md:p-0",
                        isActive && "text-fg-brand",
                      )
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <span className="block px-3 py-2 text-sm text-heading md:py-0">
                  {user?.correo}
                </span>
              </li>
              <li>
                <button
                  type="button"
                  className="block rounded border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white md:px-3 md:py-1"
                  onClick={logout}
                >
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="mx-auto mt-24 max-w-7xl px-4 pb-10">
        <Outlet />
      </main>
    </div>
  );
};
