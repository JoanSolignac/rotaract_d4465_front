import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import logo from "../assets/logo.svg";
import { useAuth } from "../hooks/useAuth";
import { roleRouteMap } from "../types/auth";

export const Home = () => {
  const { role } = useAuth();
  const ctaHref = role ? roleRouteMap[role] : "/auth/login";
  const ctaLabel = role ? "Ir a mi panel" : "Iniciar sesión";

  return (
    <div className="relative min-h-screen overflow-hidden bg-ambient">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute -left-10 top-10 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-1/3 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute -right-10 top-32 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <header className="relative mx-auto mt-6 flex max-w-6xl items-center justify-between rounded-full border border-border-subtle/60 bg-white/80 px-5 py-4 shadow-floating backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-[#e13b7a] to-[#f35c8e] text-white shadow-soft">
            <img src={logo} alt="Rotaract D4465" className="h-7 w-7" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.5em] text-text-muted">Rotaract</p>
            <h1 className="text-xl font-semibold text-text-primary">Distrito 4465</h1>
          </div>
        </div>
        <nav className="flex items-center gap-2">
          <Link to="/auth/register">
            <Button variant="ghost" className="px-4 py-2 text-sm font-semibold">
              Registro
            </Button>
          </Link>
          <Link to="/auth/login">
            <Button className="px-4 py-2 text-sm font-semibold">Ingresar</Button>
          </Link>
        </nav>
      </header>

      <main className="relative mx-auto max-w-6xl space-y-12 px-4 py-12">
        <section className="grid items-stretch gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-gradient-to-br from-white/90 via-[#fff7fb]/90 to-[#fff1f6]/90 p-10 shadow-floating backdrop-blur-xl">
            <div className="absolute -left-6 -top-8 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
            <div className="absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-secondary/20 blur-3xl" />
            <div className="relative space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary shadow-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-primary to-secondary" />
                Nueva era digital Rotaract
              </div>
              <h2 className="text-4xl font-bold leading-tight text-text-primary md:text-5xl">
                Conecta, lidera y celebra la comunidad del Distrito 4465
              </h2>
              <p className="max-w-2xl text-lg text-text-secondary">
                Explora tus clubes, proyectos y convocatorias con un entorno luminoso inspirado en la paleta Rotaract. Accede rápido a tus rutas y mantén tus metas visibles en cada sesión.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to={ctaHref}>
                  <Button className="px-6 py-3 text-base shadow-strong">{ctaLabel}</Button>
                </Link>
                <Link to="/auth/register">
                  <Button variant="ghost" className="px-6 py-3 text-base">
                    Crear cuenta
                  </Button>
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {["Clubes activos", "Proyectos en curso", "Convocatorias"].map((label, idx) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-border-subtle/70 bg-white/80 p-4 shadow-soft backdrop-blur"
                  >
                    <p className="text-[12px] font-semibold uppercase tracking-wide text-text-muted">{label}</p>
                    <p className="text-3xl font-bold text-primary">
                      {idx === 0 ? "25+" : idx === 1 ? "48" : "12"}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {idx === 0 && "Conecta con cada sede del distrito."}
                      {idx === 1 && "Seguimiento en tiempo real y reportes."}
                      {idx === 2 && "Aplica y únete a nuevas iniciativas."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <Card
              title="Accesos rápidos"
              description="Usa los botones para ingresar a tus endpoints preferidos."
              className="accent-card"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Link to="/auth/login" className="sm:col-span-2">
                  <Button fullWidth className="shadow-strong">
                    Portal de ingreso
                  </Button>
                </Link>
                <Link to="/dashboard/proyectos">
                  <Button variant="secondary" fullWidth>
                    Proyectos y reportes
                  </Button>
                </Link>
                <Link to="/dashboard/convocatorias">
                  <Button variant="ghost" fullWidth>
                    Convocatorias y voluntariado
                  </Button>
                </Link>
              </div>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card
                title="Agenda inmediata"
                description="Mantén tu equipo alineado con las siguientes fechas."
                className="bg-white/90"
              >
                <div className="space-y-3 text-sm text-text-secondary">
                  <div className="timeline-item">
                    <span className="timeline-dot bg-primary" />
                    <div>
                      <p className="font-semibold text-text-primary">Sesión informativa mensual</p>
                      <p>Compartir logros de proyectos y nuevas oportunidades.</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <span className="timeline-dot bg-secondary" />
                    <div>
                      <p className="font-semibold text-text-primary">Voluntariado ambiental</p>
                      <p>Acción climática en alianza con clubes del distrito.</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <span className="timeline-dot bg-accent" />
                    <div>
                      <p className="font-semibold text-text-primary">Taller de liderazgo</p>
                      <p>Mentorías y formación para equipos Rotaract.</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card
                title="Tablero instantáneo"
                description="Visualiza el pulso del distrito en una mirada."
                className="bg-gradient-to-br from-[#fff4f9] via-white to-[#fdf6ff]"
              >
                <div className="grid grid-cols-2 gap-3 text-sm text-text-secondary">
                  <div className="stat-pill">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Impacto</p>
                    <p className="text-2xl font-bold text-primary">+18%</p>
                    <p>Participación interanual</p>
                  </div>
                  <div className="stat-pill">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Mentorías</p>
                    <p className="text-2xl font-bold text-primary">36</p>
                    <p>Sesiones agendadas</p>
                  </div>
                  <div className="stat-pill">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Alianzas</p>
                    <p className="text-2xl font-bold text-primary">14</p>
                    <p>ONG y empresas</p>
                  </div>
                  <div className="stat-pill">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Seguimientos</p>
                    <p className="text-2xl font-bold text-primary">92%</p>
                    <p>Reportes al día</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card
            title="Clubes y contactos"
            description="Consulta sedes, horarios y puntos de comunicación."
            className="frosted-panel"
          >
            <div className="grid grid-cols-2 gap-3 text-sm text-text-secondary">
              {"Lima Cusco Arequipa Trujillo Piura Chiclayo".split(" ").map((city) => (
                <span
                  key={city}
                  className="rounded-xl bg-white/80 px-3 py-2 text-text-primary shadow-soft ring-1 ring-border-subtle/80"
                >
                  {city}
                </span>
              ))}
            </div>
          </Card>
          <Card
            title="Experiencia amigable"
            description="Accesibilidad, microinteracciones y jerarquías claras."
            className="frosted-panel"
          >
            <ul className="space-y-3 text-sm text-text-secondary">
              <li>• Gradientes suaves inspirados en la identidad Rotaract.</li>
              <li>• Cards luminosas con borde delineado y sombras flotantes.</li>
              <li>• Botones consistentes con énfasis en acciones clave.</li>
            </ul>
          </Card>
          <Card
            title="Listo para tu rol"
            description="Ingresa según tu perfil y continúa donde lo dejaste."
            className="frosted-panel"
          >
            <div className="space-y-3 text-sm text-text-secondary">
              <p>Interesados, socios, presidentes y representantes distritales cuentan con rutas dedicadas.</p>
              <Link to={ctaHref}>
                <Button fullWidth className="shadow-strong">{ctaLabel}</Button>
              </Link>
            </div>
          </Card>
        </section>
      </main>

      <footer className="relative mx-auto max-w-6xl px-4 pb-12 text-sm text-text-secondary">
        <div className="flex flex-col gap-3 rounded-2xl border border-border-subtle/60 bg-white/85 p-4 text-center shadow-floating backdrop-blur md:flex-row md:items-center md:justify-between md:text-left">
          <p className="font-semibold text-text-primary">Rotaract Distrito 4465</p>
          <p>© {new Date().getFullYear()}. Construimos comunidad con propósito.</p>
          <div className="flex items-center justify-center gap-2 text-text-muted">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="h-2 w-2 rounded-full bg-secondary" />
            <span className="h-2 w-2 rounded-full bg-accent" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
