interface WelcomePanelProps {
  greeting: string;
  roleLabel: string;
  description: string;
  hint?: string;
}

export const WelcomePanel = ({
  greeting,
  roleLabel,
  description,
  hint,
}: WelcomePanelProps) => (
  <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/8 via-white to-secondary/5 p-6 shadow-card ring-1 ring-border-subtle">
    <div className="absolute inset-y-0 right-0 w-1/3 translate-x-10 rounded-full bg-primary/10 blur-3xl" />
    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
      Rol: {roleLabel}
    </p>
    <h1 className="mt-2 text-3xl font-bold text-text-primary">{greeting}</h1>
    <p className="mt-2 text-base text-text-secondary">{description}</p>
    {hint ? <p className="mt-1 text-sm text-text-secondary">{hint}</p> : null}
  </section>
);
