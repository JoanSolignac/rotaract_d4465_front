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
  <div className="min-h-screen bg-gradient-to-b from-bg-soft via-bg-soft to-bg-surface px-4 py-10">
    <div className="mx-auto grid max-w-6xl gap-10 rounded-[32px] bg-white/80 p-6 shadow-soft backdrop-blur-2xl lg:grid-cols-2">
      <div className="material-card relative overflow-hidden rounded-[28px] bg-gradient-to-br from-primary-dark to-accent p-10 text-white">
        <img
          src={logo}
          alt="Rotaract D4465"
          className="w-20 drop-shadow-lg"
        />
        <div className="mt-10 space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-white/80">
            Rotaract D4465
          </p>
          <h1 className="text-4xl font-semibold leading-snug">{title}</h1>
          <p className="text-white/80">{subtitle}</p>
        </div>
        <div className="mt-14">
          <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
            <p className="text-sm text-white/70">
              Arquitectura modular, accesible y diseñada bajo Material Design e
              IHM para potenciar cada rol dentro del distrito.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-6 rounded-[28px] bg-bg-surface p-10">
        {children}
        <div className="text-center text-sm text-text-secondary">{footer}</div>
      </div>
    </div>
  </div>
);

