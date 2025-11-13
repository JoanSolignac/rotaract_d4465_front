import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const NAVIGATION_LINKS = [
  { label: 'Inicio', to: '/' },
  { label: 'Proyectos', href: '/#proyectos' },
  { label: 'Convocatorias', href: '/#convocatorias' },
  { label: 'Club Finder', href: '/#club-finder' },
  { label: '¿Quiénes somos?', href: '/#quienes-somos' },
];

const ACTION_LINKS = [
  { label: 'Panel distrital', to: '/panel', variant: 'ghost' },
  { label: 'Iniciar sesión', to: '/login', variant: 'outline' },
  { label: 'Regístrate', to: '/signup', variant: 'primary' },
];

const buildClassName = (base, modifiers = []) =>
  [base, ...modifiers.filter(Boolean)].join(' ').trim();

const PrimaryNavbar = ({ variant = 'default', isSolid = false }) => {
  const location = useLocation();
  const isAuthVariant = variant === 'auth';

  const [isOpen, setIsOpen] = useState(false);

  const navClassName = buildClassName('primary-nav', [
    isAuthVariant ? 'primary-nav--auth' : null,
    isSolid ? 'primary-nav--solid' : 'primary-nav--transparent',
    isOpen ? 'primary-nav--mobile-open' : null,
  ]);

  const toggleMenu = () => setIsOpen((v) => !v);
  const closeMenu = () => setIsOpen(false);

  const renderNavLink = (link, className = 'primary-nav__link') => {
    const isActive = link.to ? location.pathname === link.to : false;
    const contentClassName = buildClassName(className, [isActive ? 'is-active' : null]);

    if (link.to) {
      return (
        <Link
          to={link.to}
          className={contentClassName}
          onClick={closeMenu}
        >
          {link.label}
        </Link>
      );
    }

    return (
      <a href={link.href} className={contentClassName} onClick={closeMenu}>
        {link.label}
      </a>
    );
  };

  const renderActionLink = (action, extraClasses = '') => {
    const isActive = location.pathname === action.to;

    return (
      <Link
        key={action.to}
        to={action.to}
        className={buildClassName(
          `primary-nav__action primary-nav__action--${action.variant}`,
          [isActive ? 'is-active' : null, extraClasses]
        )}
        onClick={closeMenu}
      >
        {action.label}
      </Link>
    );
  };

  return (
    <nav className={navClassName} aria-label="Navegación principal">
      <div className="primary-nav__inner">
        <Link to="/" className="primary-nav__brand" aria-label="Ir al inicio">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/69484d16ca0afae22dd6aa3eb937859f7b4571de?width=312"
            alt="Logotipo de Rotaract"
            className="primary-nav__logo"
            loading="lazy"
          />
          <div className="primary-nav__brand-copy">
            <span className="primary-nav__brand-text">Distrito 4465</span>
          </div>
        </Link>

        {!isAuthVariant && (
          <>
            <button
              type="button"
              className="primary-nav__mobile-toggle"
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isOpen}
              aria-controls="primary-mobile-panel"
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
              {NAVIGATION_LINKS.map((link) => (
                <li key={link.to ?? link.href} className="primary-nav__item">
                  {renderNavLink(link)}
                </li>
              ))}
            </ul>

            <div
              className="primary-nav__mobile-menu"
              id="primary-mobile-panel"
              role="dialog"
              aria-modal={isOpen}
              aria-hidden={!isOpen}
            >
              <p className="primary-nav__mobile-heading">Explora Rotaract 4465</p>

              <ul className="primary-nav__mobile-links">
                {NAVIGATION_LINKS.map((link) => (
                  <li key={`${link.to ?? link.href}-mobile`} className="primary-nav__mobile-item">
                    {renderNavLink(link, 'primary-nav__mobile-link')}
                  </li>
                ))}
              </ul>

              <span className="primary-nav__mobile-divider" aria-hidden="true" />

              <p className="primary-nav__mobile-heading">Acceso rápido</p>
              <div className="primary-nav__mobile-actions">
                {ACTION_LINKS.map((action) => renderActionLink(action, 'primary-nav__mobile-action'))}
              </div>

              <p className="primary-nav__mobile-note">
                Gestiona tus proyectos, clubes y convocatorias desde el panel distrital.
              </p>
            </div>
          </>
        )}

        {!isAuthVariant && (
          <div className="primary-nav__actions" aria-hidden={isOpen}>
            {ACTION_LINKS.map((action) => renderActionLink(action))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default PrimaryNavbar;
