import { dbPromise } from '../db.js';

const MAX_BACKUPS = 3;

export async function saveBackup(deviceId, timestamp, data) {
  const db = await dbPromise;

  await db.run(
    `
    INSERT INTO backups (device_id, created_at, payload)
    VALUES (?, ?, ?)
    `,
    deviceId,
    timestamp,
    JSON.stringify(data)
  );

  const backups = await db.all(
    `
    SELECT id FROM backups
    WHERE device_id = ?
    ORDER BY created_at DESC
    `,
    deviceId
  );

  if (backups.length > MAX_BACKUPS) {
    const idsToDelete = backups.slice(MAX_BACKUPS).map(b => b.id);
    const placeholders = idsToDelete.map(() => '?').join(',');

    await db.run(
      `DELETE FROM backups WHERE id IN (${placeholders})`,
      idsToDelete
    );
  }
}

export async function getLatestBackup(deviceId) {
  const db = await dbPromise;

  const row = await db.get(
    `
    SELECT payload, created_at
    FROM backups
    WHERE device_id = ?
    ORDER BY created_at DESC
    LIMIT 1
    `,
    deviceId
  );

  if (!row) return null;

  return {
    createdAt: row.created_at,
    data: JSON.parse(row.payload)
  };
}
