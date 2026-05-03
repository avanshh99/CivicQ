import { useTranslation } from 'react-i18next';
import Timeline from '../components/Timeline/Timeline.jsx';
import { ELECTION_TIMELINE } from '../data/electionData.js';
import './TimelinePage.css';

export default function TimelinePage() {
  const { t } = useTranslation();

  return (
    <main className="timeline-page" role="main" aria-label="Election Timeline">
      <header className="timeline-header">
        <h1>
          <span className="heading-neuro">{t('timelinePage.title')}</span>{' '}
          <span className="text-gradient">{t('timelinePage.titleAccent')}</span>
        </h1>
        <p className="timeline-subtitle">
          {t('timelinePage.subtitle')}
        </p>
      </header>

      <div className="timeline-container">
        <Timeline milestones={ELECTION_TIMELINE} />
      </div>

      <div className="timeline-legend">
        <div className="legend-item">
          <span className="legend-dot legend-completed" />
          <span>{t('timelinePage.legendCompleted')}</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot legend-active" />
          <span>{t('timelinePage.legendActive')}</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot legend-upcoming" />
          <span>{t('timelinePage.legendUpcoming')}</span>
        </div>
      </div>
    </main>
  );
}
