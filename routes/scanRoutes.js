import { Router } from 'express';
import { classifyWaste } from '../services/gemini-service.js';

const router = Router();

// The scan screen sends a photo (JPEG in base64) or a typed description.
router.post('/scan', async function (req, res) {
  const image = req.body.image;
  const text = (req.body.text || '').trim();

  if (!image && !text) {
    return res.status(400).json({ error: 'Send a photo or a description.' });
  }

  try {
    const result = await classifyWaste(image, text);
    res.json(result);
  } catch (error) {
    console.log('Scan failed: ' + error.message);
    res.status(502).json({ error: 'We could not identify it. Try again in a minute.' });
  }
});

export default router;
