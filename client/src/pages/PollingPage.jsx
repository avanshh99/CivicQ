import Card from '../components/Card/Card.jsx';
import './PollingPage.css';

export default function PollingPage() {
  return (
    <main className="polling-page" role="main" aria-label="Find Polling Stations">
      <header className="polling-header">
        <h1>
          <span className="heading-neuro">Find Your</span>{' '}
          <span className="text-gradient">Polling Station</span>
        </h1>
        <p className="polling-subtitle">
          Locate your nearest polling station using Google Maps. Enter your location or allow
          browser geolocation to find booths near you.
        </p>
      </header>

      <div className="polling-content">
        <Card variant="glass" className="polling-map-placeholder">
          <div className="polling-map-inner">
            <span className="polling-map-icon" aria-hidden="true">📍</span>
            <h3>Google Maps Integration</h3>
            <p>To enable the polling station finder, add your Google Maps API key to the environment variables.</p>
            <code className="polling-code">VITE_GOOGLE_MAPS_KEY=your_key_here</code>
            <p className="polling-note">
              Once configured, this section will show an interactive map with nearby polling stations,
              distances, and directions.
            </p>
          </div>
        </Card>

        <div className="polling-info-grid">
          <Card variant="bento" className="polling-info-card">
            <div className="polling-info-icon" aria-hidden="true">🪪</div>
            <h3>What to Bring</h3>
            <ul className="polling-list">
              <li>Voter ID Card (EPIC)</li>
              <li>Any approved photo ID</li>
              <li>Voter slip (if available)</li>
            </ul>
          </Card>
          <Card variant="bento" className="polling-info-card">
            <div className="polling-info-icon" aria-hidden="true">⏰</div>
            <h3>Polling Hours</h3>
            <ul className="polling-list">
              <li>Typically 7:00 AM - 6:00 PM</li>
              <li>Arrive early to avoid long queues</li>
              <li>If you're in line by closing, you can still vote</li>
            </ul>
          </Card>
          <Card variant="bento" className="polling-info-card">
            <div className="polling-info-icon" aria-hidden="true">♿</div>
            <h3>Accessibility</h3>
            <ul className="polling-list">
              <li>Wheelchair ramps at polling stations</li>
              <li>Braille-enabled EVMs available</li>
              <li>Assistance for elderly & disabled voters</li>
            </ul>
          </Card>
        </div>
      </div>
    </main>
  );
}
