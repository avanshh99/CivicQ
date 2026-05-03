import fs from 'fs';
import path from 'path';
import { createReadStream } from 'fs';
import { createInterface } from 'readline';

// In-memory store for polling stations
// Using typed arrays for lat/lng to save RAM, and separate arrays for metadata
let lats = null;
let lngs = null;
let names = [];
let states = [];
let acs = [];
let ids = [];
let stationCount = 0;
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
 * Load compressed JSONL data into memory using streaming.
 */
export async function loadPollingData() {
  if (isDataLoaded) return;
  
  const jsonlPath = path.resolve(process.cwd(), 'polling_data.jsonl');
  
  if (!fs.existsSync(jsonlPath)) {
    console.warn('⚠️  polling_data.jsonl not found. Polling map will use empty data.');
    return;
  }

  console.log('Loading polling stations from polling_data.jsonl (streaming)...');
  
  const tempData = [];
  try {
    const rl = createInterface({
      input: createReadStream(jsonlPath, { encoding: 'utf8' }),
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      if (!line) continue;
      try {
        const [lat, lng, name, state, ac, id] = JSON.parse(line);
        tempData.push({ lat, lng, name, state, ac, id });
      } catch (e) {
        // Skip malformed lines
      }
    }

    const lineCount = tempData.length;
    // Allocate typed arrays for coordinates (4 bytes each instead of 8)
    lats = new Float32Array(lineCount);
    lngs = new Float32Array(lineCount);
    names = new Array(lineCount);
    states = new Array(lineCount);
    acs = new Array(lineCount);
    ids = new Array(lineCount);

    for (let i = 0; i < lineCount; i++) {
      lats[i] = tempData[i].lat;
      lngs[i] = tempData[i].lng;
      names[i] = tempData[i].name;
      states[i] = tempData[i].state;
      acs[i] = tempData[i].ac;
      ids[i] = tempData[i].id;
    }

    // Free the temporary parsed data
    tempData.length = 0;

    stationCount = lineCount;
    isDataLoaded = true;
    console.log(`Successfully loaded ${stationCount} polling stations.`);
  } catch (error) {
    console.error('❌ Error loading polling data:', error);
  }
}

/**
 * Get nearest stations to a coordinate
 */
export function getNearestStations(userLat, userLng, limit = 20, maxDistanceMiles = 50) {
  if (!isDataLoaded) return [];

  const nearby = [];
  for (let i = 0; i < stationCount; i++) {
    const distance = getDistance(userLat, userLng, lats[i], lngs[i]);
    if (distance <= maxDistanceMiles) {
      nearby.push({
        id: ids[i],
        name: names[i],
        state: states[i],
        ac: acs[i],
        lat: lats[i],
        lng: lngs[i],
        distance
      });
    }
  }

  nearby.sort((a, b) => a.distance - b.distance);

  return nearby.slice(0, limit).map(s => ({
    id: s.id,
    name: s.name,
    address: `${s.ac}, ${s.state}`,
    lat: s.lat,
    lng: s.lng,
    distance: s.distance < 1 ? `${(s.distance * 5280).toFixed(0)} feet` : `${s.distance.toFixed(1)} miles`,
    accessible: true
  }));
}
