import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PanelLayout from '../../../shared/layouts/PanelLayout.jsx';
import { fetchConvocatoriaById } from '../services/homeService.js';
import '../../../styles/home.css';

const ConvocatoriaDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [convocatoria, setConvocatoria] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError('No se encontró el identificador de la convocatoria.');
      return;
    }

    let isMounted = true;
    setStatus('pending');
    setError(null);

    fetchConvocatoriaById(id)
      .then((item) => {
        if (!isMounted) {
          return;
        }

        setConvocatoria(item);
      })
      .catch((fetchError) => {
        if (!isMounted) {
          return;
        }

        setError(fetchError?.message ?? 'No fue posible cargar la convocatoria solicitada.');
      })
      .finally(() => {
        if (isMounted) {
          setStatus('idle');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const formatDate = (value) => {
    if (!value) {
      return null;
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      return value;
    }

    return parsed.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const subtitle = useMemo(() => {
    if (!convocatoria) {
      return 'Detalles completos disponibles después de cargar la convocatoria.';
    }

    const parts = [];

    if (convocatoria.clubName) {
      parts.push(`Organiza: ${convocatoria.clubName}`);
    }

    if (convocatoria.requirements) {
      parts.push(`Requisitos: ${convocatoria.requirements}`);
    }

    if (convocatoria.isActive === false) {
      parts.push('Estado: en pausa');
    }

    return parts.join(' • ');
  }, [convocatoria]);

  return (
    <PanelLayout>
      <section className="member-dashboard">
        <div className="member-dashboard__content">
          <header className="member-dashboard__header">
            <h1 className="member-dashboard__title">Detalles de convocatoria</h1>
            <p className="member-dashboard__subtitle">{subtitle}</p>
          </header>

          {error && (
            <div className="member-dashboard__feedback member-dashboard__feedback--error" role="alert">
              {error}
            </div>
          )}

          {!error && !convocatoria && status === 'pending' && (
            <p className="member-dashboard__card-note">Cargando convocatoria…</p>
          )}

          {convocatoria && (
            <article className="member-dashboard__card member-dashboard__card--metrics">
              <div className="member-dashboard__card-head">
                <div>
                  <h2 className="member-dashboard__card-title">{convocatoria.name}</h2>
                  <p className="member-dashboard__card-subtitle">{convocatoria.summary}</p>
                </div>
                <button type="button" className="member-dashboard__logout" onClick={() => navigate(-1)}>
                  Volver
                </button>
              </div>

              <div className="member-dashboard__metrics-grid" role="list">
                <div className="member-dashboard__metric" role="listitem">
                  <p className="member-dashboard__metric-label">Ubicación</p>
                  <p className="member-dashboard__metric-value">{convocatoria.location}</p>
                </div>
                <div className="member-dashboard__metric" role="listitem">
                  <p className="member-dashboard__metric-label">Fecha</p>
                  <p className="member-dashboard__metric-value">
                    {formatDate(convocatoria.date)} • {formatDate(convocatoria.closingDate ?? convocatoria.date)}
                  </p>
                </div>
                <div className="member-dashboard__metric" role="listitem">
                  <p className="member-dashboard__metric-label">Estado</p>
                  <p className="member-dashboard__metric-value">
                    {convocatoria.isActive === false ? 'En pausa' : 'Activa'}
                  </p>
                </div>
              </div>

              <div className="member-dashboard__columns">
                <article className="member-dashboard__card member-dashboard__panel">
                  <header className="member-dashboard__panel-header">
                    <h2 className="member-dashboard__panel-title">Información adicional</h2>
                  </header>
                  <div className="member-dashboard__item-description">
                    {convocatoria.summary}
                  </div>
                  {convocatoria.clubName && (
                    <div className="member-dashboard__item-description">Club organizador: {convocatoria.clubName}</div>
                  )}
                  {convocatoria.requirements && (
                    <div className="member-dashboard__item-description">
                      Requisitos: {convocatoria.requirements}
                    </div>
                  )}
                </article>
                {convocatoria.url && (
                  <article className="member-dashboard__card member-dashboard__panel">
                    <header className="member-dashboard__panel-header">
                      <h2 className="member-dashboard__panel-title">Acción</h2>
                    </header>
                    <a
                      className="member-dashboard__item-link"
                      href={convocatoria.url}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Postular ahora
                    </a>
                  </article>
                )}
              </div>

              <p className="member-dashboard__card-note" role="status">
                {convocatoria.closingDate
                  ? `Cierre: ${formatDate(convocatoria.closingDate)}`
                  : 'Mantente atento a las actualizaciones del distrito.'}
              </p>
            </article>
          )}

          <Link to="/panel" className="member-dashboard__item-link">
            Volver al panel
          </Link>
        </div>
      </section>
    </PanelLayout>
  );
};

export default ConvocatoriaDetailPage;
