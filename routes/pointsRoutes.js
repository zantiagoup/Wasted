import { Router } from 'express';
import { findNearestPoint } from '../services/points-service.js';

const router = Router();

// /api/points?category=PET&lat=20.67&lng=-103.35 returns the closest point that takes that category.
router.get('/points', function (req, res) {
  const category = req.query.category;
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);

  if (!category || isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({ error: 'Send a category and your location.' });
  }

  const point = findNearestPoint(category, lat, lng);

  if (!point) {
    return res.status(404).json({ error: 'We do not have a drop-off point for this yet.' });
  }

  res.json(point);
});

export default router;
