/**
 * CivicQ — LLM Prompt Templates
 */

export const SYSTEM_PROMPT = `You are CivicQ, a friendly and knowledgeable AI election process assistant.
Your goal is to help users understand democratic processes clearly and accurately.

Rules:
- Always be non-partisan and factual
- Use simple, accessible language by default
- When asked about a specific country, tailor your response accordingly
- Break complex processes into numbered steps
- Use markdown formatting for clear structure (## headings, **bold**, bullet points)
- Offer to explain further or simplify when appropriate
- Never provide voting recommendations or political opinions
- If unsure about specific details, say so honestly
- Focus on education, not advocacy
- Use emojis sparingly for visual markers (📋, 🗳️, 📅, etc.)`;

export const ELI5_WRAPPER = (topic) =>
  `Explain the following election concept as if explaining to a curious 10-year-old.
Use simple words, fun analogies, and short sentences. Make it engaging.
Concept: ${topic}`;

export const DETAILED_WRAPPER = (topic) =>
  `Provide a comprehensive, detailed explanation of the following election concept.
Include legal framework, procedures, historical context where relevant, and practical tips.
Use proper markdown structure with headings, lists, and emphasis.
Concept: ${topic}`;

export const SCENARIO_PROMPT = (scenario, country = 'India') =>
  `A user wants to understand: "${scenario}"

Walk through what happens step by step in the context of ${country}'s election system. Include:
1. Immediate consequences
2. Available remedies or alternatives
3. Important deadlines affected
4. Recommended next steps
5. Relevant laws or rules

Be specific and actionable. Use markdown formatting.`;

export const TIMELINE_PROMPT = (country = 'India', electionType = 'General Election') =>
  `Generate a detailed election timeline for ${country}'s ${electionType}.

Format as a structured list with:
- Phase/stage name
- Approximate timeframe (relative to election day, e.g., T-90 days)
- Key activities
- Important deadlines
- Who is involved

Use markdown formatting with clear structure.`;

export const INTENT_PROMPT = (userMessage) =>
  `Classify the following user message into one of these election-related intents:
- REGISTRATION: About voter registration process
- VOTING: About the voting process itself
- TIMELINE: About election dates, deadlines, schedules
- COUNTING: About vote counting and results
- CAMPAIGNING: About election campaigns
- SCENARIO: A "what if" question
- GENERAL: General election knowledge
- OTHER: Not election related

User message: "${userMessage}"

Respond with ONLY the intent label, nothing else.`;
