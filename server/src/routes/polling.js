import { Router } from 'express';

const router = Router();

// Mock polling station data
const MOCK_STATIONS = [
  { id: '1', name: 'City Hall', address: '100 Main St', distance: '0.8 miles', accessible: true },
  { id: '2', name: 'Community Center', address: '250 Oak Ave', distance: '1.2 miles', accessible: true },
  { id: '3', name: 'Public Library', address: '400 Library Ln', distance: '2.5 miles', accessible: false },
];

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

    // In a real app, you would use Google Maps Places API or civic data here
    // For now, we return mock data

    res.json({
      stations: MOCK_STATIONS,
      timestamp: Date.now()
    });
  } catch (error) {
    next(error);
  }
});

export default router;
