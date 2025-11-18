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
  <section className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-border-subtle">
    <p className="text-xs font-semibold uppercase tracking-widest text-primary">
      Rol: {roleLabel}
    </p>
    <h1 className="mt-2 text-3xl font-bold text-text-primary">{greeting}</h1>
    <p className="mt-2 text-base text-text-secondary">{description}</p>
    {hint ? <p className="mt-1 text-sm text-text-secondary">{hint}</p> : null}
  </section>
);
