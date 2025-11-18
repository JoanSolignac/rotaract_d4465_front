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
    <div className="min-h-screen bg-gradient-to-br from-bg-soft via-bg-soft to-bg-surface">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Rotaract D4465" className="h-10 w-10" />
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-primary">Rotaract</p>
            <h1 className="text-lg font-semibold text-text-primary">Distrito 4465</h1>
          </div>
        </div>
        <nav className="flex items-center gap-3">
          <Link to="/auth/register" className="text-sm font-semibold text-text-primary">
            Registro
          </Link>
          <Link to="/auth/login" className="text-sm font-semibold text-text-primary">
            Ingresar
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="material-card p-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.4em] text-primary">Bienvenido</p>
              <h2 className="text-3xl font-semibold text-text-primary">
                Información del Club y Comunidad Rotaract
              </h2>
              <p className="text-text-secondary">
                Conoce nuestros clubes, proyectos en curso, próximos eventos y la forma en la que puedes participar. Este portal aplica Material Design e IHM para una experiencia clara y accesible.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to={ctaHref}>
                  <Button>{ctaLabel}</Button>
                </Link>
                <Link to="/auth/register">
                  <Button variant="ghost">Crear cuenta</Button>
                </Link>
              </div>
            </div>
            <div className="grid gap-4">
              <Card title="Clubes activos" description="Consulta sedes, horarios y puntos de contacto.">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-bg-soft p-4 text-sm text-text-secondary">Lima</div>
                  <div className="rounded-xl bg-bg-soft p-4 text-sm text-text-secondary">Cusco</div>
                  <div className="rounded-xl bg-bg-soft p-4 text-sm text-text-secondary">Arequipa</div>
                  <div className="rounded-xl bg-bg-soft p-4 text-sm text-text-secondary">Trujillo</div>
                </div>
              </Card>
              <Card title="Próximos eventos" description="Participa y conecta con la comunidad.">
                <ul className="list-disc pl-5 text-sm text-text-secondary">
                  <li>Sesión informativa mensual</li>
                  <li>Voluntariado ambiental</li>
                  <li>Taller de desarrollo profesional</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-10 text-sm text-text-secondary">
        © {new Date().getFullYear()} Rotaract D4465. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default Home;
