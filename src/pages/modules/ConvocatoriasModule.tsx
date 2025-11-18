import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

export const ConvocatoriasModule = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-secondary">En diseño</p>
        <h2 className="text-3xl font-semibold text-text-primary">Convocatorias unificadas</h2>
        <p className="text-sm text-text-secondary">
          Pronto podrás publicar y seguir voluntariados, comités y capacitaciones desde un mismo
          flujo.
        </p>
      </div>
      <Card
        title="Próximos pasos"
        subtitle="UI basada en chips de estados, timelines y recordatorios automáticos."
      >
        <div className="flex flex-col gap-4">
          <ul className="list-disc space-y-2 pl-5 text-sm text-text-secondary">
            <li>Alertas inteligentes según rol y prioridades distritales.</li>
            <li>Integración con WhatsApp y correo institucional.</li>
            <li>Experiencia conversacional siguiendo lineamientos IHM.</li>
          </ul>
          <Button variant="primary" className="self-start">
            Compartir necesidades
          </Button>
        </div>
      </Card>
    </div>
  );
};
