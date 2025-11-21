import { useCallback, useEffect, useMemo, useState, type ComponentProps } from "react";
import { Badge, Button, Card, Modal, Pagination, Select, Table } from "flowbite-react";
import Swal from "sweetalert2";
import { useAuth } from "../../hooks/useAuth";
import { WelcomePanel } from "./components/WelcomePanel";
import {
  fetchClubProjects,
  fetchProyectoInscripciones,
  inscribirseProyecto,
  type ConvocatoriaInscripcion,
  type Proyecto,
} from "../../api/convocatorias";
import { getApiErrorMessage } from "../../utils/apiErrorMessage";

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
  const [applyingId, setApplyingId] = useState<number | null>(null);
  const [inscriptionsOpen, setInscriptionsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Proyecto | null>(null);
  const [inscriptions, setInscriptions] = useState<ConvocatoriaInscripcion[]>([]);
  const [inscriptionsLoading, setInscriptionsLoading] = useState(false);
  const [inscriptionsError, setInscriptionsError] = useState<string | null>(null);

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

  const loadInscriptions = useCallback(async () => {
    if (!inscriptionsOpen || !selectedProject) return;
    setInscriptionsLoading(true);
    setInscriptionsError(null);
    try {
      const response = await fetchProyectoInscripciones(selectedProject.id, { size: 100 });
      const accepted = response.items.filter(
        (item) => (item.estado ?? "").toUpperCase().startsWith("ACEPT"),
      );
      setInscriptions(accepted);
    } catch (err) {
      console.error("No se pudieron obtener las inscripciones", err);
      setInscriptions([]);
      setInscriptionsError("Ocurrió un error al cargar las inscripciones.");
    } finally {
      setInscriptionsLoading(false);
    }
  }, [inscriptionsOpen, selectedProject]);

  useEffect(() => {
    loadInscriptions();
  }, [loadInscriptions]);

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

      <section className="glass-card relative overflow-hidden p-6 text-white">
        <div className="liquid-blob -left-14 top-10 h-48 w-48 bg-rotaract-pink/35" />
        <div className="liquid-blob right-0 top-0 h-40 w-40 bg-purple-500/25" />
        <div className="relative">
          <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="glass-chip text-[0.65rem] text-rose-50">Proyectos</p>
              <h2 className="mt-2 text-2xl font-bold leading-tight text-white drop-shadow-lg">Proyectos del distrito</h2>
              <p className="text-sm text-rose-50/70">
                Descubre oportunidades activas y revisa los requisitos antes de postular.
              </p>
            </div>
            <div className="glass-card flex items-center gap-3 border-white/15 bg-white/5 px-4 py-3 text-sm text-rose-50">
              <span className="text-xs uppercase tracking-[0.24em] text-rose-50/60">Por página</span>
              <Select
                value={String(pageSize)}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                className="bg-transparent text-white"
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
          <div className="flex flex-col items-center gap-2 py-10 text-sm text-rose-50/70">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-200/30 border-t-rotaract-pink" />
            Cargando proyectos...
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-rose-50">
            <h3 className="text-lg font-semibold text-white">No hay proyectos disponibles</h3>
            <p className="text-sm text-rose-50/70">
              Cuando haya proyectos activos podrás postularte desde aquí.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="glass-card h-full border-white/10 bg-white/5 text-white shadow-strong transition hover:-translate-y-1 hover:shadow-strong"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wide text-rose-50/60">
                        {project.clubNombre}
                      </p>
                      <h3 className="text-lg font-semibold text-white drop-shadow-sm">{project.titulo}</h3>
                    </div>
                    {estadoBadge(project.estadoProyecto, project.estado)}
                  </div>
                  <p className="text-sm text-rose-50/75">{project.descripcion}</p>
                  <div className="grid gap-3 text-xs text-rose-50/70 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-white/10 px-3 py-2">
                      <p className="text-[0.65rem] uppercase tracking-wide text-rose-50/60">
                        Postulación
                      </p>
                      <p className="text-sm font-semibold text-white">
                        {formatDateRange(project.fechaInicioPostulacion, project.fechaFinPostulacion)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/10 px-3 py-2">
                      <p className="text-[0.65rem] uppercase tracking-wide text-rose-50/60">
                        Inicio del proyecto
                      </p>
                      <p className="text-sm font-semibold text-white">
                        {project.fechaInicioProyecto ? formatDate(project.fechaInicioProyecto) : "-"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm font-semibold text-white">
                    <span>Cupo: {project.cupoMaximo ?? "-"}</span>
                    <span className="text-rose-50/70">Inscritos: {project.inscritos ?? 0}</span>
                  </div>
                  <div className="text-xs text-rose-50/75">
                    <span className="font-semibold text-white">Requisitos:</span>{" "}
                    {project.requisitos || "Sin requisitos definidos"}
                  </div>
                  <div className="flex justify-end">
                    <div className="flex flex-col gap-2">
                      <Button
                        size="xs"
                        color="light"
                        className="bg-gradient-to-r from-rotaract-pink to-purple-500 px-4 text-xs font-semibold text-white shadow-strong hover:brightness-110 focus:!ring-primary/40"
                        type="button"
                        disabled={applyingId === project.id}
                        onClick={async () => {
                          setApplyingId(project.id);
                          try {
                            await inscribirseProyecto(project.id);
                            await Swal.fire({
                              title: "Postulación enviada",
                              text: "Tu postulación fue registrada con éxito.",
                              icon: "success",
                              confirmButtonColor: "#1ea896",
                            });
                            await loadProjects();
                          } catch (err) {
                            console.error("No se pudo inscribir al proyecto", err);
                            const message = getApiErrorMessage(
                              err,
                              "No pudimos registrar tu postulación. Intenta nuevamente.",
                            );
                            await Swal.fire({
                              title: "Error",
                              text: message,
                              icon: "error",
                              confirmButtonColor: "#1ea896",
                            });
                          } finally {
                            setApplyingId(null);
                          }
                        }}
                      >
                        {applyingId === project.id ? "Postulando..." : "Postular"}
                      </Button>
                      <Button
                        size="xs"
                        color="light"
                        className="border border-white/15 px-4 text-xs font-semibold text-rose-50 hover:!bg-white/10 focus:!ring-primary/40"
                        onClick={() => {
                          setSelectedProject(project);
                          setInscriptionsOpen(true);
                        }}
                      >
                        Ver inscripciones
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-3 text-sm text-rose-50/70 md:flex-row md:items-center md:justify-between">
              <p>{paginationLabel}</p>
              <div className="flex items-center gap-3">
                <Button color="light" className="border border-white/15 bg-white/5 text-white hover:!bg-white/10" onClick={loadProjects}>
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
        </div>
      </section>

      <Modal
        show={inscriptionsOpen}
        size="3xl"
        onClose={() => {
          setInscriptionsOpen(false);
          setSelectedProject(null);
          setInscriptions([]);
        }}
      >
        <Modal.Header className="bg-[#0f0a17] text-white">
          Inscripciones aceptadas {selectedProject ? `- ${selectedProject.titulo}` : ""}
        </Modal.Header>
        <Modal.Body className="space-y-4 bg-[#0f0a17] text-rose-50">
          {inscriptionsError && (
            <div className="rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
              {inscriptionsError}
            </div>
          )}
          {inscriptionsLoading ? (
            <div className="flex flex-col items-center gap-2 py-6 text-sm text-rose-50/70">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-200/30 border-t-rotaract-pink" />
              Cargando inscripciones...
            </div>
          ) : inscriptions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-8 text-center text-sm text-rose-50/70">
              No hay inscripciones aceptadas.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-white/15">
              <Table className="text-rose-50">
                <Table.Head className="bg-white/5 text-xs uppercase text-rose-50/70">
                  <Table.HeadCell className="text-rose-50">Nombre</Table.HeadCell>
                  <Table.HeadCell className="text-rose-50">Correo</Table.HeadCell>
                  <Table.HeadCell className="text-rose-50">Fecha registro</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y divide-white/10">
                  {inscriptions.map((item) => (
                    <Table.Row key={item.id} className="bg-transparent text-sm text-rose-50">
                      <Table.Cell className="font-semibold text-white">
                        {item.usuarioNombre}
                      </Table.Cell>
                      <Table.Cell className="text-rose-50/70">{item.usuarioCorreo}</Table.Cell>
                      <Table.Cell className="text-rose-50/70">
                        {item.fechaRegistro ? formatDate(item.fechaRegistro) : "-"}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="flex justify-end border-t border-white/10 bg-[#0f0a17] px-6 py-4">
          <Button
            color="light"
            className="border border-white/15 bg-white/5 text-white hover:!bg-white/10"
            onClick={() => {
              setInscriptionsOpen(false);
              setSelectedProject(null);
              setInscriptions([]);
            }}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
