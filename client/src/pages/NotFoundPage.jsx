import { Link } from 'react-router-dom';
import Button from '../components/Button/Button.jsx';

export default function NotFoundPage() {
  return (
    <main
      style={{
        minHeight: 'calc(100vh - var(--navbar-height))',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--space-6)',
        gap: 'var(--space-6)',
      }}
      role="main"
      aria-label="Page not found"
    >
      <span style={{ fontSize: '6rem' }} aria-hidden="true">🏛️</span>
      <h1 style={{ fontSize: 'var(--text-5xl)', fontWeight: 800 }}>
        <span className="text-gradient">404</span>
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)', maxWidth: 400 }}>
        Looks like this page has been lost in the ballot box. Let&apos;s get you back on track.
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/"><Button variant="primary" icon="🏠">Go Home</Button></Link>
        <Link to="/chat"><Button variant="glass" icon="💬">Ask CivicQ</Button></Link>
      </div>
    </main>
  );
}
