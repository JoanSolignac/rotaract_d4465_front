import { Link } from 'react-router-dom';

const NavBar = ({ variant = 'default' }) => {
  const isAuth = variant === 'auth';

  return (
    <nav className={isAuth ? 'auth-navbar' : 'navbar'}>
      <div className={isAuth ? 'auth-nav-container' : 'nav-container'}>
        <Link to="/">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/69484d16ca0afae22dd6aa3eb937859f7b4571de?width=312"
            alt="Rotaract Logo"
            className={isAuth ? 'auth-logo' : 'logo'}
          />
        </Link>

        <div className={isAuth ? 'auth-nav-links' : 'nav-links'}>
          <a href="/#proyectos">Proyectos</a>
          <a href="/#convocatorias">Convocatorias</a>
          <a href="/#club-finder">Club Finder</a>
          <a href="/#quienes-somos">¿Quiénes somos?</a>
        </div>

        <div className={isAuth ? 'auth-nav-buttons' : 'nav-buttons'}>
          <Link to="/signup" className={isAuth ? 'auth-btn-join' : 'btn-join'}>
            Únete
          </Link>
          <Link to="/login" className={isAuth ? 'auth-btn-login' : 'btn-login'}>
            Iniciar sesión
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
