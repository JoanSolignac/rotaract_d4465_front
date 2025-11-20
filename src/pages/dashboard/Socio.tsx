import { useCallback, useEffect, useMemo, useState, type ComponentProps } from "react";
import { Badge, Button, Card, Pagination, Select } from "flowbite-react";
import { useAuth } from "../../hooks/useAuth";
import { WelcomePanel } from "./components/WelcomePanel";
import { fetchClubProjects, type Proyecto } from "../../api/convocatorias";

const formatDate = (iso?: string) => (iso ? new Date(iso).toLocaleDateString() : "-");

const formatDateRange = (start?: string, end?: string) => {
  const startText = start ? formatDate(start) : null;
  const endText = end ? formatDate(end) : null;
  if (startText && endText) {
    return startText === endText ? startText : `${startText} al ${endText}`;
  }
  return startText ?? endText ?? "-";
};

const estadoBadge = (estado?: string, fallback?: string) => {
  const normalized = (estado ?? fallback ?? "").toUpperCase();
  const color: ComponentProps<typeof Badge>["color"] =
    normalized === "EN_POSTULACION"
      ? "info"
      : normalized === "EN_EJECUCION"
        ? "info"
        : normalized === "PROPUESTO"
          ? "purple"
          : normalized === "FINALIZADO"
            ? "success"
            : normalized === "CANCELADO"
              ? "failure"
              : "gray";
  const label = normalized
    ? normalized
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : "Sin estado";
  return (
    <Badge color={color} className="w-fit">
      {label}
    </Badge>
  );
};

export const Socio = () => {
  const { user } = useAuth();
  const name = user?.nombre ?? user?.correo ?? "Socio";
  const [projects, setProjects] = useState<Proyecto[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchClubProjects({ page: page - 1, size: pageSize });
      setProjects(response.items);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.total);
      const serverPage = (response.page ?? 0) + 1;
      if (serverPage !== page) {
        setPage(serverPage);
      }
    } catch (err) {
      console.error("No se pudieron obtener los proyectos", err);
      setError("Ocurrió un error al cargar los proyectos.");
      setProjects([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const paginationLabel = useMemo(() => {
    const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, totalItems);
    return `Mostrando ${start}-${end} de ${totalItems}`;
  }, [page, pageSize, totalItems]);

  return (
    <div className="space-y-6">
      <WelcomePanel
        greeting={`Bienvenido, ${name}`}
        roleLabel="Socio"
        description="Explora los proyectos vigentes del distrito y postula a las iniciativas que te interesen."
        hint="Aquí verás los proyectos del distrito listos para recibir postulaciones."
      />

      <section className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-border-subtle">
        <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Proyectos del distrito</h2>
            <p className="text-sm text-text-secondary">
              Descubre oportunidades activas y revisa los requisitos antes de postular.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Select
              value={String(pageSize)}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
            >
              {[6, 9, 12].map((option) => (
                <option key={option} value={option}>
                  {option} / pág
                </option>
              ))}
            </Select>
          </div>
        </header>

        {error && (
          <div className="mb-4 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center gap-2 py-10 text-sm text-text-secondary">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            Cargando proyectos...
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-subtle p-10 text-center">
            <h3 className="text-lg font-semibold text-text-primary">No hay proyectos disponibles</h3>
            <p className="text-sm text-text-secondary">
              Cuando haya proyectos activos podrás postularte desde aquí.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="h-full border border-border-subtle shadow-card transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wide text-text-secondary">
                        {project.clubNombre}
                      </p>
                      <h3 className="text-lg font-semibold text-text-primary">{project.titulo}</h3>
                    </div>
                    {estadoBadge(project.estadoProyecto, project.estado)}
                  </div>
                  <p className="text-sm text-text-secondary">{project.descripcion}</p>
                  <div className="grid gap-3 text-xs text-text-secondary sm:grid-cols-2">
                    <div className="rounded-xl border border-border-subtle bg-bg-soft px-3 py-2">
                      <p className="text-[0.65rem] uppercase tracking-wide text-text-secondary opacity-70">
                        Postulación
                      </p>
                      <p className="text-sm font-semibold text-text-primary">
                        {formatDateRange(project.fechaInicioPostulacion, project.fechaFinPostulacion)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border-subtle bg-bg-soft px-3 py-2">
                      <p className="text-[0.65rem] uppercase tracking-wide text-text-secondary opacity-70">
                        Inicio del proyecto
                      </p>
                      <p className="text-sm font-semibold text-text-primary">
                        {project.fechaInicioProyecto ? formatDate(project.fechaInicioProyecto) : "-"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm font-semibold text-text-primary">
                    <span>Cupo: {project.cupoMaximo ?? "-"}</span>
                    <span className="text-text-secondary">Inscritos: {project.inscritos ?? 0}</span>
                  </div>
                  <div className="text-xs text-text-secondary">
                    <span className="font-semibold text-text-primary">Requisitos:</span>{" "}
                    {project.requisitos || "Sin requisitos definidos"}
                  </div>
                  <div className="flex justify-end">
                    <Button
                      size="xs"
                      color="light"
                      className="bg-primary px-4 text-xs font-semibold text-white shadow-soft hover:!bg-primary-dark focus:!ring-primary/40"
                      type="button"
                    >
                      Postular
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-3 text-sm text-text-secondary md:flex-row md:items-center md:justify-between">
              <p>{paginationLabel}</p>
              <div className="flex items-center gap-3">
                <Button color="light" onClick={loadProjects}>
                  Refrescar
                </Button>
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(value) => setPage(value)}
                  showIcons
                />
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
};
