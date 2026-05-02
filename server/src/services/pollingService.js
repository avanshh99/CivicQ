import fs from 'fs';
import path from 'path';

// In-memory store for polling stations
// Storing simplified objects to save RAM: { id, lat, lng, name, state, ac }
let pollingStations = [];
let isDataLoaded = false;

/**
 * Calculate distance between two coordinates in miles using Haversine formula
 */
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Radius of the earth in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; 
}

/**
 * Load CSV data into memory extremely fast using string splitting
 */
export async function loadPollingData() {
  if (isDataLoaded) return;
  
  const csvPath = path.resolve(process.cwd(), 'out.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.warn('⚠️  out.csv not found. Polling map will use empty data.');
    return;
  }

  console.log('⏳ Loading polling stations from out.csv into memory...');
  
  try {
    // Read entire file synchronously (takes ~1-2 seconds for 140MB)
    const content = fs.readFileSync(csvPath, 'utf8');
    const lines = content.split('\n');
    
    // Fast parse without heavy dependencies
    // Format: "State","District","AC","Latitude","Longitude","PSNumber","PSName","WebURL"
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i]) continue;
      
      const cleanLine = lines[i].replace(/^"|"$/g, '');
      const cols = cleanLine.split('","');
      
      if (cols.length >= 7) {
        const lat = parseFloat(cols[3]);
        const lng = parseFloat(cols[4]);
        
        if (!isNaN(lat) && !isNaN(lng)) {
          pollingStations.push({
            id: cols[5] || i.toString(),
            lat,
            lng,
            state: cols[0],
            ac: cols[2],
            name: cols[6]
          });
        }
      }
    }
    
    isDataLoaded = true;
    console.log(`✅ Successfully loaded ${pollingStations.length} polling stations.`);
  } catch (error) {
    console.error('❌ Error loading CSV data:', error);
  }
}

/**
 * Get nearest stations to a coordinate
 * @param {number} userLat 
 * @param {number} userLng 
 * @param {number} limit Max number of stations to return
 * @param {number} maxDistanceMiles Max search radius in miles
 */
export function getNearestStations(userLat, userLng, limit = 20, maxDistanceMiles = 50) {
  if (!isDataLoaded) return [];

  // Calculate distances and filter simultaneously to save memory
  const nearby = [];
  for (let i = 0; i < pollingStations.length; i++) {
    const station = pollingStations[i];
    const distance = getDistance(userLat, userLng, station.lat, station.lng);
    if (distance <= maxDistanceMiles) {
      nearby.push({ ...station, distance });
    }
  }

  // Sort by distance
  nearby.sort((a, b) => a.distance - b.distance);

  // Return the closest ones, formatted for the frontend
  return nearby.slice(0, limit).map(s => ({
    id: s.id,
    name: s.name,
    address: `${s.ac}, ${s.state}`,
    lat: s.lat,
    lng: s.lng,
    distance: s.distance < 1 ? `${(s.distance * 5280).toFixed(0)} feet` : `${s.distance.toFixed(1)} miles`,
    accessible: true // Assume true for demo purposes
  }));
}
