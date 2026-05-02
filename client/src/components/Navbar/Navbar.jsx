import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle/ThemeToggle.jsx';
import './Navbar.css';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/chat', label: 'Ask CivicQ', icon: '💬' },
  { path: '/walkthrough', label: 'Learn', icon: '📖' },
  { path: '/timeline', label: 'Timeline', icon: '📅' },
  { path: '/scenarios', label: 'Scenarios', icon: '🔮' },
  { path: '/polling', label: 'Polling', icon: '📍' },
  { path: '/registration', label: 'Registration Hub', icon: '📝' },
];

export default function Navbar({ user, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <Link to="/" className="navbar-brand" aria-label="CivicQ Home">
        <div className="navbar-logo" aria-hidden="true">🏛️</div>
        <span>CivicQ</span>
      </Link>

      <div className="navbar-links">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`navbar-link ${isActive(item.path) ? 'active' : ''}`}
            aria-current={isActive(item.path) ? 'page' : undefined}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="navbar-actions">
        <ThemeToggle />
        {user ? (
          <button
            className="navbar-user"
            onClick={onLogout}
            aria-label={`Logged in as ${user.displayName || user.email}. Click to logout.`}
            title="Logout"
          >
            {(user.displayName || user.email || 'U')[0].toUpperCase()}
          </button>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm">Sign In</Link>
        )}
      </div>

      <button
        className={`navbar-hamburger ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle mobile menu"
        aria-expanded={mobileOpen}
      >
        <span /><span /><span />
      </button>

      <div className={`navbar-mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`navbar-mobile-link ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <span aria-hidden="true">{item.icon}</span> {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
