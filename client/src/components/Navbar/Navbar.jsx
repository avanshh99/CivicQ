import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ThemeToggle from '../ThemeToggle/ThemeToggle.jsx';
import './Navbar.css';

const NAV_ITEMS = [
  { path: '/', labelKey: 'nav.home', icon: '🏠' },
  { path: '/chat', labelKey: 'nav.chat', icon: '💬' },
  { path: '/walkthrough', labelKey: 'nav.walkthrough', icon: '📖' },
  { path: '/timeline', labelKey: 'nav.timeline', icon: '📅' },
  { path: '/scenarios', labelKey: 'nav.scenarios', icon: '🔮' },
  { path: '/polling', labelKey: 'nav.polling', icon: '📍' },
  { path: '/registration', labelKey: 'nav.registration', icon: '📝' },
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'mr', name: 'मराठी' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'kn', name: 'ಕನ್ನಡ' }
];

export default function Navbar({ user, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

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
            {t(item.labelKey)}
          </Link>
        ))}
      </div>

      <div className="navbar-actions">
        <select 
          className="language-selector"
          value={i18n.language.split('-')[0]}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          aria-label={t('nav.language')}
          title={t('nav.language')}
        >
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>

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
          <Link to="/login" className="btn btn-primary btn-sm">{t('nav.signIn')}</Link>
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
            <span aria-hidden="true">{item.icon}</span> {t(item.labelKey)}
          </Link>
        ))}
      </div>
    </nav>
  );
}
