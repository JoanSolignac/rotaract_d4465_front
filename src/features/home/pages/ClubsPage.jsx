import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PanelLayout from '../../../shared/layouts/PanelLayout.jsx';
import { fetchPublicClubs } from '../services/homeService.js';
import '../../../styles/home.css';

const ClubsPage = () => {
  const [clubs, setClubs] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let isMounted = true;
    setStatus('pending');

    fetchPublicClubs()
      .then((items) => {
        if (!isMounted) {
          return;
        }
        setClubs(items);
      })
      .catch((fetchError) => {
        if (!isMounted) {
          return;
        }
        setError(fetchError?.message ?? 'No fue posible cargar los clubes públicos.');
      })
      .finally(() => {
        if (isMounted) {
          setStatus('idle');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const renderContent = () => {
    if (status === 'pending') {
      return <p className="collection-status">Cargando clubes…</p>;
    }

    if (error) {
      return (
        <div className="collection-status collection-status--error" role="alert">
          {error}
        </div>
      );
    }

    if (clubs.length === 0) {
      return <p className="collection-status">Aún no hay clubes disponibles.</p>;
    }

    return (
      <div className="member-dashboard__grid member-dashboard__grid--clubs">
        {clubs.map((club) => (
          <article key={club.id} className="dashboard-card dashboard-card--club">
            <header className="dashboard-card__head">
              <p className="dashboard-card__tag">Club Rotaract</p>
              <h3 className="dashboard-card__title">{club.name}</h3>
              <p className="dashboard-card__meta">{club.city}</p>
            </header>
            <p className="dashboard-card__description">{club.speciality}</p>
            <div className="dashboard-card__body">
              {club.president && <p>Presidencia: {club.president}</p>}
              {club.foundedAt && <p>Fundado: {club.foundedAt}</p>}
              {club.isActive === false && <p>Estado: En reorganización</p>}
            </div>

            <div className="dashboard-card__actions">
              <Link className="member-dashboard__item-link" to={`/clubes/${club.id}`}>
                Ver detalle
              </Link>
              {club.email && (
                <a className="member-dashboard__item-link" href={`mailto:${club.email}`}>
                  Escribir
                </a>
              )}
              {club.phone && (
                <a
                  className="member-dashboard__item-link"
                  href={`https://wa.me/${club.phone.replace(/[^\d+]/g, '').replace(/^\+/, '')}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  WhatsApp
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    );
  };

  return (
    <PanelLayout>
      <section className="collection-page">
        <header className="collection-page__header">
          <p className="collection-page__eyebrow">Directorio distrital</p>
          <h1 className="collection-page__title">Clubes registrados</h1>
          <p className="collection-page__subtitle">
            Consulta la red de clubes Rotaract 4465 y accede a la información de contacto desde un solo lugar.
          </p>
        </header>

        <div className="member-dashboard__search member-dashboard__search--inline">
          <label htmlFor="clubes-filter">Buscar clubes</label>
          <input
            id="clubes-filter"
            type="search"
            placeholder="Pronto podrás buscar por ciudad o especialidad"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <small className="member-dashboard__search-hint">La búsqueda se habilitará en una próxima versión.</small>
        </div>

        {renderContent()}
      </section>
    </PanelLayout>
  );
};

export default ClubsPage;
