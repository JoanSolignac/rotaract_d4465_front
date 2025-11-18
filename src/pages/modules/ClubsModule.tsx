import { Card } from "../../components/ui/Card";
import { SectionHeading } from "../../components/shared/SectionHeading";

export const ClubsModule = () => {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Próximo lanzamiento"
        title="Directorio de clubes"
        description="Visualiza clubes Rotaract, juntas directivas y focos de acción estratégica."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Integración de datos" subtitle="Sincronizando con la base distrital">
          <p className="text-sm text-text-secondary">
            Mapa interactivo con filtros por región, enfoque y nivel de actividad mensual.
          </p>
        </Card>
        <Card title="Mentorías cruzadas" subtitle="Historias de éxito">
          <p className="text-sm text-text-secondary">
            Conecta clubes con proyectos similares para acelerar el intercambio de mejores
            prácticas.
          </p>
        </Card>
      </div>
    </div>
  );
};
