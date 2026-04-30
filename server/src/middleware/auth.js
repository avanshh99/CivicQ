import { auth } from '../config/firebase.js';

/**
 * Express middleware to verify Firebase ID tokens
 */
export const verifyAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // If we're not using Firebase yet, we can pass a mock user for local testing
    if (!auth) {
      req.user = { uid: 'mock-user-id', role: 'user' };
      return next();
    }
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    if (!auth) {
       req.user = { uid: 'mock-user-id', role: 'user' };
       return next();
    }
    
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying auth token', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
