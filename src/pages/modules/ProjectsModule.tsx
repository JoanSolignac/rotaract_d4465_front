import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { SectionHeading } from "../../components/shared/SectionHeading";

export const ProjectsModule = () => {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Fase beta"
        title="Gestión de proyectos"
        description="Estamos integrando visibilidad total de iniciativas Rotaract en Perú Sur."
      />
      <Card
        title="Construyendo el ecosistema"
        subtitle="Las funcionalidades estarán disponibles pronto."
      >
        <div className="flex flex-col gap-6">
          <p className="text-sm text-text-secondary">
            Este módulo recopilará proyectos activos, indicadores de impacto y conexiones con
            clubes para facilitar colaboraciones.
          </p>
          <Button variant="secondary" className="self-start">
            Notificarme cuando esté listo
          </Button>
        </div>
      </Card>
    </div>
  );
};
