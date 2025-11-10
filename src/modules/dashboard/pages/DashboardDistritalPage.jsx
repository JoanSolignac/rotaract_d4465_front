import { useEffect, useState } from 'react';
import PublicLayout from '../../../layouts/PublicLayout.jsx';
import '../../../assets/styles/LandingPage.css';

const DashboardDistritalPage = () => {
  const [navbarScrolled, setNavbarScrolled] = useState(false);

  const rotaryFocuses = [
    {
      title: 'Paz y Prevención/Resolución de Conflictos',
      icon: '☮️',
      description: 'Promovemos la paz y el entendimiento entre comunidades.',
    },
    {
      title: 'Prevención y Tratamiento de Enfermedades',
      icon: '⚕️',
      description: 'Apoyamos la salud y el bienestar de las comunidades.',
    },
    {
      title: 'Agua y Saneamiento',
      icon: '💧',
      description: 'Garantizamos el acceso a agua potable y saneamiento básico.',
    },
    {
      title: 'Salud Materno Infantil',
      icon: '👨‍👩‍👧‍👦',
      description: 'Protegemos la salud de madres e hijos.',
    },
    {
      title: 'Educación Básica y Alfabetización',
      icon: '📚',
      description: 'Fomentamos la educación de calidad para todos.',
    },
    {
      title: 'Desarrollo Económico Comunitario',
      icon: '💼',
      description: 'Impulsamos el crecimiento económico sostenible.',
    },
    {
      title: 'Medio Ambiente',
      icon: '🌱',
      description: 'Protegemos nuestro planeta para las futuras generaciones.',
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setNavbarScrolled(window.scrollY > 800);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <PublicLayout navbarScrolled={navbarScrolled}>
      <section className="hero">
        <div className="hero-overlay-dark" />
        <div className="hero-overlay-red" />
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/722a988afc24c9d265123ec1217424cbea5a3927?width=3138"
          alt="Rotaract Group"
          className="hero-image"
        />
        <div className="hero-content">
          <h1 className="hero-title">Rotaract Distrito 4465 - Perú</h1>
          <p className="hero-subtitle">
            Jóvenes líderes comprometidos con el servicio comunitario, el desarrollo profesional y la paz mundial.
          </p>
        </div>
      </section>

      <section className="about-section" id="quienes-somos">
        <div className="section-header">
          <h2 className="section-title">¿Quiénes somos?</h2>
        </div>
        <h3 className="about-main-title">Jóvenes líderes al servicio de la comunidad</h3>
        <p className="about-description">
          Rotaract es una organización mundial de jóvenes adultos patrocinada por Rotary International. En el Distrito 4465,
          que comprende Perú, somos más de 1,200 jóvenes comprometidos con el servicio comunitario, el desarrollo profesional y
          el liderazgo.
        </p>
      </section>

      <section className="dashboard-section">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/0dba76569d00dacf6aed0b2600488f02da40e002?width=2872"
          alt="Rotaract Activities"
          className="dashboard-background"
        />
        <h2 className="section-title-dark">Nuestro Impacto en Números</h2>
        <div className="impact-cards-grid">
          <div className="impact-card">
            <div className="impact-card-icon">👥</div>
            <div className="impact-card-content">
              <h3 className="impact-card-title">Miembros Activos</h3>
              <p className="impact-card-number">1,200+</p>
              <p className="impact-card-description">
                Jóvenes rotaractianos comprometidos con el cambio positivo en todo Perú, representando diversas profesiones y
                sectores.
              </p>
            </div>
          </div>

          <div className="impact-card">
            <div className="impact-card-icon">🏢</div>
            <div className="impact-card-content">
              <h3 className="impact-card-title">Clubes</h3>
              <p className="impact-card-number">45+</p>
              <p className="impact-card-description">
                Clubes distribuidos estratégicamente en el Distrito 4465, creando redes de servicio y generando cambio comunitario.
              </p>
            </div>
          </div>

          <div className="impact-card">
            <div className="impact-card-icon">🎯</div>
            <div className="impact-card-content">
              <h3 className="impact-card-title">Proyectos Anuales</h3>
              <p className="impact-card-number">150+</p>
              <p className="impact-card-description">
                Ejecutamos proyectos enfocados en las áreas de enfoque de Rotary, transformando realidades y generando impacto
                duradero.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="gallery-modern">
        <h2 className="section-title-dark">Galería de Impacto</h2>
        <p className="gallery-intro">
          Historias y proyectos destacados que muestran el cambio que generamos en nuestras comunidades.
        </p>

        <div className="gallery-modern-grid">
          <div className="gm-large">
            <img
              src="https://images.unsplash.com/photo-1509099836639-18ba87e3c3d6?w=1400&h=900&fit=crop"
              alt="Proyecto destacado"
            />
            <div className="gm-caption">
              <h3>Proyecto destacado</h3>
              <p>Transformando vidas en comunidades rurales</p>
            </div>
          </div>

          <div className="gm-column">
            <div className="gm-item">
              <img
                src="https://images.unsplash.com/photo-1520975685541-0a2f79e0b6c8?w=800&h=600&fit=crop"
                alt="Voluntariado"
              />
              <div className="gm-caption">Voluntariado — campañas de salud</div>
            </div>
            <div className="gm-item">
              <img
                src="https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=800&h=600&fit=crop"
                alt="Educación"
              />
              <div className="gm-caption">Educación — programas en escuelas</div>
            </div>
          </div>

          <div className="gm-column">
            <div className="gm-item">
              <img
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop"
                alt="Sostenibilidad"
              />
              <div className="gm-caption">Sostenibilidad — proyectos ambientales</div>
            </div>
            <div className="gm-item">
              <img
                src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=600&fit=crop"
                alt="Innovación"
              />
              <div className="gm-caption">Innovación — soluciones tecnológicas para comunidades</div>
            </div>
          </div>
        </div>
      </section>

      <section className="focus-areas" id="proyectos">
        <h2 className="section-title-dark">Áreas de Enfoque de Rotary</h2>
        <div className="focus-card-grid">
          {rotaryFocuses.map((focus) => (
            <article key={focus.title} className="focus-card">
              <div className="focus-card-icon">{focus.icon}</div>
              <h3 className="focus-card-title">{focus.title}</h3>
              <p className="focus-card-description">{focus.description}</p>
            </article>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
};

export default DashboardDistritalPage;
