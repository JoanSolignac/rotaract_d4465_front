const DEFAULT_AUTH_BACKGROUND =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop';

const AuthBackground = ({ image = DEFAULT_AUTH_BACKGROUND }) => (
  <div className="auth-shell__background" aria-hidden="true">
    <img src={image} alt="Fondo del portal Rotaract" loading="lazy" />
    <div className="auth-shell__background-overlay" />
  </div>
);

export default AuthBackground;
