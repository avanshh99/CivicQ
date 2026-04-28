import { useRef } from 'react';
import './Button.css';

/**
 * Button — Multi-variant button with ripple effect
 * Variants: primary, secondary, ghost, glass, neuro
 * Sizes: sm, md (default), lg
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ariaLabel,
  ...props
}) {
  const btnRef = useRef(null);

  const handleClick = (e) => {
    if (loading || disabled) return;

    // Ripple effect
    const btn = btnRef.current;
    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.className = 'btn-ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    btn.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);

    onClick?.(e);
  };

  const sizeClass = size !== 'md' ? `btn-${size}` : '';
  const classes = [
    'btn',
    `btn-${variant}`,
    sizeClass,
    loading ? 'btn-loading' : '',
    icon && !children ? 'btn-icon' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={btnRef}
      className={classes}
      onClick={handleClick}
      disabled={disabled || loading}
      type={type}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      aria-busy={loading}
      {...props}
    >
      {loading && <span className="btn-spinner" aria-hidden="true" />}
      {!loading && icon && <span className="btn-icon-left" aria-hidden="true">{icon}</span>}
      {children}
      {!loading && iconRight && <span className="btn-icon-right" aria-hidden="true">{iconRight}</span>}
    </button>
  );
}
