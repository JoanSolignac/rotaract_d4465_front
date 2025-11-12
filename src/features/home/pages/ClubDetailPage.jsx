import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PanelLayout from '../../../shared/layouts/PanelLayout.jsx';
import { fetchClubById } from '../services/homeService.js';
import '../../../styles/home.css';

const ClubDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError('Identificador de club inválido.');
      return;
    }

    let isMounted = true;
    setStatus('pending');
    setError(null);

    fetchClubById(id)
      .then((item) => {
        if (!isMounted) {
          return;
        }

        setClub(item);
      })
      .catch((fetchError) => {
        if (!isMounted) {
          return;
        }

        setError(fetchError?.message ?? 'No fue posible cargar la información del club.');
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

  const descriptor = useMemo(() => {
    if (!club) {
      return 'Información disponible después de cargar el club.';
    }

    const statusLabel = club.isActive ? 'Activo' : 'En reorganización';
    const foundedLabel = club.foundedAt ? `Fundado: ${formatDate(club.foundedAt)}` : null;

    return [statusLabel, foundedLabel].filter(Boolean).join(' • ');
  }, [club]);

  return (
    <PanelLayout>
      <section className="member-dashboard">
        <div className="member-dashboard__content">
          <header className="member-dashboard__header">
            <h1 className="member-dashboard__title">Detalles del club</h1>
            <p className="member-dashboard__subtitle">{descriptor}</p>
          </header>

          {error && (
            <div className="member-dashboard__feedback member-dashboard__feedback--error" role="alert">
              {error}
            </div>
          )}

          {!error && !club && status === 'pending' && (
            <p className="member-dashboard__card-note">Cargando club…</p>
          )}

          {club && (
            <article className="member-dashboard__card member-dashboard__card--metrics">
              <div className="member-dashboard__card-head">
                <div>
                  <h2 className="member-dashboard__card-title">{club.name}</h2>
                  <p className="member-dashboard__card-subtitle">{club.department}</p>
                </div>
                <button type="button" className="member-dashboard__logout" onClick={() => navigate(-1)}>
                  Volver
                </button>
              </div>

              <div className="member-dashboard__metrics-grid" role="list">
                <div className="member-dashboard__metric" role="listitem">
                  <p className="member-dashboard__metric-label">Ciudad</p>
                  <p className="member-dashboard__metric-value">{club.city}</p>
                </div>
                <div className="member-dashboard__metric" role="listitem">
                  <p className="member-dashboard__metric-label">Estado</p>
                  <p className="member-dashboard__metric-value">{club.isActive ? 'Activo' : 'Reorganización'}</p>
                </div>
                <div className="member-dashboard__metric" role="listitem">
                  <p className="member-dashboard__metric-label">Fundación</p>
                  <p className="member-dashboard__metric-value">{formatDate(club.foundedAt)}</p>
                </div>
              </div>

              <div className="member-dashboard__columns">
                <article className="member-dashboard__card member-dashboard__panel">
                  <header className="member-dashboard__panel-header">
                    <h2 className="member-dashboard__panel-title">Contacto</h2>
                  </header>
                  {(club.email || club.phone) && (
                    <div className="member-dashboard__item-actions">
                      {club.email && (
                        <a className="member-dashboard__item-link" href={`mailto:${club.email}`}>
                          Escribir correo
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
                  )}
                  {!club.email && !club.phone && (
                    <p className="member-dashboard__item-description">No hay datos de contacto disponibles.</p>
                  )}
                </article>
              </div>
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

export default ClubDetailPage;
