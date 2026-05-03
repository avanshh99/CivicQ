import fs from 'fs';
import path from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { createInterface } from 'readline';

/**
 * Converts the massive out.csv into a compact JSON-lines file (.jsonl)
 * Each line is one station: [lat, lng, "name", "state", "ac", "id"]
 * 
 * This avoids loading the entire dataset into memory.
 * Run: node scripts/compressPollingData.js
 */
async function compress() {
  const csvPath = path.resolve(process.cwd(), 'out.csv');
  const outPath = path.resolve(process.cwd(), 'polling_data.jsonl');

  if (!fs.existsSync(csvPath)) {
    console.error('out.csv not found in', process.cwd());
    process.exit(1);
  }

  console.log('Reading out.csv and writing polling_data.jsonl...');

  const rl = createInterface({
    input: createReadStream(csvPath, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  });

  const writer = createWriteStream(outPath, { encoding: 'utf8' });

  let isHeader = true;
  let count = 0;
  let skipped = 0;

  for await (const line of rl) {
    if (isHeader) { isHeader = false; continue; }
    if (!line) continue;

    const cleanLine = line.replace(/^"|"$/g, '');
    const cols = cleanLine.split('","');

    if (cols.length >= 7) {
      const lat = parseFloat(cols[3]);
      const lng = parseFloat(cols[4]);

      if (!isNaN(lat) && !isNaN(lng)) {
        const row = JSON.stringify([
          Math.round(lat * 10000) / 10000,
          Math.round(lng * 10000) / 10000,
          cols[6],        // name
          cols[0],        // state
          cols[2],        // ac
          cols[5] || ''   // id
        ]);
        writer.write(row + '\n');
        count++;
      } else {
        skipped++;
      }
    } else {
      skipped++;
    }
  }

  writer.end();
  await new Promise(resolve => writer.on('finish', resolve));

  const originalSize = fs.statSync(csvPath).size;
  const newSize = fs.statSync(outPath).size;
  
  console.log(`\nDone!`);
  console.log(`  Stations:      ${count.toLocaleString()} (skipped ${skipped})`);
  console.log(`  Original CSV:  ${(originalSize / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  Compact JSONL: ${(newSize / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  Reduction:     ${(100 - (newSize / originalSize * 100)).toFixed(0)}%`);
  console.log(`\nFile saved to: ${outPath}`);
}

compress();
