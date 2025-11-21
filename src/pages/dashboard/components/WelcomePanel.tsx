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
  <section className="glass-card relative overflow-hidden p-6 text-white">
    <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-rotaract-pink/50 via-rotaract-gold/30 to-transparent blur-3xl" />
    <div className="absolute -bottom-12 -right-6 h-36 w-36 rounded-full bg-gradient-to-tl from-rotaract-pink/35 via-purple-500/30 to-transparent blur-3xl" />
    <div className="relative space-y-2">
      <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-rose-50">
        <span className="inline-block h-2 w-2 rounded-full bg-rotaract-pink shadow-[0_0_12px_rgba(255,43,130,0.7)]" />
        Rol: {roleLabel}
      </div>
      <h1 className="text-3xl font-bold leading-tight text-white drop-shadow-lg">{greeting}</h1>
      <p className="text-base text-rose-50/80">{description}</p>
      {hint ? <p className="text-sm text-rose-50/60">{hint}</p> : null}
    </div>
  </section>
);
