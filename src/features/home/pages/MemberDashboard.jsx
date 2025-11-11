import useAuth from '../../../shared/hooks/useAuth.js';
import PublicLayout from '../../../shared/layouts/PublicLayout.jsx';
import '../../../styles/home.css';

const MemberDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <PublicLayout navbarScrolled>
      <section className="member-dashboard">
        <div className="member-dashboard__content">
          <header className="member-dashboard__header">
            <h1 className="member-dashboard__title">Panel distrital</h1>
            <p className="member-dashboard__subtitle">
              {user?.fullName ?? user?.name ?? 'Rotaractiano'}, gracias por contribuir al crecimiento del distrito.
            </p>
          </header>

          <div className="member-dashboard__card">
            <h2 className="member-dashboard__card-title">Próximos pasos</h2>
            <ul className="member-dashboard__list">
              <li>Actualiza el perfil de tu club y su plan trimestral.</li>
              <li>Registra los indicadores de tus proyectos activos.</li>
              <li>Comparte historias de impacto para el boletín distrital.</li>
            </ul>

            <button type="button" className="member-dashboard__logout" onClick={logout}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default MemberDashboard;
