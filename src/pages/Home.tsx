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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fff5fb] via-[#fff1f8] to-[#fff8fd]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <header className="relative mx-auto mt-6 flex max-w-6xl items-center justify-between rounded-2xl border border-border-subtle bg-white/80 px-4 py-4 shadow-soft backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[#e13b7a] shadow-soft">
            <img src={logo} alt="Rotaract D4465" className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-primary">Rotaract</p>
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

      <main className="relative mx-auto max-w-6xl px-4 py-12">
        <section className="grid gap-8 md:grid-cols-[1.2fr,0.8fr]">
          <div className="glass-card relative overflow-hidden p-10">
            <div className="absolute -right-10 top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -left-10 bottom-6 h-32 w-32 rounded-full bg-secondary/20 blur-3xl" />
            <div className="relative space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-xs font-semibold text-primary shadow-sm">
                <span className="h-2 w-2 rounded-full bg-primary" /> Comunidad vibrante
              </div>
              <h2 className="text-4xl font-bold leading-tight text-text-primary">
                Impulsa el impacto Rotaract con una experiencia digital moderna
              </h2>
              <p className="max-w-2xl text-lg text-text-secondary">
                Visualiza proyectos, clubes y eventos con una interfaz energizada por la paleta Rotaract. Usa los accesos directos para
                entrar a tus módulos y gestiona tus iniciativas con estilo contemporáneo.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to={ctaHref}>
                  <Button className="px-6 py-3 text-base">{ctaLabel}</Button>
                </Link>
                <Link to="/auth/register">
                  <Button variant="ghost" className="px-6 py-3 text-base">
                    Crear cuenta
                  </Button>
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-border-subtle bg-white/70 p-4 shadow-soft">
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Clubes activos</p>
                  <p className="text-3xl font-bold text-primary">25+</p>
                  <p className="text-sm text-text-secondary">Conecta con cada sede del distrito.</p>
                </div>
                <div className="rounded-2xl border border-border-subtle bg-white/70 p-4 shadow-soft">
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Proyectos</p>
                  <p className="text-3xl font-bold text-primary">48</p>
                  <p className="text-sm text-text-secondary">Seguimiento en tiempo real y reportes.</p>
                </div>
                <div className="rounded-2xl border border-border-subtle bg-white/70 p-4 shadow-soft">
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Convocatorias</p>
                  <p className="text-3xl font-bold text-primary">12</p>
                  <p className="text-sm text-text-secondary">Aplica y únete a nuevas iniciativas.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <Card
              title="Accesos rápidos"
              description="Usa los botones para ingresar a tus endpoints preferidos."
              className="border-primary/10"
            >
              <div className="flex flex-col gap-3">
                <Link to="/auth/login">
                  <Button fullWidth>Portal de ingreso</Button>
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

            <Card title="Próximos eventos" description="Participa y conecta con la comunidad.">
              <div className="space-y-3 text-sm text-text-secondary">
                <div className="flex items-start gap-3 rounded-xl bg-bg-soft p-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                  <div>
                    <p className="font-semibold text-text-primary">Sesión informativa mensual</p>
                    <p>Comparte logros de proyectos y nuevas oportunidades.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl bg-bg-soft p-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-secondary" />
                  <div>
                    <p className="font-semibold text-text-primary">Voluntariado ambiental</p>
                    <p>Acción climática en alianza con clubes del distrito.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl bg-bg-soft p-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent" />
                  <div>
                    <p className="font-semibold text-text-primary">Taller de liderazgo</p>
                    <p>Mentorías y formación para equipos Rotaract.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <Card
            title="Clubes y contactos"
            description="Consulta sedes, horarios y puntos de comunicación."
            className="bg-white/80"
          >
            <div className="grid grid-cols-2 gap-3 text-sm text-text-secondary">
              <span className="rounded-xl bg-bg-soft px-3 py-2">Lima</span>
              <span className="rounded-xl bg-bg-soft px-3 py-2">Cusco</span>
              <span className="rounded-xl bg-bg-soft px-3 py-2">Arequipa</span>
              <span className="rounded-xl bg-bg-soft px-3 py-2">Trujillo</span>
            </div>
          </Card>
          <Card
            title="Experiencia amigable"
            description="Material Design, accesibilidad y microinteracciones para navegar sin esfuerzo."
            className="bg-white/80"
          >
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>• Cards con sombras suaves y superficies translúcidas.</li>
              <li>• Tipografía clara con jerarquías y colores de alto contraste.</li>
              <li>• CTA consistentes alineados a la paleta Rotaract.</li>
            </ul>
          </Card>
          <Card
            title="Listo para tu rol"
            description="Ingresa según tu perfil y continúa donde lo dejaste."
            className="bg-white/80"
          >
            <div className="space-y-3 text-sm text-text-secondary">
              <p>Interesados, socios, presidentes y representantes distritales cuentan con rutas dedicadas.</p>
              <Link to={ctaHref}>
                <Button fullWidth>{ctaLabel}</Button>
              </Link>
            </div>
          </Card>
        </section>
      </main>

      <footer className="relative mx-auto max-w-6xl px-4 pb-10 pt-4 text-sm text-text-secondary">
        <div className="flex flex-col gap-2 rounded-2xl border border-border-subtle bg-white/80 p-4 text-center shadow-soft md:flex-row md:items-center md:justify-between md:text-left">
          <p className="font-semibold text-text-primary">Rotaract Distrito 4465</p>
          <p>© {new Date().getFullYear()}. Construimos comunidad con propósito.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
