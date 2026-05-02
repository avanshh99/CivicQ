import { loadPollingData, getNearestStations } from './src/services/pollingService.js';

async function run() {
  console.log('Starting load...');
  try {
    await loadPollingData();
    console.log('Done loading. Getting nearest...');
    const result = getNearestStations(17.546059, 80.612107, 5, 10);
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}
run();
