import { Link } from 'react-router-dom';
import Button from '../components/Button/Button.jsx';
import Card from '../components/Card/Card.jsx';
import './HomePage.css';

const FEATURES = [
  { icon: '💬', title: 'AI Chat Assistant', desc: 'Ask anything about elections. Get clear, accurate answers powered by AI with follow-up support.', color: 'primary', large: true },
  { icon: '📖', title: 'Step-by-Step Guide', desc: 'Walk through the entire election process from registration to results.', color: 'secondary' },
  { icon: '📅', title: 'Interactive Timeline', desc: 'Visual election timelines with key dates, deadlines, and milestones.', color: 'tertiary' },
  { icon: '🔮', title: 'Scenario Simulator', desc: '"What if I miss registration?" Explore real scenarios and consequences.', color: 'primary' },
  { icon: '📍', title: 'Polling Finder', desc: 'Find your nearest polling station with Google Maps integration.', color: 'secondary', large: true },
  { icon: '🏆', title: 'Track Progress', desc: 'Earn badges as you learn. Track your civic knowledge journey.', color: 'tertiary' },
];

const STATS = [
  { value: '900M+', label: 'Voters in India' },
  { value: '1M+', label: 'Polling Stations' },
  { value: '543', label: 'Constituencies' },
  { value: '2,600+', label: 'Political Parties' },
];

export default function HomePage() {
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
            <span>AI-Powered Election Assistant</span>
          </div>

          <h1 id="hero-title" className="hero-title">
            Understand Elections<br />
            <span className="hero-title-accent">Like Never Before</span>
          </h1>

          <p className="hero-subtitle">
            Your intelligent guide to the democratic process. Learn about voter registration,
            voting procedures, timelines, and more — all in simple, clear language.
          </p>

          <div className="hero-actions">
            <Link to="/chat">
              <Button variant="neuro" size="lg" icon="💬">
                Ask CivicQ
              </Button>
            </Link>
            <Link to="/walkthrough">
              <Button variant="glass" size="lg" icon="📖">
                Start Learning
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section" aria-labelledby="features-title">
        <h2 id="features-title" className="features-section-title heading-neuro">
          Everything You Need
        </h2>
        <p className="features-section-subtitle">
          Interactive tools designed to make civic education accessible and engaging for everyone.
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
          <h2 id="cta-title">Ready to Become a Civic Expert?</h2>
          <p>Start your journey to understanding democracy. Ask questions, explore timelines, and earn your civic badges.</p>
          <Link to="/chat">
            <Button variant="glass" size="lg" icon="🚀">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
