import { Router } from 'express';
import { sanitizerMiddleware, detectInjection } from '../middleware/sanitizer.js';
import { getScenarioResponse } from '../services/aiService.js';

const router = Router();
router.use(sanitizerMiddleware);

const SCENARIOS_LIST = [
  { id: 'miss-registration', title: 'Missed Registration Deadline', question: 'What happens if I miss the voter registration deadline?' },
  { id: 'lost-voter-id', title: 'Lost Voter ID', question: 'I lost my voter ID card. Can I still vote?' },
  { id: 'different-city', title: 'Moved to a Different City', question: 'I moved to a different city. How do I vote?' },
  { id: 'evm-malfunction', title: 'EVM Malfunction', question: 'What happens if the EVM malfunctions during voting?' },
  { id: 'tie', title: 'Election Tie', question: 'What happens if two candidates get the exact same number of votes?' },
  { id: 'nota-wins', title: 'NOTA Gets Most Votes', question: 'What if NOTA gets more votes than any candidate?' },
];

/**
 * GET /api/scenarios/list
 */
router.get('/list', (req, res) => {
  res.json({ scenarios: SCENARIOS_LIST });
});

/**
 * POST /api/scenarios/simulate
 */
router.post('/simulate', async (req, res, next) => {
  try {
    const { scenario, country } = req.body;

    if (!scenario) {
      return res.status(400).json({ error: 'Scenario is required' });
    }

    if (detectInjection(scenario)) {
      return res.status(400).json({ error: 'Invalid input detected' });
    }

    const response = await getScenarioResponse(scenario, country || 'India');
    res.json({ response, timestamp: Date.now() });
  } catch (error) {
    next(error);
  }
});

export default router;
