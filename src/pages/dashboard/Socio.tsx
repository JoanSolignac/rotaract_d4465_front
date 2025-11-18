import { useEffect, useState } from "react";
import { Card, Progress } from "flowbite-react";
import { useAuth } from "../../hooks/useAuth";
import { WelcomePanel } from "./components/WelcomePanel";

type Proyecto = {
  id: number;
  nombre: string;
  lider: string;
  estado: string;
  avance: number;
  etiquetas?: string[];
};

const mockProjects: Proyecto[] = [
  {
    id: 1,
    nombre: "Reforestación Andina",
    lider: "Club Cusco",
    estado: "En curso",
    avance: 65,
    etiquetas: ["Ambiental"],
  },
  {
    id: 2,
    nombre: "Mentoría Universitaria",
    lider: "Club Lima",
    estado: "Planificado",
    avance: 20,
    etiquetas: ["Educación", "Profesional"],
  },
  {
    id: 3,
    nombre: "Campaña de Abrigo",
    lider: "Club Arequipa",
    estado: "Completado",
    avance: 100,
  },
];

export const Socio = () => {
  const { user } = useAuth();
  const name = user?.nombre ?? user?.correo ?? "Socio";
  const [projects, setProjects] = useState<Proyecto[]>([]);

  useEffect(() => {
    setProjects(mockProjects);
  }, []);

  return (
    <div className="space-y-6">
      <WelcomePanel
        greeting={`Bienvenido, ${name}`}
        roleLabel="Socio"
        description="Explora los proyectos vigentes del distrito y da seguimiento al avance de cada club."
        hint="Esta vista pronto se conectará con la API para mostrar datos reales."
      />
      <section className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-border-subtle">
        <header className="mb-5">
          <h2 className="text-xl font-semibold text-text-primary">
            Proyectos del distrito
          </h2>
          <p className="text-sm text-text-secondary">
            Una vista rápida del avance y estado de cada iniciativa.
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id} className="border border-border-subtle shadow-card">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-text-secondary">
                <span className="text-primary">{project.estado}</span>
                <span>Líder: {project.lider}</span>
              </div>
              <h3 className="text-lg font-semibold text-text-primary">
                {project.nombre}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-text-secondary">
                  <span>Avance</span>
                  <span>{project.avance}%</span>
                </div>
                <Progress progress={project.avance} color="green" />
              </div>
              {project.etiquetas?.length ? (
                <div className="flex flex-wrap gap-2 pt-3 text-xs font-semibold uppercase tracking-wide text-primary">
                  {project.etiquetas.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary/10 px-3 py-1 text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
