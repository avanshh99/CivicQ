import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { sanitizerMiddleware, detectInjection } from '../middleware/sanitizer.js';
import { getChatResponse } from '../services/aiService.js';

const router = Router();

// Chat-specific rate limiter: 30 requests per minute
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'Too many messages. Please slow down.' },
});

router.use(chatLimiter);
router.use(sanitizerMiddleware);

/**
 * POST /api/chat/message
 * Send a message and get AI response
 */
router.post('/message', async (req, res, next) => {
  try {
    const { message, mode, history, language } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check for prompt injection
    if (detectInjection(message)) {
      return res.status(400).json({
        error: 'Invalid input detected',
        response: "I'm here to help with election-related questions. Could you rephrase your question?",
      });
    }

    const response = await getChatResponse(message.trim(), {
      mode: mode || 'normal',
      history: Array.isArray(history) ? history.slice(-10) : [], // Last 10 messages for context
      language: language || 'en',
    });

    res.json({
      response,
      timestamp: Date.now(),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/chat/explain
 * Get an explanation for a specific topic
 */
router.post('/explain', async (req, res, next) => {
  try {
    const { topic, mode } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const response = await getChatResponse(topic, {
      mode: mode || 'detailed',
    });

    res.json({ response, timestamp: Date.now() });
  } catch (error) {
    next(error);
  }
});

export default router;
