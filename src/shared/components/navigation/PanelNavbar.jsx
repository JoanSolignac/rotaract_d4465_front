import { useLocation, Link } from 'react-router-dom';
import useAuth from '../../../shared/hooks/useAuth.js';

const PANEL_LINKS = [
  { label: 'Panel', to: '/panel' },
  { label: 'Convocatorias', to: '/convocatorias' },
  { label: 'Clubes', to: '/clubes' },
];

const buildClassName = (base, modifiers = []) => [base, ...modifiers.filter(Boolean)].join(' ').trim();

const PanelNavbar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="primary-nav primary-nav--panel" aria-label="Navegación del panel">
      <div className="primary-nav__inner">
        <Link to="/panel" className="primary-nav__brand" aria-label="Ir al panel">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/69484d16ca0afae22dd6aa3eb937859f7b4571de?width=312"
            alt="Logotipo de Rotaract"
            className="primary-nav__logo"
            loading="lazy"
          />
          <span className="primary-nav__brand-text">Panel distrital · Rotaract 4465</span>
        </Link>

        <ul className="primary-nav__links">
          {PANEL_LINKS.map((link) => {
            const isActive = location.pathname === link.to;

            return (
              <li key={link.to} className="primary-nav__item">
                <Link
                  className={buildClassName('primary-nav__link', [isActive ? 'is-active' : null])}
                  to={link.to}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="primary-nav__actions">
          <button
            type="button"
            className="primary-nav__action primary-nav__action--outline"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default PanelNavbar;
