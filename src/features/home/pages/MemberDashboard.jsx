import { useEffect, useMemo, useState } from 'react';
import useAuth from '../../../shared/hooks/useAuth.js';
import PublicLayout from '../../../shared/layouts/PublicLayout.jsx';
import { fetchHomeSnapshot, normaliseClub, normaliseConvocatoria } from '../services/homeService.js';
import '../../../styles/home.css';

const DASHBOARD_METRICS_FALLBACK = {
  members: 1200,
  clubs: 45,
  projects: 150,
};

const MemberDashboard = () => {
  const { user, logout } = useAuth();
  const [convocatorias, setConvocatorias] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [metrics, setMetrics] = useState(DASHBOARD_METRICS_FALLBACK);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const parseMetric = (value, fallback) => {
    if (value === undefined || value === null || value === '') {
      return fallback;
    }

    const numeric = Number(value);

    if (Number.isNaN(numeric)) {
      return fallback;
    }

    return Math.max(numeric, 0);
  };

  useEffect(() => {
    let isMounted = true;

    const loadSnapshot = async () => {
      try {
        const snapshot = await fetchHomeSnapshot();

        if (!isMounted) {
          return;
        }

        setConvocatorias((snapshot.convocatorias ?? []).map((item) => normaliseConvocatoria(item)));
        setClubs((snapshot.clubs ?? []).map((club) => normaliseClub(club)));
        setMetrics({
          members: parseMetric(snapshot.metrics?.members, DASHBOARD_METRICS_FALLBACK.members),
          clubs: parseMetric(
            snapshot.metrics?.clubs ?? snapshot.clubs?.length,
            DASHBOARD_METRICS_FALLBACK.clubs,
          ),
          projects: parseMetric(
            snapshot.metrics?.projects ?? snapshot.convocatorias?.length,
            DASHBOARD_METRICS_FALLBACK.projects,
          ),
        });

        if (snapshot.error) {
          setFeedback({ type: 'warning', message: snapshot.error });
        } else {
          setFeedback(null);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setFeedback({
          type: 'error',
          message:
            error?.message ??
            'No pudimos cargar la información del distrito. Intenta nuevamente en unos minutos.',
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSnapshot();

    return () => {
      isMounted = false;
    };
  }, []);

  const upcomingConvocatorias = useMemo(() => {
    if (convocatorias.length === 0) {
      return [
        {
          id: 'convocatoria-fallback',
          name: 'Convocatoria distrital',
          summary: 'Revisa el portal institucional para conocer los requisitos y cronograma actualizado.',
          date: 'Próximamente',
          location: 'Distrito 4465',
          url: null,
        },
      ];
    }

    return convocatorias.slice(0, 5).map((convocatoria) => ({
      ...convocatoria,
      date: formatDate(convocatoria.date) ?? convocatoria.date,
      closingDate: formatDate(convocatoria.closingDate),
    }));
  }, [convocatorias]);

  const districtClubs = useMemo(() => {
    if (clubs.length === 0) {
      return [
        {
          id: 'club-fallback',
          name: 'Rotaract Club Miraflores',
          city: 'Lima',
          speciality: 'Innovación social',
          email: null,
          phone: null,
          president: null,
        },
      ];
    }

    return clubs.slice(0, 6);
  }, [clubs]);

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

          {feedback && (
            <div
              className={`member-dashboard__feedback member-dashboard__feedback--${feedback.type}`}
              role={feedback.type === 'error' ? 'alert' : 'status'}
            >
              {feedback.message}
            </div>
          )}

          <article className="member-dashboard__card member-dashboard__card--metrics">
            <div className="member-dashboard__card-head">
              <div>
                <h2 className="member-dashboard__card-title">Resumen distrital</h2>
                <p className="member-dashboard__card-subtitle">
                  Mantente al día con las cifras que reportan los equipos de Rotaract en todo el distrito.
                </p>
              </div>

              <button type="button" className="member-dashboard__logout" onClick={logout}>
                Cerrar sesión
              </button>
            </div>

            <div className="member-dashboard__metrics-grid" role="list">
              <div className="member-dashboard__metric" role="listitem">
                <p className="member-dashboard__metric-value">{metrics.members.toLocaleString('es-PE')}+</p>
                <p className="member-dashboard__metric-label">Miembros activos</p>
              </div>
              <div className="member-dashboard__metric" role="listitem">
                <p className="member-dashboard__metric-value">{metrics.clubs}</p>
                <p className="member-dashboard__metric-label">Clubes registrados</p>
              </div>
              <div className="member-dashboard__metric" role="listitem">
                <p className="member-dashboard__metric-value">{metrics.projects}+</p>
                <p className="member-dashboard__metric-label">Proyectos activos</p>
              </div>
            </div>

            <p className="member-dashboard__card-note" role="status">
              {loading ? 'Actualizando información…' : 'Datos consolidados con reportes oficiales del distrito.'}
            </p>
          </article>

          <div className="member-dashboard__columns">
            <article className="member-dashboard__card member-dashboard__panel">
              <header className="member-dashboard__panel-header">
                <h2 className="member-dashboard__panel-title">Convocatorias activas</h2>
                <p className="member-dashboard__panel-subtitle">
                  Postula o comparte con tu club las oportunidades de formación y servicio disponibles.
                </p>
              </header>

              <ul className="member-dashboard__items">
                {upcomingConvocatorias.map((convocatoria) => (
                  <li key={convocatoria.id} className="member-dashboard__item">
                    <div className="member-dashboard__item-info">
                      <h3 className="member-dashboard__item-title">{convocatoria.name}</h3>
                      <p className="member-dashboard__item-meta">
                        <span>{convocatoria.date}</span>
                        <span aria-hidden="true">•</span>
                        <span>{convocatoria.location}</span>
                        {convocatoria.closingDate && (
                          <>
                            <span aria-hidden="true">•</span>
                            <span>Cierra: {convocatoria.closingDate}</span>
                          </>
                        )}
                      </p>
                      <p className="member-dashboard__item-description">{convocatoria.summary}</p>
                    </div>
                    <a
                      href={convocatoria.url ?? '/#convocatorias'}
                      className="member-dashboard__item-link"
                      {...(convocatoria.url
                        ? { target: '_blank', rel: 'noreferrer noopener' }
                        : {})}
                    >
                      {convocatoria.url ? 'Postular' : 'Ver detalle'}
                    </a>
                  </li>
                ))}
              </ul>
            </article>

            <article className="member-dashboard__card member-dashboard__panel">
              <header className="member-dashboard__panel-header">
                <h2 className="member-dashboard__panel-title">Clubes del distrito</h2>
                <p className="member-dashboard__panel-subtitle">
                  Contacta a las directivas para fortalecer alianzas y compartir buenas prácticas.
                </p>
              </header>

              <ul className="member-dashboard__items member-dashboard__items--compact">
                {districtClubs.map((club) => {
                  const whatsappTarget = club.phone ? club.phone.replace(/[^\d+]/g, '') : null;

                  return (
                    <li key={club.id} className="member-dashboard__item">
                      <div className="member-dashboard__item-info">
                        <h3 className="member-dashboard__item-title">{club.name}</h3>
                        <p className="member-dashboard__item-meta">
                          <span>{club.city}</span>
                          {club.president && (
                          <>
                            <span aria-hidden="true">•</span>
                            <span>Presidencia: {club.president}</span>
                          </>
                        )}
                      </p>
                      <p className="member-dashboard__item-description">{club.speciality}</p>
                    </div>
                    {(club.email || club.phone) && (
                      <div className="member-dashboard__item-actions">
                        {club.email && (
                          <a className="member-dashboard__item-link" href={`mailto:${club.email}`}>
                            Escribir
                          </a>
                        )}
                        {whatsappTarget && (
                          <a
                            className="member-dashboard__item-link"
                            href={`https://wa.me/${whatsappTarget.replace(/^\+/, '')}`}
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            WhatsApp
                          </a>
                        )}
                      </div>
                    )}
                  </li>
                  );
                })}
              </ul>
            </article>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default MemberDashboard;
