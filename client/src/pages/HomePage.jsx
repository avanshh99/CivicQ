import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../components/Button/Button.jsx';
import Card from '../components/Card/Card.jsx';
import './HomePage.css';

export default function HomePage() {
  const { t } = useTranslation();

  const FEATURES = [
    { icon: '💬', title: t('home.features.f1Title'), desc: t('home.features.f1Desc'), color: 'primary', large: true },
    { icon: '📖', title: t('home.features.f2Title'), desc: t('home.features.f2Desc'), color: 'secondary' },
    { icon: '📅', title: t('home.features.f3Title'), desc: t('home.features.f3Desc'), color: 'tertiary' },
    { icon: '🔮', title: t('home.features.f4Title'), desc: t('home.features.f4Desc'), color: 'primary' },
    { icon: '📍', title: t('home.features.f5Title'), desc: t('home.features.f5Desc'), color: 'secondary', large: true },
    { icon: '🏆', title: t('home.features.f6Title'), desc: t('home.features.f6Desc'), color: 'tertiary' },
  ];

  const STATS = [
    { value: t('home.stats.s1Value'), label: t('home.stats.s1Label') },
    { value: t('home.stats.s2Value'), label: t('home.stats.s2Label') },
    { value: t('home.stats.s3Value'), label: t('home.stats.s3Label') },
    { value: t('home.stats.s4Value'), label: t('home.stats.s4Label') },
  ];

  return (
    <main className="home">
      {/* Hero */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-floats" aria-hidden="true">
          <span className="hero-float">🗳️</span>
          <span className="hero-float">📋</span>
          <span className="hero-float">🏛️</span>
          <span className="hero-float">📊</span>
          <span className="hero-float">✅</span>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span>🏛️</span>
            <span>{t('home.heroBadge')}</span>
          </div>

          <h1 id="hero-title" className="hero-title">
            {t('home.heroTitle1')}<br />
            <span className="hero-title-accent">{t('home.heroTitle2')}</span>
          </h1>

          <p className="hero-subtitle">
            {t('home.heroSubtitle')}
          </p>

          <div className="hero-actions">
            <Link to="/chat">
              <Button variant="neuro" size="lg" icon="💬">
                {t('home.askBtn')}
              </Button>
            </Link>
            <Link to="/walkthrough">
              <Button variant="glass" size="lg" icon="📖">
                {t('home.startBtn')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section" aria-labelledby="features-title">
        <h2 id="features-title" className="features-section-title heading-neuro">
          {t('home.featuresTitle')}
        </h2>
        <p className="features-section-subtitle">
          {t('home.featuresSubtitle')}
        </p>

        <div className="features-bento stagger-children">
          {FEATURES.map((f, i) => (
            <Card
              key={i}
              variant="bento"
              glow
              className={`feature-card animate-fade-in-up ${f.large ? 'feature-card-large' : ''}`}
            >
              <div className={`feature-card-icon feature-card-icon-${f.color}`} aria-hidden="true">
                {f.icon}
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section" aria-label="Election statistics">
        <div className="stats-grid stagger-children">
          {STATS.map((s, i) => (
            <Card key={i} variant="glass" className="stat-card animate-fade-in-up">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" aria-labelledby="cta-title">
        <div className="cta-card">
          <h2 id="cta-title">{t('home.ctaTitle')}</h2>
          <p>{t('home.ctaDesc')}</p>
          <Link to="/chat">
            <Button variant="glass" size="lg" icon="🚀">
              {t('home.ctaBtn')}
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
