import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';

const router = Router();

const translateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
  message: { error: 'Too many translation requests. Please slow down.' },
});

router.use(translateLimiter);

/**
 * POST /api/translate
 * Mock translation endpoint
 */
router.post('/', async (req, res, next) => {
  try {
    const { text, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'Text and targetLanguage are required' });
    }

    // Since we don't have a real Google Translate API key, we'll return a mock response
    // In production, you would call the Google Cloud Translation API here
    
    let mockTranslatedText = text;
    if (targetLanguage === 'hi') mockTranslatedText = `[Hindi Translation of: ${text}]`;
    if (targetLanguage === 'es') mockTranslatedText = `[Spanish Translation of: ${text}]`;
    if (targetLanguage === 'fr') mockTranslatedText = `[French Translation of: ${text}]`;

    res.json({
      translatedText: mockTranslatedText,
      originalText: text,
      targetLanguage,
      timestamp: Date.now()
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/translate/languages
 */
router.get('/languages', (req, res) => {
  res.json({
    languages: [
      { code: 'en', name: 'English' },
      { code: 'hi', name: 'Hindi' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
    ]
  });
});

export default router;
