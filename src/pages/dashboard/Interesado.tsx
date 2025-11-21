import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Pagination, Select, Spinner } from "flowbite-react";
import Swal from "sweetalert2";
import { useAuth } from "../../hooks/useAuth";
import { WelcomePanel } from "./components/WelcomePanel";
import {
  fetchPublicConvocatorias,
  inscribirseConvocatoria,
  type Convocatoria,
} from "../../api/convocatorias";
import { getApiErrorMessage } from "../../utils/apiErrorMessage";

export const Interesado = () => {
  const { user } = useAuth();
  const name = user?.nombre ?? user?.correo ?? "Interesado";
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyingId, setApplyingId] = useState<number | null>(null);

  const loadConvocatorias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchPublicConvocatorias({
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
      console.error("Error obteniendo convocatorias públicas", err);
      setError("No se pudieron cargar las convocatorias. Intenta nuevamente.");
      setConvocatorias([]);
      setTotalPages(1);
      setTotalItems(0);
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

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="space-y-6">
      <WelcomePanel
        greeting={`Bienvenido, ${name}`}
        roleLabel="Interesado"
        description="Explora convocatorias de clubes Rotaract del distrito y postula desde un solo lugar."
        hint="Pronto habilitaremos acciones para guardar y postular directamente."
      />
      <section className="glass-card relative overflow-hidden p-6 text-white">
        <div className="liquid-blob left-12 top-8 h-40 w-40 bg-rotaract-pink/35" />
        <div className="liquid-blob -right-10 -top-6 h-48 w-48 bg-amber-300/25" />
        <div className="relative">
          <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="glass-chip text-[0.65rem] text-rose-50">Convocatorias</p>
              <h2 className="mt-2 text-2xl font-bold leading-tight text-white drop-shadow-lg">
                Convocatorias disponibles
              </h2>
              <p className="text-sm text-rose-50/70">
                Descubre oportunidades activas en el distrito.
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
                className="w-28 bg-transparent text-sm text-white"
              >
                {[6, 9, 12].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </div>
          </header>

        {error && (
          <Alert color="failure" className="mb-4 border border-error/30 bg-error/10 text-sm text-error">
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="flex flex-col items-center gap-2 py-10">
            <Spinner size="xl" color="info" />
            <p className="text-sm text-rose-50/70">Cargando convocatorias...</p>
          </div>
        ) : convocatorias.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center">
            <h3 className="text-lg font-semibold text-white">
              No encontramos convocatorias activas
            </h3>
            <p className="text-sm text-rose-50/70">
              Vuelve más tarde para descubrir nuevas oportunidades en tu distrito.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {convocatorias.map((convocatoria) => (
                <Card
                  key={convocatoria.id}
                  className="glass-card flex h-full flex-col border-white/10 bg-white/5 text-white shadow-strong"
                >
                  <div className="flex items-center justify-between text-[0.7rem] font-semibold uppercase tracking-wide text-rose-50/70">
                    <span className="badge-chip px-3 py-1 text-[0.65rem]">{convocatoria.estado}</span>
                    <span className="text-rose-50/70">
                      Cierra {formatDate(convocatoria.fechaCierre)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white drop-shadow-sm">
                    {convocatoria.titulo}
                  </h3>
                  <p className="text-sm text-rose-50/75">{convocatoria.descripcion}</p>
                  <div className="mt-3 inline-flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold uppercase text-rose-50">
                    <span className="inline-block h-2 w-2 rounded-full bg-amber-300" />
                    {convocatoria.clubNombre}
                  </div>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4 text-sm text-rose-50/80">
                    <span>Cupo: {convocatoria.cupoMaximo}</span>
                    <div className="flex gap-2">
                      <Button color="light" size="xs" className="border border-white/15 bg-white/10 text-white hover:!bg-white/20">
                        Guardar
                      </Button>
                      <Button
                        color="light"
                        size="xs"
                        className="bg-gradient-to-r from-rotaract-pink to-purple-500 text-white shadow-strong transition hover:brightness-110 focus:!ring-primary/40 disabled:cursor-not-allowed disabled:bg-border-subtle disabled:text-text-secondary"
                        disabled={applyingId === convocatoria.id}
                        onClick={async () => {
                          setApplyingId(convocatoria.id);
                        try {
                          await inscribirseConvocatoria(convocatoria.id);
                          await Swal.fire({
                            title: "Postulación enviada",
                            text: "Tu interés ha sido registrado. Te contactaremos pronto.",
                              icon: "success",
                              confirmButtonColor: "#1ea896",
                            });
                        } catch (err) {
                          console.error("No se pudo inscribir a la convocatoria", err);
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
                        {applyingId === convocatoria.id ? "Postulando..." : "Postular"}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-3 text-sm text-rose-50/70 sm:flex-row sm:items-center sm:justify-between">
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
        </div>
      </section>
    </div>
  );
};
