import { useRef, useState } from 'react';
import './Card.css';

export default function Card({ 
  children, 
  variant = 'bento', 
  glow = false,
  interactive = false,
  className = '',
  onClick,
  ariaLabel,
  role,
  ...props
}) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    if (glow) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      cardRef.current.style.setProperty('--mouse-x', `${x}%`);
      cardRef.current.style.setProperty('--mouse-y', `${y}%`);
    }

    if (interactive) {
      const rect = cardRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const rotateY = ((mouseX / width) - 0.5) * 10;
      const rotateX = ((mouseY / height) - 0.5) * -10;
      
      setStyle({
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
        transition: 'transform 0.1s ease'
      });
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setStyle({
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: 'transform 0.5s ease'
      });
    }
  };

  const classes = [
    'card',
    `card-${variant}`,
    glow && 'card-glow-enabled',
    interactive && 'card-interactive',
    className,
  ].filter(Boolean).join(' ');

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      ref={cardRef}
      className={classes}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      aria-label={ariaLabel}
      style={style}
      role={role || (onClick ? 'button' : undefined)}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {glow && <div className="card-glow-bg" aria-hidden="true" />}
      <div className="card-content">
        {children}
      </div>
    </Component>
  );
}
