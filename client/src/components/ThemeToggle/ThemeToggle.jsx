import { useContext } from 'react';
import { ThemeContext } from '../../store/ThemeContext.jsx';
import './ThemeToggle.css';

const THEME_ICONS = { light: '☀️', dark: '🌙', 'high-contrast': '👁️' };
const THEME_CYCLE = ['light', 'dark', 'high-contrast'];

export default function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);

  const cycleTheme = () => {
    const idx = THEME_CYCLE.indexOf(theme);
    const next = THEME_CYCLE[(idx + 1) % THEME_CYCLE.length];
    setTheme(next);
  };

  return (
    <button
      className="theme-toggle"
      onClick={cycleTheme}
      aria-label={`Current theme: ${theme}. Click to switch.`}
      title={`Theme: ${theme}`}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {THEME_ICONS[theme] || '☀️'}
      </span>
    </button>
  );
}
