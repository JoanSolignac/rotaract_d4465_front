import { useCallback, useEffect, useMemo, useState, type ComponentProps } from "react";
import {
  Alert,
  Badge,
  Button,
  Modal,
  Pagination,
  Select,
  Table,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useAuth } from "../../hooks/useAuth";
import { WelcomePanel } from "./components/WelcomePanel";
import {
  fetchClubProjects,
  createProyecto,
  updateProyecto,
  fetchProyectoInscripciones,
  aceptarInscripcionProyecto,
  rechazarInscripcionProyecto,
  type Proyecto,
  type CreateProyectoPayload,
  type UpdateProyectoPayload,
  type ConvocatoriaInscripcion,
} from "../../api/convocatorias";
import { getApiErrorMessage } from "../../utils/apiErrorMessage";

const estadoProyectoStyles: Record<
  string,
  { label: string; accentClass: string }
> = {
  PROPUESTO: { label: "Propuesto", accentClass: "bg-gray-400" },
  EN_POSTULACION: { label: "En postulación", accentClass: "bg-primary" },
  EN_EJECUCION: { label: "En ejecución", accentClass: "bg-sky-500" },
  FINALIZADO: { label: "Finalizado", accentClass: "bg-emerald-500" },
  CANCELADO: { label: "Cancelado", accentClass: "bg-rose-400" },
  ACTIVO: { label: "Activo", accentClass: "bg-emerald-500" },
  INACTIVO: { label: "Inactivo", accentClass: "bg-gray-400" },
};

const formatEstadoLabel = (value: string) =>
  value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getEstadoProyectoDisplay = (estado?: string, fallback?: string) => {
  const value = estado || fallback;
  if (!value) {
    return { label: "Sin estado", accentClass: "bg-border-subtle" };
  }
  const normalized = value.toUpperCase();
  return (
    estadoProyectoStyles[normalized] ?? {
      label: formatEstadoLabel(normalized),
      accentClass: "bg-border-subtle",
    }
  );
};

