import fs from 'fs';
import path from 'path';

const API_KEY = "02f4208ae4msh8a4b4f15df6ab3dp1d4bf9jsn303bdecf623d"; // User's rapidAPI key
const API_URL = "https://openl-translate.p.rapidapi.com/translate/bulk";

// Target languages user requested
const TARGET_LANGS = ['hi', 'mr', 'gu', 'kn'];

async function translateBulk(texts, targetLang) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'openl-translate.p.rapidapi.com',
        'x-rapidapi-key': API_KEY
      },
      body: JSON.stringify({
        target_lang: targetLang,
        text: texts
      })
    });

    if (!response.ok) {
      throw new Error(`API error ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    return data.translatedTexts;
  } catch (error) {
    console.error(`Error translating to ${targetLang}:`, error);
    return null;
  }
}

// Helper to split array into chunks of 3
function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

async function run() {
  const localesDir = path.join(process.cwd(), 'src', 'locales');
  const enPath = path.join(localesDir, 'en.json');
  
  if (!fs.existsSync(enPath)) {
    console.error(`Cannot find en.json at ${enPath}`);
    process.exit(1);
  }

  const enDict = JSON.parse(fs.readFileSync(enPath, 'utf8'));

  const flatDict = {};
  const valuesToTranslate = [];
  let index = 0;

  function traverse(obj, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object') {
        traverse(value, prefix + key + '.');
      } else {
        flatDict[prefix + key] = { value, index: index++ };
        valuesToTranslate.push(value);
      }
    }
  }

  traverse(enDict);
  console.log(`Found ${valuesToTranslate.length} strings to translate.`);

  for (const lang of TARGET_LANGS) {
    console.log(`\nTranslating to ${lang}...`);
    
    // Batch into chunks of 3 for RapidAPI limit
    const chunks = chunkArray(valuesToTranslate, 3);
    const translatedArray = [];

    for (let i = 0; i < chunks.length; i++) {
      console.log(`  Processing batch ${i + 1}/${chunks.length}...`);
      const res = await translateBulk(chunks[i], lang);
      if (!res) {
        console.error(`  Batch failed!`);
        break;
      }
      translatedArray.push(...res);
      // Wait 1 second between batches to avoid rate limits
      await new Promise(r => setTimeout(r, 1000));
    }
    
    if (translatedArray.length !== valuesToTranslate.length) {
      console.error(`Failed to get full translation for ${lang}.`);
      fs.writeFileSync(path.join(localesDir, `${lang}.json`), JSON.stringify({}, null, 2));
      continue;
    }

    const newDict = {};
    for (const [pathKey, data] of Object.entries(flatDict)) {
      const parts = pathKey.split('.');
      let current = newDict;
      for (let i = 0; i < parts.length - 1; i++) {
        current[parts[i]] = current[parts[i]] || {};
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = translatedArray[data.index];
    }

    const outPath = path.join(localesDir, `${lang}.json`);
    fs.writeFileSync(outPath, JSON.stringify(newDict, null, 2));
    console.log(`Saved ${outPath}`);
  }

  console.log('\nAll translations complete!');
}

run();
