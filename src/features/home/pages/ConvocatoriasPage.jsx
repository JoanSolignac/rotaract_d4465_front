import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PanelLayout from '../../../shared/layouts/PanelLayout.jsx';
import { fetchPublicConvocatorias } from '../services/homeService.js';
import '../../../styles/home.css';

const ConvocatoriasPage = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let isMounted = true;
    setStatus('pending');

    fetchPublicConvocatorias()
      .then((items) => {
        if (!isMounted) {
          return;
        }
        setConvocatorias(items);
      })
      .catch((fetchError) => {
        if (!isMounted) {
          return;
        }
        setError(fetchError?.message ?? 'No fue posible cargar las convocatorias públicas.');
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
      return <p className="collection-status">Cargando convocatorias…</p>;
    }

    if (error) {
      return (
        <div className="collection-status collection-status--error" role="alert">
          {error}
        </div>
      );
    }

    if (convocatorias.length === 0) {
      return <p className="collection-status">Aún no hay convocatorias registradas.</p>;
    }

    return (
      <div className="member-dashboard__grid member-dashboard__grid--convocatorias">
        {convocatorias.map((convocatoria) => (
          <article key={convocatoria.id} className="dashboard-card">
            <header className="dashboard-card__head">
              <p className="dashboard-card__tag">
                {convocatoria.isActive === false ? 'Convocatoria pausada' : 'Convocatoria activa'}
              </p>
              <h3 className="dashboard-card__title">{convocatoria.name}</h3>
              <p className="dashboard-card__meta">
                <span>{convocatoria.date ?? 'Próximamente'}</span>
                <span aria-hidden="true">•</span>
                <span>{convocatoria.location}</span>
              </p>
            </header>
            <p className="dashboard-card__description">{convocatoria.summary}</p>
            <div className="dashboard-card__body">
              {convocatoria.clubName && <p>Organiza: {convocatoria.clubName}</p>}
              {convocatoria.requirements && <p>Requisitos: {convocatoria.requirements}</p>}
              {convocatoria.closingDate && <p>Fecha de cierre: {convocatoria.closingDate}</p>}
            </div>

            <div className="dashboard-card__actions">
              <Link className="member-dashboard__item-link" to={`/convocatorias/${convocatoria.id}`}>
                Ver detalle
              </Link>
              {convocatoria.url && (
                <a className="member-dashboard__item-link" href={convocatoria.url} target="_blank" rel="noreferrer noopener">
                  Postular
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
          <p className="collection-page__eyebrow">Panel distrital</p>
          <h1 className="collection-page__title">Convocatorias públicas</h1>
          <p className="collection-page__subtitle">
            Consulta la lista de convocatorias activas y programadas. Selecciona cualquiera para conocer los requisitos completos.
          </p>
        </header>

        <div className="member-dashboard__search member-dashboard__search--inline">
          <label htmlFor="convocatorias-filter">Buscar convocatorias</label>
          <input
            id="convocatorias-filter"
            type="search"
            placeholder="Pronto podrás filtrar por palabras clave"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <small className="member-dashboard__search-hint">La búsqueda avanzada estará disponible próximamente.</small>
        </div>

        {renderContent()}
      </section>
    </PanelLayout>
  );
};

export default ConvocatoriasPage;
