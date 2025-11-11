const currentYear = new Date().getFullYear();

const SiteFooter = () => (
  <footer className="site-footer">
    <div className="site-footer__inner">
      <div className="site-footer__brand">
        <p className="site-footer__title">Rotaract Distrito 4465 · Perú</p>
        <p className="site-footer__subtitle">
          Forjando líderes jóvenes comprometidos con el servicio y la innovación social.
        </p>
      </div>

      <div className="site-footer__links" aria-label="Enlaces de soporte">
        <a href="mailto:contacto@rotaract4465.org" className="site-footer__link">
          contacto@rotaract4465.org
        </a>
        <a href="https://www.rotary.org" target="_blank" rel="noreferrer" className="site-footer__link">
          rotary.org
        </a>
        <a href="/#politicas" className="site-footer__link">
          Políticas de privacidad
        </a>
      </div>

      <p className="site-footer__legal">© {currentYear} Rotaract D4465. Todos los derechos reservados.</p>
    </div>
  </footer>
);

export default SiteFooter;
