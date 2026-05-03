import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Card from '../components/Card/Card.jsx';
import Button from '../components/Button/Button.jsx';
import './PollingPage.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom purple icon for polling stations
const purpleIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to dynamically update map center
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function PollingPage() {
  const { t } = useTranslation();
  const [location, setLocation] = useState([20.5937, 78.9629]); // Default to India center
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasLocation, setHasLocation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchStations = async (lat, lng) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/polling/nearby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng }),
      });
      const data = await res.json();
      setStations(data.stations || []);
    } catch (error) {
      console.error('Failed to fetch stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newLat = parseFloat(lat);
        const newLon = parseFloat(lon);
        setLocation([newLat, newLon]);
        setHasLocation(true);
        fetchStations(newLat, newLon);
      } else {
        alert('Location not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      alert('Failed to search location. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  const locateUser = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation([latitude, longitude]);
        setHasLocation(true);
        fetchStations(latitude, longitude);
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to retrieve your location. Please check your browser permissions.');
        setLoading(false);
      }
    );
  };

  return (
    <main className="polling-page" role="main" aria-label="Find Polling Stations">
      <header className="polling-header">
        <h1>
          <span className="heading-neuro">{t('pollingPage.title')}</span>{' '}
          <span className="text-gradient">{t('pollingPage.titleAccent')}</span>
        </h1>
        <p className="polling-subtitle">
          {t('pollingPage.subtitle')}
        </p>

        <form className="polling-search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder={t('pollingPage.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={searchLoading || loading}
          />
          <Button 
            type="submit" 
            variant="primary" 
            disabled={searchLoading || loading || !searchQuery.trim()}
          >
            {searchLoading ? t('pollingPage.searchingBtn') : t('pollingPage.searchBtn')}
          </Button>
        </form>

        <div className="polling-actions">
          {!hasLocation && (
            <Button variant="secondary" onClick={locateUser} disabled={loading || searchLoading}>
              {loading ? t('pollingPage.locatingBtn') : t('pollingPage.useLocationBtn')}
            </Button>
          )}
        </div>
      </header>

      <div className="polling-content">
        <Card variant="glass" className="polling-map-container">
          <MapContainer 
            center={location} 
            zoom={hasLocation ? 14 : 4} 
            scrollWheelZoom={true} 
            style={{ height: '500px', width: '100%', borderRadius: 'var(--radius-lg)', zIndex: 1 }}
          >
            <ChangeView center={location} zoom={hasLocation ? 14 : 4} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {hasLocation && (
              <Marker position={location}>
                <Popup>
                  <strong>You are here</strong>
                </Popup>
              </Marker>
            )}
            {stations.map((station) => (
              <Marker key={station.id} position={[station.lat, station.lng]} icon={purpleIcon}>
                <Popup>
                  <div className="station-popup">
                    <strong>{station.name}</strong><br/>
                    {station.address}<br/>
                    <em>Distance: {station.distance}</em><br/>
                    <span style={{ color: station.accessible ? 'green' : 'red' }}>
                      {station.accessible ? '♿ Accessible' : '⚠️ Not Accessible'}
                    </span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Card>

        <div className="polling-info-grid">
          <Card variant="bento" className="polling-info-card">
            <div className="polling-info-icon" aria-hidden="true">🪪</div>
            <h3>{t('pollingPage.whatToBring')}</h3>
            <ul className="polling-list">
              <li>Voter ID Card (EPIC)</li>
              <li>Any approved photo ID</li>
              <li>Voter slip (if available)</li>
            </ul>
          </Card>
          <Card variant="bento" className="polling-info-card">
            <div className="polling-info-icon" aria-hidden="true">⏰</div>
            <h3>{t('pollingPage.pollingHours')}</h3>
            <ul className="polling-list">
              <li>Typically 7:00 AM - 6:00 PM</li>
              <li>Arrive early to avoid long queues</li>
              <li>If you're in line by closing, you can still vote</li>
            </ul>
          </Card>
          <Card variant="bento" className="polling-info-card">
            <div className="polling-info-icon" aria-hidden="true">♿</div>
            <h3>{t('pollingPage.accessibility')}</h3>
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
