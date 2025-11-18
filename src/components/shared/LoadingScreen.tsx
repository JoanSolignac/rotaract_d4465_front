export const LoadingScreen = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg-soft">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      <p className="text-sm text-text-secondary">Cargando tu experiencia Rotaract…</p>
    </div>
  );
};
