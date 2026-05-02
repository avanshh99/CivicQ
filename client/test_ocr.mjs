import { createWorker } from 'tesseract.js';
import { existsSync } from 'fs';

const imagePath = process.argv[2];

if (!imagePath) {
  console.error('\n❌  Usage: node test_ocr.mjs <path-to-image>');
  console.error('   Example: node test_ocr.mjs "C:\\Users\\avans\\Desktop\\aadhar.jpg"\n');
  process.exit(1);
}

if (!existsSync(imagePath)) {
  console.error(`\n❌  File not found: ${imagePath}\n`);
  process.exit(1);
}

console.log(`\n📄 File     : ${imagePath}`);
console.log('⏳ Starting Tesseract (this takes ~15-30s first run)...\n');

const worker = await createWorker('eng', 3, {
  logger: (m) => {
    const bar = Math.round((m.progress || 0) * 20);
    process.stdout.write(
      `\r[${('█'.repeat(bar)).padEnd(20)}] ${m.status} ${Math.round((m.progress || 0) * 100)}%   `
    );
  }
});

const { data: { text, confidence } } = await worker.recognize(imagePath);
await worker.terminate();

console.log('\n\n══════════════════════════════════════');
console.log('  ✅ TESSERACT RESULT');
console.log('══════════════════════════════════════');
console.log(`  Confidence : ${confidence.toFixed(1)}%`);
console.log('  Extracted  :');
console.log('──────────────────────────────────────');
console.log(text.trim() || '(no text extracted — try a clearer image)');
console.log('══════════════════════════════════════\n');
