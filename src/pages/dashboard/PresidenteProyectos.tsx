import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
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
  type Proyecto,
  type CreateProyectoPayload,
  type UpdateProyectoPayload,
  type ConvocatoriaInscripcion,
} from "../../api/convocatorias";

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
  return (
    <span className="inline-flex items-center rounded-full border border-border-subtle bg-white/60 px-3 py-1 text-xs font-medium text-text-secondary shadow-sm">
      <span className={`mr-2 h-2.5 w-2.5 rounded-full ${accentClass}`} />
      {label}
    </span>
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
            <div className="overflow-x-auto rounded-2xl border border-border-subtle bg-white">
              <Table>
                <Table.Head className="bg-white/80 text-[0.7rem] font-semibold uppercase tracking-wide text-text-secondary">
                  <Table.HeadCell className="!bg-transparent !py-3">Proyecto</Table.HeadCell>
                  <Table.HeadCell className="!bg-transparent !py-3 text-center">Estado</Table.HeadCell>
                  <Table.HeadCell className="!bg-transparent !py-3">Postulación</Table.HeadCell>
                  <Table.HeadCell className="!bg-transparent !py-3 text-center">Cupo</Table.HeadCell>
                  <Table.HeadCell className="!bg-transparent !py-3 text-center">Inscritos</Table.HeadCell>
                  <Table.HeadCell className="!bg-transparent !py-3 text-center">
                    Acciones
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y divide-border-subtle/70">
                  {projects.map((project) => {
                    return (
                      <Table.Row
                        key={project.id}
                        className="bg-transparent text-sm transition hover:bg-bg-soft/50"
                      >
                        <Table.Cell className="align-top text-text-secondary">
                          <div className="space-y-1">
                            <p className="text-base font-semibold text-text-primary">
                              {project.titulo}
                            </p>
                            <p className="text-xs uppercase tracking-wide text-text-secondary opacity-80">
                              {project.clubNombre}
                            </p>
                            <p className="text-sm">
                              {project.descripcion || "Sin descripción disponible"}
                            </p>
                          </div>
                          <div className="mt-3 text-xs text-text-secondary">
                            <span className="font-semibold text-text-primary">Requisitos:</span>{" "}
                            {project.requisitos || "Sin requisitos definidos"}
                          </div>
                        </Table.Cell>
                        <Table.Cell className="align-middle text-center">
                          <EstadoBadge estado={project.estadoProyecto} fallback={project.estado} />
                        </Table.Cell>
                        <Table.Cell className="align-middle text-xs text-text-secondary">
                          <p className="text-[0.65rem] uppercase tracking-wide text-text-secondary opacity-70">
                            Postulación
                          </p>
                          <p className="text-sm font-medium text-text-primary">
                            {formatDateRange(project.fechaInicioPostulacion, project.fechaFinPostulacion)}
                          </p>
                        </Table.Cell>
                        <Table.Cell className="align-middle text-center text-sm font-semibold text-text-primary">
                          {Number.isFinite(project.cupoMaximo) ? project.cupoMaximo : "-"}
                        </Table.Cell>
                        <Table.Cell className="align-middle text-center text-sm font-semibold text-text-primary">
                          {project.inscritos ?? 0}
                        </Table.Cell>
                        <Table.Cell className="align-middle">
                          <div className="mx-auto flex w-40 flex-col items-stretch gap-2">
                            <Button
                              size="xs"
                              color="light"
                              type="button"
                              className="bg-primary px-4 text-xs font-semibold text-white shadow-soft hover:!bg-primary-dark focus:!ring-primary/40"
                              onClick={() => openInscriptionsModal(project)}
                            >
                              Ver inscripciones
                            </Button>
                            <Button
                              size="xs"
                              color="light"
                              type="button"
                              className="bg-purple-500 px-4 text-xs font-semibold text-white shadow-soft hover:!bg-purple-600 focus:!ring-purple-400"
                              onClick={() => openEditModal(project)}
                            >
                              Editar proyecto
                            </Button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
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
      <Modal show={inscriptionsOpen} onClose={closeInscriptionsModal} size="2xl">
        <Modal.Header>
          Inscripciones {selectedProject ? `- ${selectedProject.titulo}` : ""}
        </Modal.Header>
        <Modal.Body className="space-y-4">
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
                <Table.Head className="bg-bg-soft text-xs uppercase text-text-secondary">
                  <Table.HeadCell>Nombre</Table.HeadCell>
                  <Table.HeadCell>Correo</Table.HeadCell>
                  <Table.HeadCell>Estado</Table.HeadCell>
                  <Table.HeadCell>Tipo</Table.HeadCell>
                  <Table.HeadCell>Fecha</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {inscriptions.map((item) => (
                    <Table.Row key={item.id} className="bg-white text-sm">
                      <Table.Cell className="font-semibold text-text-primary">
                        {item.usuarioNombre}
                      </Table.Cell>
                      <Table.Cell className="text-text-secondary">{item.usuarioCorreo}</Table.Cell>
                      <Table.Cell className="text-text-secondary">{item.estado}</Table.Cell>
                      <Table.Cell className="text-text-secondary">{item.tipo}</Table.Cell>
                      <Table.Cell className="text-text-secondary">
                        {item.fechaRegistro ? formatDate(item.fechaRegistro) : "-"}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="flex flex-col gap-3 border-t border-border-subtle px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-text-secondary">
            Mostrando {inscriptions.length} de {inscriptionsTotal} · Página {inscriptionsPage} de {inscriptionsTotalPages}
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
