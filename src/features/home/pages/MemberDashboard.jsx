import { Link } from 'react-router-dom';
import useAuth from '../../../shared/hooks/useAuth.js';
import PanelLayout from '../../../shared/layouts/PanelLayout.jsx';
import '../../../styles/home.css';

const MemberDashboard = () => {
  const { user, logout } = useAuth();
  const displayName = user?.fullName ?? user?.name ?? 'Rotaractiano';

  return (
    <PanelLayout>
      <section className="member-dashboard member-dashboard--welcome">
        <div className="member-dashboard__content member-dashboard__content--center">
          <article className="member-dashboard__welcome-card">
            <p className="member-dashboard__badge">Distrito 4465 · Perú</p>
            <h1 className="member-dashboard__title">Bienvenido, {displayName}</h1>
            <p className="member-dashboard__subtitle">
              Accede al directorio actualizado de convocatorias y clubes desde el menú principal. Allí encontrarás
              listados dedicados donde podrás explorar cada iniciativa y revisar sus detalles.
            </p>

            {/* Las acciones principales se muestran en la barra de navegación, se eliminan aquí para evitar duplicidad. */}
          </article>
        </div>
      </section>
    </PanelLayout>
  );
};

export default MemberDashboard;
