import { useCallback, useEffect, useMemo, useState } from "react";
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
  fetchClubConvocatorias,
  fetchConvocatoriaInscripciones,
  createConvocatoria,
  updateConvocatoria,
  aceptarInscripcion,
  rechazarInscripcion,
  type Convocatoria,
  type CreateConvocatoriaPayload,
  type ConvocatoriaInscripcion,
} from "../../api/convocatorias";

const ACCEPTED_STATES = new Set(["APROBADO", "APROBADA", "ACEPTADO", "ACEPTADA"]);

const createDefaultConvocatoriaValues = (): CreateConvocatoriaPayload => {
  const today = new Date().toISOString().substring(0, 10);
  return {
    titulo: "",
    descripcion: "",
    requisitos: "",
    cupoMaximo: 20,
    fechaPublicacion: today,
    fechaInicioPostulacion: today,
    fechaFinPostulacion: today,
    fechaCierre: today,
  };
};

export const PresidenteConvocatorias = () => {
  const { user } = useAuth();
  const name = user?.nombre ?? user?.correo ?? "Presidente";

  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingConvocatoria, setEditingConvocatoria] = useState<Convocatoria | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [inscriptionsOpen, setInscriptionsOpen] = useState(false);
  const [selectedConvocatoria, setSelectedConvocatoria] = useState<Convocatoria | null>(null);
  const [inscripciones, setInscripciones] = useState<ConvocatoriaInscripcion[]>([]);
  const [inscripcionesPage, setInscripcionesPage] = useState(1);
  const [inscripcionesPageSize, setInscripcionesPageSize] = useState(5);
  const [inscripcionesTotalPages, setInscripcionesTotalPages] = useState(1);
  const [inscripcionesLoading, setInscripcionesLoading] = useState(false);
  const [inscripcionesError, setInscripcionesError] = useState<string | null>(null);
  const [inscripcionActionId, setInscripcionActionId] = useState<number | null>(null);
  const [inscripcionSearch, setInscripcionSearch] = useState("");
  const [inscripcionStatusFilter, setInscripcionStatusFilter] = useState<
    "TODAS" | "PENDIENTE" | "ACEPTADA"
  >("TODAS");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateConvocatoriaPayload>({
    defaultValues: createDefaultConvocatoriaValues(),
  });

  const loadConvocatorias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchClubConvocatorias({
        page: page - 1,
        size: pageSize,
      });
      setConvocatorias(response.items);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.total);
      if (response.page + 1 !== page) {
        setPage(response.page + 1);
      }
    } catch (err) {
      console.error("No se pudieron obtener las convocatorias", err);
      setError("Ocurrió un error al cargar tus convocatorias.");
      setConvocatorias([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    loadConvocatorias();
  }, [loadConvocatorias]);

  const paginationLabel = useMemo(() => {
    const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, totalItems);
    return `Mostrando ${start}-${end} de ${totalItems}`;
  }, [page, pageSize, totalItems]);

  const openCreateModal = () => {
    setFormError(null);
    setModalMode("create");
    setEditingConvocatoria(null);
    reset(createDefaultConvocatoriaValues());
    setIsModalOpen(true);
  };

  const openEditModal = (convocatoria: Convocatoria) => {
    setFormError(null);
    setModalMode("edit");
    setEditingConvocatoria(convocatoria);
    reset({
      titulo: convocatoria.titulo,
      descripcion: convocatoria.descripcion,
      requisitos: convocatoria.requisitos,
      cupoMaximo: convocatoria.cupoMaximo,
      fechaPublicacion: convocatoria.fechaPublicacion?.substring(0, 10) ?? "",
      fechaInicioPostulacion: convocatoria.fechaInicioPostulacion.substring(0, 10),
      fechaFinPostulacion: convocatoria.fechaFinPostulacion.substring(0, 10),
      fechaCierre: convocatoria.fechaCierre.substring(0, 10),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMode("create");
    setEditingConvocatoria(null);
    reset(createDefaultConvocatoriaValues());
    setFormError(null);
  };

  const onSubmit = async (values: CreateConvocatoriaPayload) => {
    try {
      setFormError(null);
      if (modalMode === "create") {
        await createConvocatoria({
          ...values,
          cupoMaximo: Number(values.cupoMaximo),
        });
        closeModal();
        setPage(1);
        loadConvocatorias();
        return;
      }

      if (!editingConvocatoria) return;
      const confirmation = await Swal.fire({
        title: "Actualizar convocatoria",
        text: "¿Deseas guardar los cambios de esta convocatoria?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, guardar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#1ea896",
      });
      if (!confirmation.isConfirmed) return;

      await updateConvocatoria(editingConvocatoria.id, {
        titulo: values.titulo,
        descripcion: values.descripcion,
        requisitos: values.requisitos,
        cupoMaximo: Number(values.cupoMaximo),
        fechaInicioPostulacion: values.fechaInicioPostulacion,
        fechaFinPostulacion: values.fechaFinPostulacion,
        fechaCierre: values.fechaCierre,
      });
      closeModal();
      await Swal.fire({
        title: "Convocatoria actualizada",
        text: "Los cambios se guardaron correctamente.",
        icon: "success",
        confirmButtonColor: "#1ea896",
      });
      loadConvocatorias();
    } catch (err) {
      console.error("Error guardando convocatoria", err);
      setFormError("No pudimos guardar la convocatoria. Intenta nuevamente.");
      await Swal.fire({
        title: "Error",
        text: "No pudimos guardar la convocatoria. Intenta nuevamente.",
        icon: "error",
        confirmButtonColor: "#1ea896",
      });
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const openInscripcionesModal = (convocatoria: Convocatoria) => {
    setSelectedConvocatoria(convocatoria);
    setInscripcionesPage(1);
    setInscripcionesError(null);
    setInscriptionsOpen(true);
  };

  const closeInscripcionesModal = () => {
    setSelectedConvocatoria(null);
    setInscriptionsOpen(false);
    setInscripciones([]);
    setInscripcionesError(null);
  };

  const handleInscripcionAction = async (
    inscripcion: ConvocatoriaInscripcion,
    action: "aceptar" | "rechazar",
  ) => {
    if (!selectedConvocatoria) return;
    const confirm = await Swal.fire({
      title: action === "aceptar" ? "Aceptar postulación" : "Rechazar postulación",
      text:
        action === "aceptar"
          ? `¿Deseas aceptar a ${inscripcion.usuarioNombre}?`
          : `¿Deseas rechazar a ${inscripcion.usuarioNombre}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: action === "aceptar" ? "Sí, aceptar" : "Sí, rechazar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: action === "aceptar" ? "#1ea896" : "#f87171",
    });
    if (!confirm.isConfirmed) return;

    setInscripcionActionId(inscripcion.id);
    try {
      if (action === "aceptar") {
        await aceptarInscripcion(selectedConvocatoria.id, inscripcion.id);
      } else {
        await rechazarInscripcion(selectedConvocatoria.id, inscripcion.id);
      }

      await Swal.fire({
        title:
          action === "aceptar"
            ? "Postulación aceptada"
            : "Postulación rechazada",
        icon: "success",
        confirmButtonColor: "#1ea896",
      });
      loadInscripciones();
    } catch (err) {
      console.error("No se pudo actualizar la inscripción", err);
      await Swal.fire({
        title: "Error",
        text: "No pudimos completar la acción. Intenta nuevamente.",
        icon: "error",
        confirmButtonColor: "#1ea896",
      });
    } finally {
      setInscripcionActionId(null);
    }
  };

  const loadInscripciones = useCallback(async () => {
    if (!inscriptionsOpen || !selectedConvocatoria) return;
    setInscripcionesLoading(true);
    setInscripcionesError(null);
    try {
      const result = await fetchConvocatoriaInscripciones(selectedConvocatoria.id, {
        page: inscripcionesPage - 1,
        size: inscripcionesPageSize,
      });
      setInscripciones(result.items);
      setInscripcionesTotalPages(result.totalPages);
      const serverPage = result.page + 1;
      if (serverPage !== inscripcionesPage) {
        setInscripcionesPage(serverPage);
      }
    } catch (err) {
      console.error("No se pudieron obtener las inscripciones", err);
      setInscripciones([]);
      setInscripcionesTotalPages(1);
      setInscripcionesError("Ocurrió un error al cargar las inscripciones.");
    } finally {
      setInscripcionesLoading(false);
    }
  }, [inscripcionesPage, inscripcionesPageSize, inscriptionsOpen, selectedConvocatoria]);

  useEffect(() => {
    loadInscripciones();
  }, [loadInscripciones]);

  const filteredInscripciones = useMemo(() => {
    const search = inscripcionSearch.trim().toLowerCase();
    return inscripciones.filter((item) => {
      const matchesSearch =
        !search ||
        item.usuarioNombre.toLowerCase().includes(search) ||
        item.usuarioCorreo.toLowerCase().includes(search);
      const normalizedStatus = (item.estado ?? "").toUpperCase();
      const matchesStatus =
        inscripcionStatusFilter === "TODAS" ||
        (inscripcionStatusFilter === "PENDIENTE" && normalizedStatus === "PENDIENTE") ||
        (inscripcionStatusFilter === "ACEPTADA" && ACCEPTED_STATES.has(normalizedStatus));
      return matchesSearch && matchesStatus;
    });
  }, [inscripciones, inscripcionSearch, inscripcionStatusFilter]);

  return (
    <div className="space-y-6">
      <WelcomePanel
        greeting={`Bienvenido, ${name}`}
        roleLabel="Presidente del club"
        description="Administra convocatorias, consulta estados y lanza nuevas oportunidades para tu club."
        hint="Cuando vinculemos la API verás aquí las métricas en tiempo real."
      />

      <section
        id="convocatorias"
        className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-border-subtle"
      >
        <header className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              Convocatorias del club
            </h2>
            <p className="text-sm text-text-secondary">
              Consulta tus convocatorias vigentes y organiza las próximas publicadas.
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
            <Button color="light" onClick={loadConvocatorias}>
              Refrescar
            </Button>
            <Button
              color="light"
              className="bg-primary px-5 text-white hover:!bg-primary-dark focus:!ring-primary/40"
              onClick={openCreateModal}
            >
              Crear convocatoria
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
            Cargando convocatorias...
          </div>
        ) : convocatorias.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-subtle p-10 text-center">
            <h3 className="text-lg font-semibold text-text-primary">
              No tienes convocatorias registradas
            </h3>
            <p className="text-sm text-text-secondary">
              Crea una nueva para invitar a interesados desde tu club.
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
                  {convocatorias.map((convocatoria) => (
                    <Table.Row key={convocatoria.id} className="bg-white text-sm">
                      <Table.Cell className="font-semibold text-text-primary">
                        {convocatoria.titulo}
                        <div className="text-xs text-text-secondary">
                          {convocatoria.descripcion}
                        </div>
                        <div className="mt-1 text-xs text-text-secondary">
                          <span className="font-semibold text-text-primary">Requisitos:</span>{" "}
                          {convocatoria.requisitos || "Sin requisitos definidos"}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge color={convocatoria.estado === "Activa" ? "success" : "gray"}>
                          {convocatoria.estado}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>{formatDate(convocatoria.fechaInicioPostulacion)}</Table.Cell>
                      <Table.Cell>{formatDate(convocatoria.fechaCierre)}</Table.Cell>
                      <Table.Cell>{convocatoria.cupoMaximo}</Table.Cell>
                      <Table.Cell className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            color="light"
                            className="rounded-base bg-primary px-3 py-1 text-xs font-semibold text-white transition hover:!bg-primary-dark focus:!ring-primary/40"
                            onClick={() => openInscripcionesModal(convocatoria)}
                          >
                            Ver inscripciones
                          </Button>
                          <Button
                            color="light"
                            className="rounded-base px-3 py-1 text-xs font-semibold text-white transition hover:!bg-secondary-dark focus:!ring-secondary/40"
                            style={{ backgroundColor: "var(--secondary)" }}
                            onClick={() => openEditModal(convocatoria)}
                          >
                            Editar convocatoria
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

      <Modal show={isModalOpen} onClose={closeModal} size="xl">
        <Modal.Header>
          {modalMode === "create" ? "Nueva convocatoria" : "Editar convocatoria"}
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-text-primary">Título</label>
                <TextInput
                  {...register("titulo", { required: "El título es obligatorio" })}
                  color={errors.titulo ? "failure" : "gray"}
                  helperText={errors.titulo?.message}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-text-primary">Cupo máximo</label>
                <TextInput
                  type="number"
                  min={1}
                  {...register("cupoMaximo", {
                    valueAsNumber: true,
                    required: "Ingresa el cupo máximo",
                    min: { value: 1, message: "Debe ser mayor a 0" },
                  })}
                  color={errors.cupoMaximo ? "failure" : "gray"}
                  helperText={errors.cupoMaximo?.message}
                />
              </div>
            </div>
            <div>
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
            <div>
              <label className="text-sm font-semibold text-text-primary">Requisitos</label>
              <Textarea
                rows={3}
                {...register("requisitos", { required: "Describe los requisitos" })}
                color={errors.requisitos ? "failure" : "gray"}
                helperText={errors.requisitos?.message}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { name: "fechaPublicacion", label: "Fecha de publicación", disableOnEdit: true },
                { name: "fechaCierre", label: "Fecha de cierre" },
                { name: "fechaInicioPostulacion", label: "Inicio de postulación" },
                { name: "fechaFinPostulacion", label: "Fin de postulación" },
              ].map(({ name, label, disableOnEdit }) => {
                const key = name as keyof CreateConvocatoriaPayload;
                const fieldError = errors[key];
                return (
                  <div key={name}>
                    <label className="text-sm font-semibold text-text-primary">
                      {label}
                    </label>
                    <TextInput
                      type="date"
                      {...register(key, { required: "Selecciona una fecha" })}
                      disabled={Boolean(disableOnEdit && modalMode === "edit")}
                      color={fieldError ? "failure" : "gray"}
                      helperText={fieldError?.message}
                    />
                  </div>
                );
              })}
            </div>
            {formError && (
              <Alert color="failure" onDismiss={() => setFormError(null)}>
                {formError}
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer className="flex justify-end gap-2 border-t border-border-subtle">
            <Button color="light" onClick={closeModal} disabled={isSubmitting}>
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

      <Modal show={inscriptionsOpen} onClose={closeInscripcionesModal} size="6xl">
        <Modal.Header>
          Inscripciones - {selectedConvocatoria?.titulo ?? "Convocatoria"}
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex w-full flex-col gap-1">
              <label className="text-sm font-semibold text-text-primary">
                Buscar por nombre o correo
              </label>
              <TextInput
                placeholder="Ej: Ana Perez"
                value={inscripcionSearch}
                onChange={(event) => setInscripcionSearch(event.target.value)}
              />
            </div>
            <div className="flex w-full flex-col gap-1 md:max-w-xs">
              <label className="text-sm font-semibold text-text-primary">Estado</label>
              <Select
                value={inscripcionStatusFilter}
                onChange={(event) =>
                  setInscripcionStatusFilter(event.target.value as typeof inscripcionStatusFilter)
                }
              >
                <option value="TODAS">Todas</option>
                <option value="PENDIENTE">Pendientes</option>
                <option value="ACEPTADA">Aceptadas</option>
              </Select>
            </div>
          </div>
          {inscripcionesError && (
            <Alert color="failure" className="mb-3">
              {inscripcionesError}
            </Alert>
          )}
          {inscripcionesLoading ? (
            <div className="flex flex-col items-center gap-2 py-10 text-sm text-text-secondary">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
              Cargando inscripciones...
            </div>
          ) : filteredInscripciones.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border-subtle p-8 text-center text-sm text-text-secondary">
              No hay inscripciones registradas.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-2xl border border-border-subtle">
                <Table>
                  <Table.Head className="bg-bg-soft text-xs uppercase text-text-secondary">
                    <Table.HeadCell>Nombre</Table.HeadCell>
                    <Table.HeadCell>Correo</Table.HeadCell>
                    <Table.HeadCell>Tipo</Table.HeadCell>
                    <Table.HeadCell>Estado</Table.HeadCell>
                    <Table.HeadCell>Fecha registro</Table.HeadCell>
                    <Table.HeadCell>Acciones</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {filteredInscripciones.map((inscripcion) => {
                      const normalizedStatus = (inscripcion.estado ?? "").toUpperCase();
                      const isAccepted = ACCEPTED_STATES.has(normalizedStatus);
                      const isPending = normalizedStatus === "PENDIENTE";
                      const canAccept = isPending;
                      const canReject = isAccepted;
                      const badgeColor = isAccepted ? "success" : isPending ? "warning" : "gray";
                      return (
                        <Table.Row key={inscripcion.id} className="bg-white text-sm">
                          <Table.Cell className="font-semibold text-text-primary">
                            {inscripcion.usuarioNombre}
                          </Table.Cell>
                          <Table.Cell>{inscripcion.usuarioCorreo}</Table.Cell>
                          <Table.Cell>{inscripcion.tipo}</Table.Cell>
                          <Table.Cell>
                            <Badge
                              color={badgeColor}
                              className={
                                isAccepted
                                  ? "bg-green-100 text-green-800 border border-green-200"
                                  : undefined
                              }
                            >
                              {inscripcion.estado}
                            </Badge>
                          </Table.Cell>
                          <Table.Cell>{formatDate(inscripcion.fechaRegistro)}</Table.Cell>
                          <Table.Cell>
                          <div className="flex flex-wrap gap-2">
                              {canAccept && (
                                <Button
                                  color="light"
                                  size="xs"
                                  disabled={inscripcionActionId === inscripcion.id}
                                  className="rounded-base bg-primary px-3 py-1 text-xs font-semibold text-white hover:!bg-primary-dark focus:!ring-primary/40 disabled:bg-border-subtle"
                                  onClick={() => handleInscripcionAction(inscripcion, "aceptar")}
                                >
                                  {inscripcionActionId === inscripcion.id
                                    ? "Procesando..."
                                    : "Aceptar"}
                                </Button>
                              )}
                              {canReject && (
                                <Button
                                  color="light"
                                  size="xs"
                                  disabled={inscripcionActionId === inscripcion.id}
                                  className="rounded-base bg-red-500 px-3 py-1 text-xs font-semibold text-white hover:!bg-red-600 focus:!ring-red-300 disabled:bg-red-300"
                                  onClick={() => handleInscripcionAction(inscripcion, "rechazar")}
                                >
                                  {inscripcionActionId === inscripcion.id
                                    ? "Procesando..."
                                    : "Rechazar"}
                                </Button>
                              )}
                              {!canAccept && !canReject && (
                                <span className="text-xs text-text-secondary">Sin acciones</span>
                              )}
                            </div>
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table>
              </div>
              <div className="mt-4 flex flex-col gap-3 text-sm text-text-secondary md:flex-row md:items-center md:justify-between">
                <p>
                  Mostrando {filteredInscripciones.length} de {inscripciones.length}
                </p>
                <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                  <Select
                    value={String(inscripcionesPageSize)}
                    onChange={(event) => {
                      setInscripcionesPageSize(Number(event.target.value));
                      setInscripcionesPage(1);
                    }}
                    className="sm:w-32"
                  >
                    {[5, 10, 15].map((option) => (
                      <option key={option} value={option}>
                        {option} / pág
                      </option>
                    ))}
                  </Select>
                  <Pagination
                    currentPage={inscripcionesPage}
                    totalPages={inscripcionesTotalPages}
                    onPageChange={(value) => setInscripcionesPage(value)}
                    showIcons
                  />
                </div>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-t border-border-subtle">
          <Button color="light" onClick={closeInscripcionesModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
