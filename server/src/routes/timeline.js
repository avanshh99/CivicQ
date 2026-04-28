import { Router } from 'express';

const router = Router();

const TIMELINE_DATA = {
  india: [
    { phase: 'Announcement', timeframe: 'T-90 days', activities: 'Election Commission announces dates. Model Code of Conduct begins.' },
    { phase: 'Nominations', timeframe: 'T-75 days', activities: 'Candidates file nomination papers and pay security deposits.' },
    { phase: 'Scrutiny', timeframe: 'T-60 days', activities: 'Returning officers verify nominations. Withdrawal period.' },
    { phase: 'Campaigning', timeframe: 'T-45 to T-2 days', activities: 'Official campaign period. Rallies, media, outreach.' },
    { phase: 'Registration Deadline', timeframe: 'T-21 days', activities: 'Last date for voter registration updates.' },
    { phase: 'Campaign Silence', timeframe: 'T-2 days', activities: 'All campaigning must stop 48 hours before polling.' },
    { phase: 'Polling Day', timeframe: 'Election Day', activities: 'Voters cast ballots at polling stations. 7 AM to 6 PM.' },
    { phase: 'Counting', timeframe: 'T+3 days', activities: 'EVMs opened, votes counted round by round.' },
    { phase: 'Results', timeframe: 'T+3 days', activities: 'Winners declared, certificates issued.' },
    { phase: 'Government Formation', timeframe: 'T+7 days', activities: 'Majority party/coalition invited to form government.' },
  ],
};

/**
 * GET /api/timeline/:country
 */
router.get('/:country', (req, res) => {
  const country = req.params.country.toLowerCase();
  const timeline = TIMELINE_DATA[country];

  if (!timeline) {
    return res.json({
      country,
      timeline: TIMELINE_DATA.india,
      note: `Timeline data for "${country}" not available. Showing India's general election timeline as reference.`,
    });
  }

  res.json({ country, timeline });
});

export default router;
