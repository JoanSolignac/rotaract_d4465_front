import { useEffect, useMemo, useState } from 'react';
import PublicLayout from '../../../shared/layouts/PublicLayout.jsx';
import { fetchHomeSnapshot, normaliseClub, normaliseConvocatoria } from '../services/homeService.js';
import '../../../styles/home.css';

const FOCUS_AREAS = [
  {
    title: 'Paz y resolución de conflictos',
    description: 'Promovemos espacios de diálogo y programas de mediación para comunidades vulnerables.',
    icon: '🕊️',
  },
  {
    title: 'Salud y prevención',
    description: 'Organizamos campañas médicas y jornadas de bienestar accesibles para todos.',
    icon: '⚕️',
  },
  {
    title: 'Educación y alfabetización',
    description: 'Impulsamos mentorías, becas y programas de formación para el talento joven.',
    icon: '📚',
  },
  {
    title: 'Desarrollo económico',
    description: 'Apoyamos emprendimientos sociales que generan oportunidades sostenibles.',
    icon: '💼',
  },
  {
    title: 'Protección del medio ambiente',
    description: 'Fomentamos proyectos de reforestación, reciclaje y uso responsable de recursos.',
    icon: '🌱',
  },
  {
    title: 'Agua y saneamiento',
    description: 'Llevamos soluciones de agua segura y educación sanitaria a zonas rurales.',
    icon: '💧',
  },
];

const FALLBACK_CALLS = [
  {
    id: 'evento-1',
    name: 'Cumbre Distrital de Innovación Social',
    location: 'Lima, Perú',
    date: '12 de abril',
    summary: 'Un encuentro para compartir soluciones tecnológicas que impactan comunidades vulnerables.',
  },
  {
    id: 'evento-2',
    name: 'Semana de Servicio Comunitario',
    location: 'Cusco, Perú',
    date: '25 de mayo',
    summary: 'Voluntariado simultáneo en educación, salud y medio ambiente en todo el distrito.',
  },
];

const FALLBACK_CLUBS = [
  {
    id: 'club-1',
    name: 'Rotaract Club Miraflores',
    city: 'Lima',
    speciality: 'Innovación social',
  },
  {
    id: 'club-2',
    name: 'Rotaract Club Arequipa Majes',
    city: 'Arequipa',
    speciality: 'Proyectos ambientales',
  },
  {
    id: 'club-3',
    name: 'Rotaract Club Trujillo Colonial',
    city: 'Trujillo',
    speciality: 'Educación y liderazgo',
  },
];

const DEFAULT_METRICS = {
  members: 1200,
  clubs: 45,
  projects: 150,
};

