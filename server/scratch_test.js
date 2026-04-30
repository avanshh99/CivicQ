import { groq, isAIAvailable } from './src/config/groq.js';
import { getChatResponse } from './src/services/aiService.js';

async function test() {
  console.log('AI Available:', isAIAvailable());
  const res = await getChatResponse('who is leading the election?');
  console.log('Response:', res);
}

test();
