import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { ProtectedRoute } from "../components/shared/ProtectedRoute";
import { RoleGate } from "../components/shared/RoleGate";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { InteresadoDashboard } from "../pages/dashboards/InteresadoDashboard";
import { SocioDashboard } from "../pages/dashboards/SocioDashboard";
import { PresidenteConvocatorias } from "../pages/dashboard/PresidenteConvocatorias";
import { PresidenteProyectos } from "../pages/dashboard/PresidenteProyectos";
import { RepresentanteDashboard } from "../pages/dashboards/RepresentanteDashboard";
import { useAuth } from "../hooks/useAuth";
import { roleRouteMap } from "../types/auth";
import { ProjectsModule } from "../pages/modules/ProjectsModule";
import { ClubsModule } from "../pages/modules/ClubsModule";
import { ConvocatoriasModule } from "../pages/modules/ConvocatoriasModule";
import { Home } from "../pages/Home";

// Root now shows a public Home with info; if desired, we can auto-nudge to dashboard via CTA

const DashboardRedirect = () => {
  const { role } = useAuth();
  const target = role ? roleRouteMap[role] : "/auth/login";
  return <Navigate to={target ?? "/auth/login"} replace />;
};

export const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/auth/login" element={<Login />} />
    <Route path="/auth/register" element={<Register />} />

    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardRedirect />} />
        <Route
          path="interesado"
          element={
            <RoleGate roles={["INTERESADO"]}>
              <InteresadoDashboard />
            </RoleGate>
          }
        />
        <Route
          path="socio"
          element={
            <RoleGate roles={["SOCIO"]}>
              <SocioDashboard />
            </RoleGate>
          }
        />
        <Route
          path="presidente"
          element={
            <RoleGate roles={["PRESIDENTE DEL CLUB"]}>
              <Outlet />
            </RoleGate>
          }
        >
          <Route index element={<Navigate to="convocatorias" replace />} />
          <Route path="convocatorias" element={<PresidenteConvocatorias />} />
          <Route path="proyectos" element={<PresidenteProyectos />} />
        </Route>
        <Route
          path="representante"
          element={
            <RoleGate roles={["REPRESENTANTE DISTRITAL"]}>
              <RepresentanteDashboard />
            </RoleGate>
          }
        />
        <Route
          path="proyectos"
          element={
            <RoleGate roles={["PRESIDENTE DEL CLUB", "REPRESENTANTE DISTRITAL"]}>
              <ProjectsModule />
            </RoleGate>
          }
        />
        <Route
          path="convocatorias"
          element={
            <RoleGate roles={["SOCIO", "PRESIDENTE DEL CLUB", "REPRESENTANTE DISTRITAL"]}>
              <ConvocatoriasModule />
            </RoleGate>
          }
        />
        <Route
          path="clubes"
          element={
            <RoleGate roles={["PRESIDENTE DEL CLUB", "REPRESENTANTE DISTRITAL"]}>
              <ClubsModule />
            </RoleGate>
          }
        />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
