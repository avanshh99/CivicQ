import { useState } from 'react';
import './Timeline.css';

/**
 * Timeline — Vertical timeline with expandable milestones
 */
export default function Timeline({ milestones = [], orientation = 'vertical' }) {
  const [expanded, setExpanded] = useState(null);

  const getStatus = (milestone) => {
    if (milestone.status) return milestone.status;
    const now = new Date();
    const date = new Date(milestone.date);
    if (date < now) return 'completed';
    return 'upcoming';
  };

  return (
    <div
      className={orientation === 'horizontal' ? 'timeline-horizontal' : 'timeline'}
      role="list"
      aria-label="Election Timeline"
    >
      {milestones.map((milestone, idx) => {
        const status = getStatus(milestone);
        const isExpanded = expanded === idx;

        return (
          <div
            key={idx}
            className="timeline-item"
            role="listitem"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div
              className={`timeline-node timeline-node-${status}`}
              aria-hidden="true"
            >
              {milestone.icon || (status === 'completed' ? '✓' : idx + 1)}
            </div>

            <div
              className="timeline-card"
              onClick={() => setExpanded(isExpanded ? null : idx)}
              onKeyDown={(e) => e.key === 'Enter' && setExpanded(isExpanded ? null : idx)}
              role="button"
              tabIndex={0}
              aria-expanded={isExpanded}
              aria-label={`${milestone.title} - ${milestone.date}`}
            >
              <div className="timeline-card-date">{milestone.date}</div>
              <div className="timeline-card-title">{milestone.title}</div>
              <div className="timeline-card-description">{milestone.summary}</div>

              {isExpanded && milestone.details && (
                <div className="timeline-card-expanded">
                  {milestone.details}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