const formatDateLabel = (value) => {
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

const HomePage = () => {
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [metrics, setMetrics] = useState(DEFAULT_METRICS);
  const [convocatorias, setConvocatorias] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setNavbarScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadSnapshot = async () => {
      try {
        const snapshot = await fetchHomeSnapshot();
        setClubs(snapshot.clubs);
        setConvocatorias(snapshot.convocatorias);

        setMetrics((previous) => ({
          members: snapshot.metrics?.members ?? previous.members,
          clubs: snapshot.metrics?.clubs ?? snapshot.clubs?.length ?? previous.clubs,
          projects:
            snapshot.metrics?.projects ?? snapshot.convocatorias?.length ?? previous.projects,
        }));

        if (snapshot.error) {
          setError(snapshot.error);
        }
      } catch (apiError) {
        setError(
          apiError?.message ??
            'No pudimos conectar con la plataforma. Te mostramos un resumen institucional mientras restablecemos el servicio.',
        );
      } finally {
        setLoading(false);
      }
    };

    loadSnapshot();
  }, []);

  const highlightedConvocatorias = useMemo(() => {
    if (convocatorias.length === 0) {
      return FALLBACK_CALLS;
    }

    return convocatorias.slice(0, 3).map((item) => {
      const convocatoria = normaliseConvocatoria(item);
      return {
        ...convocatoria,
        date: formatDateLabel(convocatoria.date) ?? convocatoria.date,
      };
    });
  }, [convocatorias]);

  const featuredClubs = useMemo(() => {
    if (clubs.length === 0) {
      return FALLBACK_CLUBS;
    }

    return clubs.slice(0, 3).map((club) => {
      const normalised = normaliseClub(club);
      return normalised;
    });
  }, [clubs]);

  return (
    <PublicLayout navbarScrolled={navbarScrolled}>
      <section className="landing-hero">
        <div className="landing-hero__media" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2400&auto=format&fit=crop"
            alt="Jóvenes voluntarios de Rotaract Perú"
            loading="lazy"
          />
          <div className="landing-hero__overlay" />
        </div>

        <div className="landing-hero__content">
          <span className="landing-hero__badge">Distrito 4465 · Perú</span>
          <h1 className="landing-hero__title">Liderazgo joven al servicio de nuestras comunidades</h1>
          <p className="landing-hero__subtitle">
            Somos una red de clubes Rotaract que potencia el talento juvenil para crear proyectos de impacto sostenible en
            todo el país.
          </p>
          <div className="landing-hero__cta">
            <a href="/#proyectos" className="landing-hero__button landing-hero__button--primary">
              Explorar proyectos
            </a>
            <a href="/#club-finder" className="landing-hero__button landing-hero__button--ghost">
              Unirme a un club
            </a>
          </div>
        </div>
      </section>

      <section className="landing-section landing-section--metrics" id="quienes-somos">
        <div className="landing-section__header">
          <h2 className="landing-section__title">Nuestro impacto en cifras</h2>
          <p className="landing-section__subtitle">
            Una comunidad articulada de jóvenes profesionales que comparten talento, tiempo y recursos para transformar el
            país.
          </p>
        </div>

        <div className="metrics-grid">
          <article className="metric-card">
            <p className="metric-card__value">{metrics.members.toLocaleString('es-PE')}+</p>
            <h3 className="metric-card__title">Miembros activos</h3>
            <p className="metric-card__description">
              Formación continua y liderazgo de servicio en cada club del distrito.
            </p>
          </article>

          <article className="metric-card">
            <p className="metric-card__value">{metrics.clubs}</p>
            <h3 className="metric-card__title">Clubes conectados</h3>
            <p className="metric-card__description">
              Presencia en las principales ciudades del Perú, articulando alianzas estratégicas.
            </p>
          </article>

          <article className="metric-card">
            <p className="metric-card__value">{metrics.projects}+</p>
            <h3 className="metric-card__title">Proyectos anuales</h3>
            <p className="metric-card__description">
              Iniciativas de alto impacto en educación, salud, medio ambiente y desarrollo económico.
            </p>
          </article>
        </div>
      </section>

      {loading && (
        <p className="landing-status" role="status">
          Cargando información actualizada…
        </p>
      )}

      {error && (
        <div className="landing-feedback landing-feedback--warning" role="status">
          {error}
        </div>
      )}

      <section className="landing-section" id="convocatorias">
        <div className="landing-section__header">
          <h2 className="landing-section__title">Próximos eventos y convocatorias</h2>
          <p className="landing-section__subtitle">
            Participa en espacios de aprendizaje, networking y acción social diseñados para potenciar tu liderazgo.
          </p>
        </div>

        <div className="events-grid">
          {highlightedConvocatorias.map((convocatoria) => {
            const isExternalLink = convocatoria.url?.startsWith('http');
            return (
              <article key={convocatoria.id} className="event-card">
                <div className="event-card__meta">
                  <span className="event-card__date">{convocatoria.date}</span>
                  <span className="event-card__location">{convocatoria.location}</span>
                </div>
                <h3 className="event-card__title">{convocatoria.name}</h3>
                <p className="event-card__summary">{convocatoria.summary}</p>
                <a
                  href={convocatoria.url ?? '/#convocatorias'}
                  className="event-card__link"
                  {...(isExternalLink ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                >
                  {convocatoria.url ? 'Postular ahora' : 'Ver detalles'}
                </a>
              </article>
            );
          })}
        </div>
      </section>

      <section className="landing-section landing-section--clubs" id="club-finder">
        <div className="landing-section__header">
          <h2 className="landing-section__title">Clubes destacados</h2>
          <p className="landing-section__subtitle">
            Conoce algunos de los clubes que lideran proyectos innovadores y colaboran entre sí para ampliar su impacto.
          </p>
        </div>

        <div className="club-grid">
          {featuredClubs.map((club) => (
            <article key={club.id} className="club-card">
              <header className="club-card__header">
                <h3 className="club-card__name">{club.name}</h3>
                <span className="club-card__city">{club.city}</span>
              </header>
              <p className="club-card__focus">{club.speciality}</p>
              <a href="/#contacto" className="club-card__link">
                Contactar club
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section" id="proyectos">
        <div className="landing-section__header">
          <h2 className="landing-section__title">Áreas de enfoque</h2>
          <p className="landing-section__subtitle">
            Trabajamos alineados a las prioridades de Rotary International para generar soluciones sostenibles.
          </p>
        </div>

        <div className="focus-grid">
          {FOCUS_AREAS.map((focus) => (
            <article key={focus.title} className="focus-card">
              <div className="focus-card__icon" aria-hidden="true">
                {focus.icon}
              </div>
              <h3 className="focus-card__title">{focus.title}</h3>
              <p className="focus-card__description">{focus.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-cta" id="politicas">
        <div className="landing-cta__content">
          <h2 className="landing-cta__title">¿Listo para transformar tu comunidad?</h2>
          <p className="landing-cta__subtitle">
            Súmate a Rotaract Distrito 4465 y construyamos juntos proyectos con propósito, impacto y sostenibilidad.
          </p>
        </div>
        <div className="landing-cta__actions">
          <a href="/signup" className="landing-cta__button landing-cta__button--primary">
            Postular ahora
          </a>
          <a href="/#contacto" className="landing-cta__button landing-cta__button--outline">
            Solicitar información
          </a>
        </div>
      </section>
    </PublicLayout>
  );
};

export default HomePage;
