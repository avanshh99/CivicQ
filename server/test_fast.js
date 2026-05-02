import fs from 'fs';
import path from 'path';

function loadFast() {
  console.time('Read file');
  const csvPath = path.resolve(process.cwd(), 'out.csv');
  const content = fs.readFileSync(csvPath, 'utf8');
  console.timeEnd('Read file');

  console.time('Split lines');
  const lines = content.split('\n');
  console.timeEnd('Split lines');

  console.time('Parse data');
  const stations = [];
  // Skip header (i=0)
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i]) continue;
    // Format: "State","District","AC","Latitude","Longitude","PSNumber","PSName","WebURL"
    // Regex or split? Fast split by '","'
    // A typical line: "Telangana","Khammam","Aswaraopeta ","17.381287","80.709979","30","ABBUGUDEM","http..."
    
    // Quick and dirty parser
    const cleanLine = lines[i].replace(/^"|"$/g, ''); // remove start/end quotes
    const cols = cleanLine.split('","');
    
    if (cols.length >= 7) {
      const lat = parseFloat(cols[3]);
      const lng = parseFloat(cols[4]);
      if (!isNaN(lat) && !isNaN(lng)) {
        stations.push({
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
  console.timeEnd('Parse data');
  console.log('Loaded', stations.length);
}

loadFast();
