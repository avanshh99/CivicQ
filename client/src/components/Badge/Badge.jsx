import './Badge.css';

/** Status badge */
export function Badge({ children, variant = 'primary', className = '' }) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
}

/** Gamification badge */
export function GameBadge({ icon, label, unlocked = false }) {
  return (
    <div
      className={`game-badge ${unlocked ? 'game-badge-unlocked' : 'game-badge-locked'}`}
      title={unlocked ? `Earned: ${label}` : `Locked: ${label}`}
      role="img"
      aria-label={`${label} badge — ${unlocked ? 'Unlocked' : 'Locked'}`}
    >
      <span className="game-badge-icon" aria-hidden="true">{icon}</span>
      <span className="game-badge-label">{label}</span>
    </div>
  );
}

/** Progress bar */
export function ProgressBar({ value = 0, max = 100, label = '' }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <div>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{label}</span>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className="progress-bar-container"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

/** Modal */
export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close dialog">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Badge;
