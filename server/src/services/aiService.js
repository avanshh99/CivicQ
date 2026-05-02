import { groq, isAIAvailable } from '../config/groq.js';
import { SYSTEM_PROMPT, ELI5_WRAPPER, DETAILED_WRAPPER, SCENARIO_PROMPT } from '../prompts/templates.js';

/**
 * In-memory cache for common responses
 */
const responseCache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function getCacheKey(message) {
  return message.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Get AI chat response
 */
export async function getChatResponse(message, options = {}) {
  const { mode = 'normal', history = [] } = options;

  // Check cache first
  const cacheKey = getCacheKey(message);
  const cached = responseCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.response;
  }

  if (!isAIAvailable()) {
    return getFallbackResponse(message);
  }

  try {
    // Build prompt based on mode
    let userPrompt = message;
    if (mode === 'eli5') {
      userPrompt = ELI5_WRAPPER(message);
    } else if (mode === 'detailed') {
      userPrompt = DETAILED_WRAPPER(message);
    }

    // Prepare Groq messages
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      })),
      { role: 'user', content: userPrompt }
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 2048,
    });

    const response = chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    // Cache the response
    responseCache.set(cacheKey, { response, timestamp: Date.now() });

    // Evict old cache entries
    if (responseCache.size > 500) {
      const oldest = [...responseCache.entries()]
        .sort((a, b) => a[1].timestamp - b[1].timestamp)
        .slice(0, 100);
      oldest.forEach(([key]) => responseCache.delete(key));
    }

    return response;
  } catch (error) {
    console.error('[Groq Error]', error.message);
    return getFallbackResponse(message);
  }
}

/**
 * Get scenario simulation response
 */
export async function getScenarioResponse(scenario, country = 'India') {
  if (!isAIAvailable()) {
    return getFallbackResponse(scenario);
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: SCENARIO_PROMPT(scenario, country) }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
    });
    return chatCompletion.choices[0]?.message?.content || "Scenario analysis unavailable.";
  } catch (error) {
    console.error('[Groq Scenario Error]', error.message);
    return getFallbackResponse(scenario);
  }
}

/**
 * Fallback responses when Groq is unavailable
 */
function getFallbackResponse(query) {
  const q = query.toLowerCase();

  if (q.includes('register')) {
    return `## 📋 Voter Registration\n\nTo register as a voter:\n1. **Check eligibility** — Must be 18+ and a citizen\n2. **Gather documents** — ID proof, address proof, photos\n3. **Apply online or offline** — Visit the Election Commission website or local office\n4. **Verification** — A Booth Level Officer may visit\n\n⏰ **Deadline:** Registration closes ~2-3 weeks before election day.`;
  }
  if (q.includes('vote') || q.includes('voting')) {
    return `## 🗳️ Voting Process\n\n1. Find your polling station\n2. Carry valid ID\n3. Queue up and get verified\n4. Receive indelible ink mark\n5. Cast vote on EVM\n6. Verify on VVPAT slip\n\n**Your vote is secret and secure!**`;
  }
  if (q.includes('count') || q.includes('result')) {
    return `## 🔢 Vote Counting\n\nEVMs are sealed and stored securely after polling. On counting day, they're opened under multi-party observation. Votes are tallied round by round, with VVPAT verification of random samples.`;
  }

  return `Great question! The election process involves several key stages:\n\n1. **📋 Registration** — Eligible citizens register as voters\n2. **📝 Nominations** — Candidates file nomination papers\n3. **📣 Campaigning** — Candidates present their platforms\n4. **🗳️ Voting** — Citizens cast their ballots\n5. **🔢 Counting** — Votes are tallied securely\n6. **📊 Results** — Winners are declared\n\nI can explain any of these in detail. What interests you most?`;
}
