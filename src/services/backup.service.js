import { db } from '../db.js';

const MAX_BACKUPS = 3;

export function saveBackup(deviceId, timestamp, data) {
  try {
    db.prepare(
      `INSERT INTO backups (device_id, created_at, payload) VALUES (?, ?, ?)`
    ).run(deviceId, timestamp, JSON.stringify(data));

    // Get all backup IDs for this device, newest first
    const backups = db.prepare(
      `SELECT id FROM backups WHERE device_id = ? ORDER BY created_at DESC`
    ).all(deviceId);

    if (backups.length > MAX_BACKUPS) {
      const idsToDelete = backups.slice(MAX_BACKUPS).map(b => b.id);
      if (idsToDelete.length) {
        db.prepare(
          `DELETE FROM backups WHERE id IN (${idsToDelete.map(() => '?').join(',')})`
        ).run(...idsToDelete);
      }
    }
  } catch (err) {
    console.error('saveBackup error:', err);
    throw err;
  }
}

export function getLatestBackup(deviceId) {
  try {
    const row = db.prepare(
      `SELECT payload, created_at FROM backups WHERE device_id = ? ORDER BY created_at DESC LIMIT 1`
    ).get(deviceId);
    if (!row) return null;
    return {
      createdAt: row.created_at,
      data: JSON.parse(row.payload)
    };
  } catch (err) {
    console.error('getLatestBackup error:', err);
    throw err;
  }
}
