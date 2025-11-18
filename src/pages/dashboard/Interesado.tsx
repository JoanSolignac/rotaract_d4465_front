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
      <section className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-border-subtle">
        <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              Convocatorias disponibles
            </h2>
            <p className="text-sm text-text-secondary">
              Descubre oportunidades activas en el distrito.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-text-secondary">
            <span>Por página</span>
            <Select
              value={String(pageSize)}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
              className="w-28"
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
          <Alert color="failure" className="mb-4">
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="flex flex-col items-center gap-2 py-10">
            <Spinner size="xl" color="info" />
            <p className="text-sm text-text-secondary">Cargando convocatorias...</p>
          </div>
        ) : convocatorias.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-subtle p-10 text-center">
            <h3 className="text-lg font-semibold text-text-primary">
              No encontramos convocatorias activas
            </h3>
            <p className="text-sm text-text-secondary">
              Vuelve más tarde para descubrir nuevas oportunidades en tu distrito.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {convocatorias.map((convocatoria) => (
                <Card
                  key={convocatoria.id}
                  className="flex h-full flex-col border border-border-subtle shadow-card"
                >
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-secondary">
                    <span>{convocatoria.estado}</span>
                    <span className="text-text-secondary">
                      Cierra {formatDate(convocatoria.fechaCierre)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">
                    {convocatoria.titulo}
                  </h3>
                  <p className="text-sm text-text-secondary">{convocatoria.descripcion}</p>
                  <div className="mt-3 rounded-2xl bg-bg-soft px-3 py-2 text-xs font-semibold uppercase text-text-secondary">
                    {convocatoria.clubNombre}
                  </div>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4 text-sm text-text-secondary">
                    <span>Cupo: {convocatoria.cupoMaximo}</span>
                    <div className="flex gap-2">
                      <Button color="light" size="xs">
                        Guardar
                      </Button>
                      <Button
                        color="light"
                        size="xs"
                        className="border border-primary bg-primary text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:border-border-subtle disabled:bg-border-subtle disabled:text-text-secondary"
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
                            await Swal.fire({
                              title: "Error",
                              text: "No pudimos registrar tu postulación. Intenta nuevamente.",
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
            <div className="mt-6 flex flex-col gap-3 text-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between">
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
