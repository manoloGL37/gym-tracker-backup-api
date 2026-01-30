import express from 'express';
import { saveBackup, getLatestBackup } from '../services/backup.service.js';

export const router = express.Router();

// UUID v4 regex (simple, not strict RFC4122)
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

router.post('/', async (req, res) => {
  console.log('Received backup request:', req.body);

  try {
    const { deviceId, timestamp, data } = req.body;

    if (
      typeof deviceId !== 'string' ||
      !deviceId.trim() ||
      typeof timestamp !== 'string' ||
      !timestamp.trim() ||
      data === undefined
    ) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    saveBackup(deviceId, timestamp, data);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('POST /backup error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;

    if (typeof deviceId !== 'string' || !deviceId.trim()) {
      return res.status(400).json({ error: 'Invalid deviceId' });
    }

    const backup = getLatestBackup(deviceId);
    if (!backup) {
      return res.status(404).json({ error: 'No backup found' });
    }

    return res.json(backup);
  } catch (err) {
    console.error('GET /backup/:deviceId error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

