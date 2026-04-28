import Timeline from '../components/Timeline/Timeline.jsx';
import { ELECTION_TIMELINE } from '../data/electionData.js';
import './TimelinePage.css';

export default function TimelinePage() {
  return (
    <main className="timeline-page" role="main" aria-label="Election Timeline">
      <header className="timeline-header">
        <h1>
          <span className="heading-neuro">Election</span>{' '}
          <span className="text-gradient">Timeline</span>
        </h1>
        <p className="timeline-subtitle">
          Follow the complete election journey from announcement to government formation.
          Click on any milestone to learn more.
        </p>
      </header>

      <div className="timeline-container">
        <Timeline milestones={ELECTION_TIMELINE} />
      </div>

      <div className="timeline-legend">
        <div className="legend-item">
          <span className="legend-dot legend-completed" />
          <span>Completed</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot legend-active" />
          <span>Current Phase</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot legend-upcoming" />
          <span>Upcoming</span>
        </div>
      </div>
    </main>
  );
}
