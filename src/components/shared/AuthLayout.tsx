import { ReactNode } from 'react';
import logo from '../../assets/logo.svg';

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const AuthLayout = ({ title, description, children, footer }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-soft via-white to-bg-soft">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-4 py-10 lg:flex-row lg:items-center">
        <div className="glass-panel hidden w-full flex-1 flex-col gap-6 p-10 lg:flex">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Rotaract D4465" className="h-12 w-12" />
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-primary/80">Distrito 4465</p>
              <p className="text-2xl font-semibold text-text-primary">Rotaract Perú Sur</p>
            </div>
          </div>
          <p className="text-lg text-text-secondary">
            Diseño basado en Material Design + criterios de Interacción Humano-Máquina.
          </p>
          <div className="mt-auto space-y-4 rounded-2xl bg-primary/10 p-6">
            <p className="text-sm uppercase tracking-widest text-primary-dark">Transformación</p>
            <p className="text-3xl font-semibold text-primary-dark">Innovación + Impacto social</p>
            <p className="text-sm text-text-muted">
              Conecta clubes, proyectos y oportunidades en una experiencia armoniosa.
            </p>
          </div>
        </div>
        <div className="w-full flex-1">
          <div className="glass-panel mx-auto max-w-md space-y-8 p-8">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-semibold text-text-primary">{title}</h1>
              <p className="text-sm text-text-secondary">{description}</p>
            </div>
            {children}
            {footer && <div className="text-center text-sm text-text-secondary">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
