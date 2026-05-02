import { Router } from 'express';
import { getNearestStations } from '../services/pollingService.js';

const router = Router();

/**
 * POST /api/polling/nearby
 * Get nearby polling stations based on coordinates
 */
router.post('/nearby', async (req, res, next) => {
  try {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // Get up to 20 nearest stations within a 50-mile radius
    const stations = getNearestStations(lat, lng, 20, 50);

    res.json({
      stations,
      timestamp: Date.now()
    });
  } catch (error) {
    next(error);
  }
});

export default router;
