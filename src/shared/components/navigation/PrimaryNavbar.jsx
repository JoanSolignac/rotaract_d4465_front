import { Link, useLocation } from 'react-router-dom';

const NAVIGATION_LINKS = [
  { label: 'Proyectos', href: '/#proyectos' },
  { label: 'Convocatorias', href: '/#convocatorias' },
  { label: 'Club Finder', href: '/#club-finder' },
  { label: '¿Quiénes somos?', href: '/#quienes-somos' },
];

const buildClassName = (base, modifiers = []) =>
  [base, ...modifiers.filter(Boolean)].join(' ').trim();

const PrimaryNavbar = ({ variant = 'default', isSolid = false }) => {
  const location = useLocation();
  const isAuthVariant = variant === 'auth';

  const navClassName = buildClassName('primary-nav', [
    isAuthVariant ? 'primary-nav--auth' : null,
    isSolid ? 'primary-nav--solid' : 'primary-nav--transparent',
  ]);

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
          <span className="primary-nav__brand-text">Distrito 4465 · Perú</span>
        </Link>

        {!isAuthVariant && (
          <ul className="primary-nav__links">
            {NAVIGATION_LINKS.map((link) => (
              <li key={link.href} className="primary-nav__item">
                <a href={link.href} className="primary-nav__link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="primary-nav__actions">
          {isAuthVariant ? (
            <Link to="/" className="primary-nav__action primary-nav__action--ghost">
              Volver al inicio
            </Link>
          ) : (
            <a
              href="/#club-finder"
              className="primary-nav__action primary-nav__action--ghost"
            >
              Encuentra tu club
            </a>
          )}

          <Link
            to="/signup"
            className="primary-nav__action primary-nav__action--primary"
          >
            Únete
          </Link>

          <Link
            to="/login"
            className={buildClassName('primary-nav__action', [
              'primary-nav__action--outline',
              location.pathname === '/login' ? 'is-active' : null,
            ])}
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default PrimaryNavbar;
