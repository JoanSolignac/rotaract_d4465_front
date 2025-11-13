import { useLocation, Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import useAuth from '../../../shared/hooks/useAuth.js';

const PANEL_LINKS = [
  { label: 'Dashboard', to: '/panel' },
  { label: 'Convocatorias', to: '/convocatorias' },
  { label: 'Clubes', to: '/clubes' },
];

const buildClassName = (base, modifiers = []) =>
  [base, ...modifiers.filter(Boolean)].join(' ').trim();

const PanelNavbar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const welcomeName = useMemo(() => {
    const name = user?.fullName ?? user?.name ?? 'Rotaractiano';
    return name?.split(' ')[0] ?? 'Rotaractiano';
  }, [user]);

  const toggleMenu = () => setIsOpen((v) => !v);
  const closeMenu = () => setIsOpen(false);

  const renderNavLink = (link, className = 'primary-nav__link') => {
    const isActive = location.pathname === link.to;

    return (
      <Link
        className={buildClassName(className, [isActive ? 'is-active' : null])}
        to={link.to}
        onClick={closeMenu}
      >
        {link.label}
      </Link>
    );
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <nav
      className={isOpen ? 'primary-nav primary-nav--panel primary-nav--mobile-open' : 'primary-nav primary-nav--panel'}
      aria-label="Navegación del panel"
    >
      <div className="primary-nav__inner">
        <Link to="/panel" className="primary-nav__brand" aria-label="Ir al panel">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/69484d16ca0afae22dd6aa3eb937859f7b4571de?width=312"
            alt="Logotipo de Rotaract"
            className="primary-nav__logo"
            loading="lazy"
          />
          <div className="primary-nav__brand-copy">
            <span className="primary-nav__brand-text">Panel distrital · Rotaract 4465</span>
            <span className="primary-nav__brand-subtitle">Sesión activa · {welcomeName}</span>
          </div>
        </Link>

        <button
          type="button"
          className="primary-nav__mobile-toggle"
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isOpen}
          aria-controls="panel-mobile-panel"
          onClick={toggleMenu}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            {isOpen ? (
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </button>

        <ul className="primary-nav__links" aria-hidden={isOpen}>
          {PANEL_LINKS.map((link) => (
            <li key={link.to} className="primary-nav__item">
              {renderNavLink(link)}
            </li>
          ))}
        </ul>

        <div className="primary-nav__actions" aria-hidden={isOpen}>
          <Link to="/" className="primary-nav__action primary-nav__action--ghost" onClick={closeMenu}>
            Ir al inicio
          </Link>
          <button type="button" className="primary-nav__action primary-nav__action--outline" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>

        <div
          className="primary-nav__mobile-menu"
          id="panel-mobile-panel"
          role="dialog"
          aria-modal={isOpen}
          aria-hidden={!isOpen}
        >
          <p className="primary-nav__mobile-heading">Menú del panel</p>
          <ul className="primary-nav__mobile-links">
            {PANEL_LINKS.map((link) => (
              <li key={`${link.to}-panel`} className="primary-nav__mobile-item">
                {renderNavLink(link, 'primary-nav__mobile-link')}
              </li>
            ))}
          </ul>

          <span className="primary-nav__mobile-divider" aria-hidden="true" />
          <div className="primary-nav__mobile-actions">
            <Link to="/" className="primary-nav__action primary-nav__action--ghost primary-nav__mobile-action" onClick={closeMenu}>
              Regresar al sitio
            </Link>
            <button
              type="button"
              className="primary-nav__action primary-nav__action--outline primary-nav__mobile-action"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PanelNavbar;
