import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Badge, Button, Pagination, Select, Table } from "flowbite-react";
import { useAuth } from "../../hooks/useAuth";
import { WelcomePanel } from "./components/WelcomePanel";
import { fetchClubProjects, type Proyecto } from "../../api/convocatorias";

export const PresidenteProyectos = () => {
  const { user } = useAuth();
  const name = user?.nombre ?? user?.correo ?? "Presidente";

  const [projects, setProjects] = useState<Proyecto[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchClubProjects({
        page: page - 1,
        size: pageSize,
      });
      setProjects(response.items);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.total);
      if (response.page + 1 !== page) {
        setPage(response.page + 1);
      }
    } catch (err) {
      console.error("No se pudieron obtener los proyectos", err);
      setError("Ocurrió un error al cargar tus proyectos.");
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

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString() : "-";

  return (
    <div className="space-y-6">
      <WelcomePanel
        greeting={`Bienvenido, ${name}`}
        roleLabel="Presidente del club"
        description="Explora y administra los proyectos de tu club registrados en el distrito."
        hint="Pronto podrás registrar proyectos directamente desde esta vista."
      />

      <section className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-border-subtle">
        <header className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              Proyectos del club
            </h2>
            <p className="text-sm text-text-secondary">
              Consulta el estado y los requisitos de cada proyecto vigente.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={String(pageSize)}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
            >
              {[5, 10, 15].map((option) => (
                <option key={option} value={option}>
                  {option} / pág
                </option>
              ))}
            </Select>
            <Button color="light" onClick={loadProjects}>
              Refrescar
            </Button>
          </div>
        </header>

        {error && (
          <Alert color="failure" className="mb-4">
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="flex flex-col items-center gap-2 py-10 text-sm text-text-secondary">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            Cargando proyectos...
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-subtle p-10 text-center">
            <h3 className="text-lg font-semibold text-text-primary">
              No tienes proyectos registrados
            </h3>
            <p className="text-sm text-text-secondary">
              Registra un nuevo proyecto para compartirlo con el distrito.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-2xl border border-border-subtle">
              <Table>
                <Table.Head className="bg-bg-soft text-xs uppercase text-text-secondary">
                  <Table.HeadCell>Proyecto</Table.HeadCell>
                  <Table.HeadCell>Estado</Table.HeadCell>
                  <Table.HeadCell>Inicio postul.</Table.HeadCell>
                  <Table.HeadCell>Cierre</Table.HeadCell>
                  <Table.HeadCell>Cupo</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {projects.map((project) => (
                    <Table.Row key={project.id} className="bg-white text-sm">
                      <Table.Cell className="font-semibold text-text-primary">
                        {project.titulo}
                        <div className="text-xs text-text-secondary">
                          {project.descripcion}
                        </div>
                        <div className="mt-1 text-xs text-text-secondary">
                          <span className="font-semibold text-text-primary">Requisitos:</span>{" "}
                          {project.requisitos || "Sin requisitos definidos"}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge color={project.estado === "Activo" ? "success" : "info"}>
                          {project.estado}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>{formatDate(project.fechaInicioPostulacion)}</Table.Cell>
                      <Table.Cell>{formatDate(project.fechaCierre)}</Table.Cell>
                      <Table.Cell>{project.cupoMaximo}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
            <div className="mt-4 flex flex-col gap-3 text-sm text-text-secondary md:flex-row md:items-center md:justify-between">
              <p>{paginationLabel}</p>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(value) => setPage(value)}
                showIcons
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
};