const EstadoBadge = ({ estado, fallback }: { estado?: string; fallback?: string }) => {
  const { label, accentClass } = getEstadoProyectoDisplay(estado, fallback);
  const color: ComponentProps<typeof Badge>["color"] =
    accentClass.includes("emerald") || accentClass.includes("primary")
      ? "success"
      : accentClass.includes("sky")
        ? "info"
        : accentClass.includes("purple")
          ? "purple"
          : accentClass.includes("rose")
            ? "failure"
            : "gray";
  return (
    <Badge color={color} className="rounded-base px-3 py-1 text-xs font-semibold uppercase">
      {label}
    </Badge>
  );
};

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormError, setEditFormError] = useState<string | null>(null);
  const [projectToEdit, setProjectToEdit] = useState<Proyecto | null>(null);
  const [inscriptionsOpen, setInscriptionsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Proyecto | null>(null);
  const [inscriptions, setInscriptions] = useState<ConvocatoriaInscripcion[]>([]);
  const [inscriptionsPage, setInscriptionsPage] = useState(1);
  const [inscriptionsPageSize, setInscriptionsPageSize] = useState(5);
  const [inscriptionsTotalPages, setInscriptionsTotalPages] = useState(1);
  const [inscriptionsTotal, setInscriptionsTotal] = useState(0);
  const [inscriptionsLoading, setInscriptionsLoading] = useState(false);
  const [inscriptionsError, setInscriptionsError] = useState<string | null>(null);
  const [acceptingInscriptionId, setAcceptingInscriptionId] = useState<number | null>(null);
  const [rejectingInscriptionId, setRejectingInscriptionId] = useState<number | null>(null);
  const [inscriptionsSearch, setInscriptionsSearch] = useState("");
  const [inscriptionsStatusFilter, setInscriptionsStatusFilter] = useState<"TODAS" | "PENDIENTE" | "ACEPTADA">("TODAS");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProyectoPayload>({
    defaultValues: {
      titulo: "",
      descripcion: "",
      objetivo: "",
      requisitos: "",
      lugar: "",
      cupoMaximo: 0,
      fechaInicioPostulacion: new Date().toISOString().substring(0, 10),
      fechaFinPostulacion: new Date().toISOString().substring(0, 10),
      fechaInicioProyecto: new Date().toISOString().substring(0, 10),
      fechaFinProyecto: new Date().toISOString().substring(0, 10),
    },
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors, isSubmitting: isEditSubmitting },
  } = useForm<UpdateProyectoPayload>({
    defaultValues: {
      titulo: "",
      descripcion: "",
      objetivo: "",
      requisitos: "",
      lugar: "",
      cupoMaximo: undefined,
      fechaInicioPostulacion: "",
      fechaFinPostulacion: "",
      fechaInicioProyecto: "",
      fechaFinProyecto: "",
    },
  });

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

  const formatDateRange = (start?: string, end?: string) => {
    const startText = start ? formatDate(start) : null;
    const endText = end ? formatDate(end) : null;
    if (startText && endText) {
      return startText === endText ? startText : `${startText} al ${endText}`;
    }
    return startText ?? endText ?? "-";
  };

  const openModal = () => {
    setFormError(null);
    reset({
      titulo: "",
      descripcion: "",
      objetivo: "",
      requisitos: "",
      lugar: "",
      cupoMaximo: 0,
      fechaInicioPostulacion: new Date().toISOString().substring(0, 10),
      fechaFinPostulacion: new Date().toISOString().substring(0, 10),
      fechaInicioProyecto: new Date().toISOString().substring(0, 10),
      fechaFinProyecto: new Date().toISOString().substring(0, 10),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormError(null);
  };

  const openEditModal = (project: Proyecto) => {
    setProjectToEdit(project);
    setEditFormError(null);
    resetEdit({
      titulo: project.titulo ?? "",
      descripcion: project.descripcion ?? "",
      objetivo: project.objetivo ?? "",
      requisitos: project.requisitos ?? "",
      lugar: project.lugar ?? "",
      cupoMaximo: project.cupoMaximo,
      fechaInicioPostulacion: project.fechaInicioPostulacion ?? "",
      fechaFinPostulacion: project.fechaFinPostulacion ?? "",
      fechaInicioProyecto: project.fechaInicioProyecto ?? "",
      fechaFinProyecto: project.fechaFinProyecto ?? "",
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditFormError(null);
    setProjectToEdit(null);
  };

  const openInscriptionsModal = (project: Proyecto) => {
    setSelectedProject(project);
    setInscriptionsPage(1);
    setInscriptionsError(null);
    setInscriptionsOpen(true);
  };

  const closeInscriptionsModal = () => {
    setInscriptionsOpen(false);
    setSelectedProject(null);
    setInscriptions([]);
    setInscriptionsTotal(0);
    setInscriptionsError(null);
  };

  const onSubmit = async (values: CreateProyectoPayload) => {
    try {
      setFormError(null);
      const payload: CreateProyectoPayload = {
        ...values,
        cupoMaximo: Number(values.cupoMaximo),
      };
      await createProyecto(payload);
      closeModal();
      await Swal.fire({
        title: "Proyecto creado",
        text: "Se registró el proyecto correctamente.",
        icon: "success",
        confirmButtonColor: "#1ea896",
      });
      setPage(1);
      loadProjects();
    } catch (err) {
      console.error("No se pudo crear el proyecto", err);
      setFormError("No pudimos crear el proyecto. Intenta nuevamente.");
      await Swal.fire({
        title: "Error",
        text: "No pudimos crear el proyecto. Intenta nuevamente.",
        icon: "error",
        confirmButtonColor: "#1ea896",
      });
    }
  };

  const onSubmitEdit = async (values: UpdateProyectoPayload) => {
    if (!projectToEdit) return;
    try {
      setEditFormError(null);
      const payload: UpdateProyectoPayload = {};
      if (values.titulo?.trim()) payload.titulo = values.titulo.trim();
      if (values.descripcion?.trim()) payload.descripcion = values.descripcion.trim();
      if (values.objetivo?.trim()) payload.objetivo = values.objetivo.trim();
      if (values.requisitos?.trim()) payload.requisitos = values.requisitos.trim();
      if (values.lugar?.trim()) payload.lugar = values.lugar.trim();
      if (values.cupoMaximo !== undefined && !Number.isNaN(Number(values.cupoMaximo))) {
        payload.cupoMaximo = Number(values.cupoMaximo);
      }
      if (values.fechaInicioPostulacion) payload.fechaInicioPostulacion = values.fechaInicioPostulacion;
      if (values.fechaFinPostulacion) payload.fechaFinPostulacion = values.fechaFinPostulacion;
      if (values.fechaInicioProyecto) payload.fechaInicioProyecto = values.fechaInicioProyecto;
      if (values.fechaFinProyecto) payload.fechaFinProyecto = values.fechaFinProyecto;

      if (Object.keys(payload).length === 0) {
        closeEditModal();
        return;
      }

      await updateProyecto(projectToEdit.id, payload);
      closeEditModal();
      await Swal.fire({
        title: "Proyecto actualizado",
        text: "Los cambios se guardaron correctamente.",
        icon: "success",
        confirmButtonColor: "#1ea896",
      });
      loadProjects();
    } catch (err) {
      console.error("No se pudo actualizar el proyecto", err);
      setEditFormError("No pudimos guardar los cambios. Intenta nuevamente.");
      await Swal.fire({
        title: "Error",
        text: "No pudimos actualizar el proyecto. Intenta nuevamente.",
        icon: "error",
        confirmButtonColor: "#1ea896",
      });
    }
  };

  const loadInscriptions = useCallback(async () => {
    if (!inscriptionsOpen || !selectedProject) return;
    setInscriptionsLoading(true);
    setInscriptionsError(null);
    try {
      const response = await fetchProyectoInscripciones(selectedProject.id, {
        page: inscriptionsPage - 1,
        size: inscriptionsPageSize,
      });
      setInscriptions(response.items);
      setInscriptionsTotal(response.total || response.items.length || 0);
      setInscriptionsTotalPages(response.totalPages || 1);
      const serverPage = (response.page ?? 0) + 1;
      if (serverPage !== inscriptionsPage) {
        setInscriptionsPage(serverPage);
      }
    } catch (err) {
      console.error("No se pudieron obtener las inscripciones del proyecto", err);
      setInscriptionsError("Ocurrió un error al cargar las inscripciones.");
      setInscriptions([]);
      setInscriptionsTotal(0);
      setInscriptionsTotalPages(1);
    } finally {
      setInscriptionsLoading(false);
    }
  }, [inscriptionsOpen, inscriptionsPage, inscriptionsPageSize, selectedProject]);

  useEffect(() => {
    loadInscriptions();
  }, [loadInscriptions]);

  const filteredInscriptions = useMemo(() => {
    const term = inscriptionsSearch.trim().toLowerCase();
    return inscriptions.filter((item) => {
      const matchesSearch =
        term.length === 0 ||
        item.usuarioNombre.toLowerCase().includes(term) ||
        item.usuarioCorreo.toLowerCase().includes(term);
      const status = (item.estado ?? "").toUpperCase();
      const matchesStatus =
        inscriptionsStatusFilter === "TODAS" ||
        (inscriptionsStatusFilter === "PENDIENTE" && status === "PENDIENTE") ||
        (inscriptionsStatusFilter === "ACEPTADA" && status.startsWith("ACEPT"));
      return matchesSearch && matchesStatus;
    });
  }, [inscriptions, inscriptionsSearch, inscriptionsStatusFilter]);

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
            <Button
              color="light"
              className="bg-primary px-5 text-white hover:!bg-primary-dark focus:!ring-primary/40"
              onClick={openModal}
            >
              Crear proyecto
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
                  <Table.HeadCell>Título</Table.HeadCell>
                  <Table.HeadCell>Estado</Table.HeadCell>
                  <Table.HeadCell>Inicio postul.</Table.HeadCell>
                  <Table.HeadCell>Cierre</Table.HeadCell>
                  <Table.HeadCell>Cupo</Table.HeadCell>
                  <Table.HeadCell>Acciones</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {projects.map((project) => (
                    <Table.Row
                      key={project.id}
                      className="bg-white text-sm transition hover:bg-bg-soft/50"
                    >
                      <Table.Cell className="font-semibold text-text-primary">
                        <div className="space-y-1">
                          <p className="text-base">{project.titulo}</p>
                          <p className="text-xs uppercase tracking-wide text-text-secondary opacity-80">
                            {project.clubNombre}
                          </p>
                          <p className="text-sm font-normal text-text-secondary">
                            {project.descripcion || "Sin descripción disponible"}
                          </p>
                        </div>
                        <div className="mt-2 text-xs font-normal text-text-secondary">
                          <span className="font-semibold text-text-primary">Requisitos:</span>{" "}
                          {project.requisitos || "Sin requisitos definidos"}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <EstadoBadge estado={project.estadoProyecto} fallback={project.estado} />
                      </Table.Cell>
                      <Table.Cell className="text-sm font-medium text-text-primary">
                        {project.fechaInicioPostulacion
                          ? formatDate(project.fechaInicioPostulacion)
                          : "-"}
                      </Table.Cell>
                      <Table.Cell className="text-sm font-medium text-text-primary">
                        {project.fechaFinPostulacion ? formatDate(project.fechaFinPostulacion) : "-"}
                      </Table.Cell>
                      <Table.Cell className="text-sm font-semibold text-text-primary">
                        {Number.isFinite(project.cupoMaximo) ? project.cupoMaximo : "-"}
                      </Table.Cell>
                      <Table.Cell className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="xs"
                            color="light"
                            type="button"
                            className="rounded-base bg-primary px-3 py-1 text-xs font-semibold text-white transition hover:!bg-primary-dark focus:!ring-primary/40"
                            onClick={() => openInscriptionsModal(project)}
                          >
                            Ver inscripciones
                          </Button>
                          <Button
                            size="xs"
                            color="light"
                            type="button"
                            className="rounded-base px-3 py-1 text-xs font-semibold text-white transition hover:!bg-secondary-dark focus:!ring-secondary/40"
                            style={{ backgroundColor: "var(--secondary)" }}
                            onClick={() => openEditModal(project)}
                          >
                            Editar proyecto
                          </Button>
                        </div>
                      </Table.Cell>
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
      <Modal show={isModalOpen} onClose={closeModal} size="2xl">
        <Modal.Header>Nuevo proyecto</Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-primary">Título</label>
              <TextInput
                {...register("titulo", { required: "El título es obligatorio" })}
                color={errors.titulo ? "failure" : "gray"}
                helperText={errors.titulo?.message}
              />
            </div>
            <div className="sm:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-primary">Descripción</label>
              <Textarea
                rows={3}
                {...register("descripcion", {
                  required: "La descripción es obligatoria",
                  minLength: { value: 10, message: "Incluye al menos 10 caracteres" },
                })}
                color={errors.descripcion ? "failure" : "gray"}
                helperText={errors.descripcion?.message}
              />
            </div>
            <div className="sm:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-primary">Objetivo</label>
              <Textarea
                rows={3}
                {...register("objetivo", {
                  required: "El objetivo es obligatorio",
                  minLength: { value: 5, message: "Incluye al menos 5 caracteres" },
                })}
                color={errors.objetivo ? "failure" : "gray"}
                helperText={errors.objetivo?.message}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-primary">Lugar</label>
              <TextInput
                {...register("lugar", { required: "El lugar es obligatorio" })}
                color={errors.lugar ? "failure" : "gray"}
                helperText={errors.lugar?.message}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-primary">Cupo máximo</label>
              <TextInput
                type="number"
                min={0}
                {...register("cupoMaximo", {
                  required: "Ingresa el cupo máximo",
                  min: { value: 0, message: "No puede ser negativo" },
                  valueAsNumber: true,
                })}
                color={errors.cupoMaximo ? "failure" : "gray"}
                helperText={errors.cupoMaximo?.message}
              />
            </div>
            {[
              { name: "fechaInicioPostulacion", label: "Inicio de postulación" },
              { name: "fechaFinPostulacion", label: "Fin de postulación" },
              { name: "fechaInicioProyecto", label: "Inicio del proyecto" },
              { name: "fechaFinProyecto", label: "Fin del proyecto" },
            ].map(({ name, label }) => {
              const key = name as keyof CreateProyectoPayload;
              const fieldError = errors[key];
              return (
                <div key={name} className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-text-primary">
                    {label}
                  </label>
                  <TextInput
                    type="date"
                    {...register(key, { required: "Selecciona una fecha" })}
                    color={fieldError ? "failure" : "gray"}
                    helperText={fieldError?.message}
                  />
                </div>
              );
            })}
            <div className="sm:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-primary">Requisitos</label>
              <Textarea
                rows={3}
                {...register("requisitos", {
                  required: "Describe los requisitos",
                })}
                color={errors.requisitos ? "failure" : "gray"}
                helperText={errors.requisitos?.message}
              />
            </div>
            {formError && (
              <Alert className="sm:col-span-2" color="failure" onDismiss={() => setFormError(null)}>
                {formError}
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer className="flex justify-end gap-2 border-t border-border-subtle px-6 py-4">
            <Button
              color="light"
              className="px-5 text-text-primary hover:!bg-gray-100 focus:!ring-gray-300"
              onClick={closeModal}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              color="light"
              className="bg-primary px-5 text-white hover:!bg-primary-dark focus:!ring-primary/40 disabled:bg-border-subtle"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      <Modal show={isEditModalOpen} onClose={closeEditModal} size="2xl">
        <Modal.Header>Editar proyecto</Modal.Header>
        <form onSubmit={handleSubmitEdit(onSubmitEdit)}>
          <Modal.Body className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-primary">Título</label>
              <TextInput
                {...registerEdit("titulo")}
                color={editErrors.titulo ? "failure" : "gray"}
                helperText={editErrors.titulo?.message}
              />
            </div>
            <div className="sm:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-primary">Descripción</label>
              <Textarea
                rows={3}
                {...registerEdit("descripcion", {
                  maxLength: { value: 500, message: "Máximo 500 caracteres" },
                })}
                color={editErrors.descripcion ? "failure" : "gray"}
                helperText={editErrors.descripcion?.message}
              />
            </div>
            <div className="sm:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-primary">Objetivo</label>
              <Textarea
                rows={3}
                {...registerEdit("objetivo")}
                color={editErrors.objetivo ? "failure" : "gray"}
                helperText={editErrors.objetivo?.message}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-primary">Lugar</label>
              <TextInput
                {...registerEdit("lugar")}
                color={editErrors.lugar ? "failure" : "gray"}
                helperText={editErrors.lugar?.message}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-primary">Cupo máximo</label>
              <TextInput
                type="number"
                min={0}
                {...registerEdit("cupoMaximo", {
                  min: { value: 0, message: "No puede ser negativo" },
                  valueAsNumber: true,
                })}
                color={editErrors.cupoMaximo ? "failure" : "gray"}
                helperText={editErrors.cupoMaximo?.message}
              />
            </div>
            {[
              { name: "fechaInicioPostulacion", label: "Inicio de postulación" },
              { name: "fechaFinPostulacion", label: "Fin de postulación" },
              { name: "fechaInicioProyecto", label: "Inicio del proyecto" },
              { name: "fechaFinProyecto", label: "Fin del proyecto" },
            ].map(({ name, label }) => {
              const key = name as keyof UpdateProyectoPayload;
              const fieldError = editErrors[key];
              return (
                <div key={name} className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-text-primary">
                    {label}
                  </label>
                  <TextInput
                    type="date"
                    {...registerEdit(key)}
                    color={fieldError ? "failure" : "gray"}
                    helperText={fieldError?.message}
                  />
                </div>
              );
            })}
            <div className="sm:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-primary">Requisitos</label>
              <Textarea
                rows={3}
                {...registerEdit("requisitos", {
                  maxLength: { value: 500, message: "Máximo 500 caracteres" },
                })}
                color={editErrors.requisitos ? "failure" : "gray"}
                helperText={editErrors.requisitos?.message}
              />
            </div>
            {editFormError && (
              <Alert className="sm:col-span-2" color="failure" onDismiss={() => setEditFormError(null)}>
                {editFormError}
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer className="flex justify-end gap-2 border-t border-border-subtle px-6 py-4">
            <Button
              color="light"
              className="px-5 text-text-primary hover:!bg-gray-100 focus:!ring-gray-300"
              onClick={closeEditModal}
              disabled={isEditSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              color="light"
              className="bg-primary px-5 text-white hover:!bg-primary-dark focus:!ring-primary/40 disabled:bg-border-subtle"
              disabled={isEditSubmitting}
            >
              {isEditSubmitting ? "Guardando..." : "Guardar cambios"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      <Modal
        show={inscriptionsOpen}
        onClose={closeInscriptionsModal}
        size="6xl"
      >
        <Modal.Header className="text-lg font-semibold">
          Inscripciones {selectedProject ? `- ${selectedProject.titulo}` : ""}
        </Modal.Header>
        <Modal.Body className="space-y-5 text-sm sm:text-base">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex w-full flex-col gap-1">
              <label className="text-sm font-semibold text-text-primary">Buscar por nombre o correo</label>
              <TextInput
                placeholder="Ej: Ana Perez"
                value={inscriptionsSearch}
                onChange={(event) => setInscriptionsSearch(event.target.value)}
              />
            </div>
            <div className="flex w-full flex-col gap-1 sm:max-w-xs">
              <label className="text-sm font-semibold text-text-primary">Estado</label>
              <Select
                value={inscriptionsStatusFilter}
                onChange={(event) =>
                  setInscriptionsStatusFilter(event.target.value as typeof inscriptionsStatusFilter)
                }
              >
                <option value="TODAS">Todas</option>
                <option value="PENDIENTE">Pendientes</option>
                <option value="ACEPTADA">Aceptadas</option>
              </Select>
            </div>
          </div>
          {inscriptionsError && (
            <Alert color="failure" onDismiss={() => setInscriptionsError(null)}>
              {inscriptionsError}
            </Alert>
          )}
          {inscriptionsLoading ? (
            <div className="flex flex-col items-center gap-2 py-6 text-sm text-text-secondary">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
              Cargando inscripciones...
            </div>
          ) : inscriptions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border-subtle p-8 text-center text-sm text-text-secondary">
              No hay inscripciones registradas.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border-subtle">
              <Table>
                <Table.Head className="bg-bg-soft text-sm uppercase text-text-secondary">
                  <Table.HeadCell className="!px-5 !py-3">Nombre</Table.HeadCell>
                  <Table.HeadCell className="!px-5 !py-3">Correo</Table.HeadCell>
                  <Table.HeadCell className="!px-5 !py-3">Tipo</Table.HeadCell>
                  <Table.HeadCell className="!px-5 !py-3">Estado</Table.HeadCell>
                  <Table.HeadCell className="!px-5 !py-3">Fecha registro</Table.HeadCell>
                  <Table.HeadCell className="!px-5 !py-3 text-center">Acciones</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {filteredInscriptions.map((item) => {
                    const estado = item.estado?.toUpperCase() ?? "";
                    const isPending = estado === "PENDIENTE";
                    const isAccepted = estado.startsWith("ACEPT");
                    const projectStart = selectedProject?.fechaInicioProyecto
                      ? new Date(selectedProject.fechaInicioProyecto)
                      : null;
                    const today = new Date();
                    const actionsDisabled = projectStart ? projectStart <= today : false;
                    const badgeColor = isAccepted ? "success" : isPending ? "warning" : "gray";
                    return (
                      <Table.Row key={item.id} className="bg-white text-sm sm:text-base">
                        <Table.Cell className="!px-5 !py-3 font-semibold text-text-primary">
                          {item.usuarioNombre}
                        </Table.Cell>
                        <Table.Cell className="!px-5 !py-3 text-text-secondary">
                          {item.usuarioCorreo}
                        </Table.Cell>
                        <Table.Cell className="!px-5 !py-3 text-text-secondary">
                          {item.tipo}
                        </Table.Cell>
                        <Table.Cell className="!px-5 !py-3 text-text-secondary">
                          <Badge
                            color={badgeColor}
                            className="rounded-base px-3 py-1 text-xs font-semibold"
                          >
                            {item.estado}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell className="!px-5 !py-3 text-text-secondary">
                          {item.fechaRegistro ? formatDate(item.fechaRegistro) : "-"}
                        </Table.Cell>
                        <Table.Cell className="!px-5 !py-3 text-center">
                          <div className="flex flex-wrap items-center justify-center gap-2">
                            {isPending && (
                              <Button
                                size="xs"
                                color="success"
                                className="px-3 text-xs font-semibold text-white"
                                disabled={acceptingInscriptionId === item.id || actionsDisabled}
                                onClick={async () => {
                                  if (!selectedProject) return;
                                  setAcceptingInscriptionId(item.id);
                                  try {
                                    await aceptarInscripcionProyecto(selectedProject.id, item.id);
                                  await Swal.fire({
                                    title: "Inscripción aceptada",
                                    text: "El socio ha sido aceptado en el proyecto.",
                                    icon: "success",
                                    confirmButtonColor: "#1ea896",
                                  });
                                  loadInscriptions();
                                } catch (err) {
                                  console.error("No se pudo aceptar la inscripción", err);
                                  const message = getApiErrorMessage(
                                    err,
                                    "No pudimos aceptar la inscripción. Intenta nuevamente.",
                                  );
                                  await Swal.fire({
                                    title: "Error",
                                    text: message,
                                    icon: "error",
                                    confirmButtonColor: "#1ea896",
                                  });
                                } finally {
                                  setAcceptingInscriptionId(null);
                                }
                              }}
                            >
                              {acceptingInscriptionId === item.id ? "Aceptando..." : "Aceptar"}
                              </Button>
                            )}
                            {(isPending || isAccepted) && (
                              <Button
                                size="xs"
                                color="failure"
                                className="px-3 text-xs font-semibold text-white"
                                disabled={rejectingInscriptionId === item.id || actionsDisabled}
                                onClick={async () => {
                                  if (!selectedProject) return;
                                  setRejectingInscriptionId(item.id);
                                  try {
                                    await rechazarInscripcionProyecto(selectedProject.id, item.id);
                                  await Swal.fire({
                                    title: "Inscripción rechazada",
                                    text: "El socio fue rechazado para este proyecto.",
                                    icon: "success",
                                    confirmButtonColor: "#1ea896",
                                  });
                                  loadInscriptions();
                                } catch (err) {
                                  console.error("No se pudo rechazar la inscripción", err);
                                  const message = getApiErrorMessage(
                                    err,
                                    "No pudimos rechazar la inscripción. Intenta nuevamente.",
                                  );
                                  await Swal.fire({
                                    title: "Error",
                                    text: message,
                                    icon: "error",
                                    confirmButtonColor: "#1ea896",
                                  });
                                } finally {
                                  setRejectingInscriptionId(null);
                                }
                              }}
                            >
                                {rejectingInscriptionId === item.id ? "Rechazando..." : "Rechazar"}
                              </Button>
                            )}
                            {!isPending && !isAccepted && (
                              <span className="text-text-secondary">-</span>
                            )}
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="flex flex-col gap-3 border-t border-border-subtle px-6 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button color="light" onClick={closeInscriptionsModal}>
              Cerrar
            </Button>
            <span className="text-text-secondary">
              Mostrando {filteredInscriptions.length} de {inscriptionsTotal}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={String(inscriptionsPageSize)}
              onChange={(event) => {
                setInscriptionsPageSize(Number(event.target.value));
                setInscriptionsPage(1);
              }}
            >
              {[5, 10, 15].map((option) => (
                <option key={option} value={option}>
                  {option} / pág
                </option>
              ))}
            </Select>
            <Pagination
              currentPage={inscriptionsPage}
              totalPages={inscriptionsTotalPages}
              onPageChange={(value) => setInscriptionsPage(value)}
              showIcons
            />
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
