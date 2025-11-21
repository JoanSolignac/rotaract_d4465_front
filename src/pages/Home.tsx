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
    <div className="relative min-h-screen overflow-hidden text-text-primary">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 aurora-grid" />
        <div className="liquid-blob -left-10 top-10 h-64 w-64 rounded-full bg-primary/25" />
        <div className="liquid-blob right-10 top-20 h-72 w-72 rounded-full bg-accent/24" />
        <div className="liquid-blob left-1/3 bottom-[-5rem] h-80 w-80 rounded-full bg-secondary/18" />
      </div>

      <header className="relative mx-auto mt-6 flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-4 shadow-floating backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-[#ff4fa5] to-accent text-white shadow-soft ring-2 ring-white/10">
            <img src={logo} alt="Rotaract D4465" className="h-7 w-7 drop-shadow" />
            <span className="halo-ring" />
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
        <section className="grid items-start gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="glass-card relative overflow-hidden p-10">
            <div className="absolute inset-0 grid-lines opacity-60" />
            <div className="absolute -left-10 -top-16 h-56 w-56 rounded-full bg-primary/25 blur-3xl" />
            <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
            <div className="relative space-y-8">
              <div className="flex flex-wrap items-center gap-3">
                <div className="badge-chip shadow-strong">
                  <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-primary to-accent" />
                  Rotaract 2025 · Liquid glass
                </div>
                <div className="glass-chip">UI reinventada</div>
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-bold leading-tight text-white md:text-5xl">
                  Ecosistema Rotaract con estética líquida, audaz y funcional
                </h2>
                <p className="max-w-2xl text-lg text-text-secondary">
                  Navega por clubes, proyectos y convocatorias desde un hub oscuro con reflejos magenta-dorado, vidrio reactivo y accesos listos para tu rol.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to={ctaHref}>
                  <Button className="px-6 py-3 text-base shadow-strong">{ctaLabel}</Button>
                </Link>
                <Link to="/dashboard/proyectos">
                  <Button variant="secondary" className="px-6 py-3 text-base">
                    Proyectos en vivo
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button variant="ghost" className="px-6 py-3 text-base">
                    Crear cuenta
                  </Button>
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {["Clubes activos", "Impacto anual", "Convocatorias"].map((label, idx) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-soft backdrop-blur-xl"
                  >
                    <p className="text-[12px] font-semibold uppercase tracking-wide text-text-muted">{label}</p>
                    <p className="text-3xl font-bold text-primary">
                      {idx === 0 ? "25+" : idx === 1 ? "18%" : "12"}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {idx === 0 && "Mapea cada sede y conéctate en segundos."}
                      {idx === 1 && "Crecimiento interanual del distrito."}
                      {idx === 2 && "Aplicaciones ágiles y seguimiento."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <Card
              title="Accesos líquidos"
              description="Pulsa y navega directo a los endpoints esenciales del distrito."
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
                description="Las próximas acciones que mueven el distrito."
                className="glass-card"
              >
                <div className="space-y-3 text-sm text-text-secondary">
                  <div className="timeline-item">
                    <span className="timeline-dot bg-primary" />
                    <div>
                      <p className="font-semibold text-text-primary">Sesión informativa mensual</p>
                      <p>Resultados y nuevos retos compartidos con la comunidad.</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <span className="timeline-dot bg-secondary" />
                    <div>
                      <p className="font-semibold text-text-primary">Voluntariado ambiental</p>
                      <p>Acción climática y alianzas regionales coordinadas.</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <span className="timeline-dot bg-accent" />
                    <div>
                      <p className="font-semibold text-text-primary">Taller de liderazgo</p>
                      <p>Mentorías hands-on para presidentes y equipos.</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card
                title="Pulso del distrito"
                description="Indicadores dinámicos en una sola vista."
                className="bg-gradient-to-br from-[#140e24]/90 via-[#0f091b]/95 to-[#0a0715]/95"
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

        <section className="grid gap-4 lg:grid-cols-3">
          <Card
            title="Mapa de clubes"
            description="Conecta con cada ciudad y coordina en tiempo récord."
            className="frosted-panel"
          >
            <div className="grid grid-cols-2 gap-3 text-sm text-text-secondary">
              {"Lima Cusco Arequipa Trujillo Piura Chiclayo".split(" ").map((city) => (
                <span
                  key={city}
                  className="rounded-xl bg-white/5 px-3 py-2 text-text-primary shadow-soft ring-1 ring-border-subtle/60"
                >
                  {city}
                </span>
              ))}
            </div>
          </Card>
          <Card
            title="Experiencia 2025"
            description="Microinteracciones, accesibilidad y color story Rotaract."
            className="frosted-panel"
          >
            <ul className="space-y-3 text-sm text-text-secondary">
              <li>• Gradientes oscuros con destellos magenta y dorado.</li>
              <li>• Tarjetas con vidrio líquido y brillos holográficos.</li>
              <li>• Botones con glow y contrastes para acciones clave.</li>
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
        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-center shadow-floating backdrop-blur md:flex-row md:items-center md:justify-between md:text-left">
          <p className="font-semibold text-text-primary">Rotaract Distrito 4465</p>
          <p>© {new Date().getFullYear()}. Comunidad audaz con propósito.</p>
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
