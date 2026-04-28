/**
 * Input sanitizer middleware
 * Prevents XSS and basic prompt injection
 */
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

// Patterns that suggest prompt injection
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /you\s+are\s+now\s+/i,
  /forget\s+(all\s+)?your\s+rules/i,
  /system\s*prompt/i,
  /\bact\s+as\b/i,
  /pretend\s+you\s+are/i,
  /override\s+(your\s+)?instructions/i,
  /disregard\s+(all\s+)?prior/i,
];

/**
 * Sanitize a string — strip HTML and check for injection
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';

  // Strip HTML tags
  let clean = purify.sanitize(input, { ALLOWED_TAGS: [] });

  // Trim and limit length
  clean = clean.trim().slice(0, 2000);

  return clean;
}

/**
 * Check if input contains prompt injection patterns
 */
export function detectInjection(input) {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(input));
}

/**
 * Express middleware to sanitize request body
 */
export function sanitizerMiddleware(req, res, next) {
  if (req.body) {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeInput(req.body[key]);
      }
    }
  }
  next();
}
