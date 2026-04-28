import { useRef } from 'react';
import './Card.css';

/**
 * Card — Multi-variant card component
 * Variants: default, glass, bento, neuro
 */
export default function Card({
  children,
  variant = 'glass',
  interactive = false,
  className = '',
  glow = false,
  onClick,
  ariaLabel,
  role,
  ...props
}) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!glow || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty('--mouse-x', `${x}%`);
    cardRef.current.style.setProperty('--mouse-y', `${y}%`);
  };

  const classes = [
    'card',
    variant !== 'default' ? `card-${variant}` : '',
    interactive ? 'card-interactive' : '',
    glow ? 'card-glow' : '',
    className,
  ].filter(Boolean).join(' ');

  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      ref={cardRef}
      className={classes}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      role={role || (onClick ? 'button' : undefined)}
      aria-label={ariaLabel}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {children}
    </Tag>
  );
}

/* Sub-components */
export function CardHeader({ children, className = '' }) {
  return <div className={`card-header ${className}`}>{children}</div>;
}

export function CardIcon({ children, color = 'primary', className = '' }) {
  return (
    <div className={`card-icon card-icon-${color} ${className}`} aria-hidden="true">
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={`card-title ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = '' }) {
  return <p className={`card-description ${className}`}>{children}</p>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={`card-footer ${className}`}>{children}</div>;
}
