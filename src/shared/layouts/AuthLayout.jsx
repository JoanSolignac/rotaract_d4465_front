import AuthBackground from '../components/backgrounds/AuthBackground.jsx';
import PrimaryNavbar from '../components/navigation/PrimaryNavbar.jsx';

const AuthLayout = ({ children, backgroundImage }) => (
  <div className="auth-shell">
    <AuthBackground image={backgroundImage} />
    <header className="auth-shell__header">
      <PrimaryNavbar variant="auth" isSolid />
    </header>
    <main className="auth-shell__content">
      <section className="auth-shell__card" aria-live="polite">
        {children}
      </section>
    </main>
  </div>
);

export default AuthLayout;
