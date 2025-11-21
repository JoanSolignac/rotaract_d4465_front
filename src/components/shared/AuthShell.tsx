import { ReactNode } from "react";
import logo from "../../assets/logo.svg";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export const AuthShell = ({
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) => (
  <div className="relative min-h-screen overflow-hidden px-4 py-10 text-text-primary">
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 aurora-grid" />
      <div className="liquid-blob -left-12 top-24 h-72 w-72 rounded-full bg-primary/24" />
      <div className="liquid-blob right-4 top-10 h-80 w-80 rounded-full bg-accent/22" />
      <div className="liquid-blob left-1/2 bottom-[-6rem] h-80 w-80 rounded-full bg-secondary/18" />
    </div>

    <div className="relative mx-auto grid max-w-6xl gap-10 rounded-[32px] bg-white/5 p-6 shadow-floating backdrop-blur-2xl lg:grid-cols-2">
      <div className="glass-card relative overflow-hidden rounded-[28px] bg-gradient-to-br from-primary-dark to-accent p-10 text-white">
        <div className="absolute inset-0 grid-lines opacity-30" />
        <img src={logo} alt="Rotaract D4465" className="w-20 drop-shadow-lg" />
        <div className="mt-10 space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-white/80">Rotaract D4465</p>
          <h1 className="text-4xl font-semibold leading-snug">{title}</h1>
          <p className="text-white/80">{subtitle}</p>
        </div>
        <div className="mt-14 space-y-4">
          <div className="rounded-3xl bg-white/15 p-5 backdrop-blur">
            <p className="text-sm text-white/80">
              Arquitectura modular, accesible y diseñada con estética líquido-holográfica para potenciar cada rol.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.35em] text-white/70">
            <span className="rounded-full bg-white/10 px-3 py-1">Seguridad</span>
            <span className="rounded-full bg-white/10 px-3 py-1">Roles</span>
            <span className="rounded-full bg-white/10 px-3 py-1">UX</span>
          </div>
        </div>
      </div>
      <div className="glass-card flex flex-col justify-center gap-6 rounded-[28px] bg-bg-surface/60 p-10">
        {children}
        <div className="text-center text-sm text-text-secondary">{footer}</div>
      </div>
    </div>
  </div>
);

