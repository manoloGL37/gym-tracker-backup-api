import { pool } from '../db.js';

const MAX_BACKUPS = 3;

export async function saveBackup(deviceId, timestamp, data) {
  await pool.query(
    `
    INSERT INTO backups (device_id, created_at, payload)
    VALUES ($1, $2, $3)
    `,
    [deviceId, timestamp, data]
  );

  const { rows } = await pool.query(
    `
    SELECT id
    FROM backups
    WHERE device_id = $1
    ORDER BY created_at DESC
    `,
    [deviceId]
  );

  if (rows.length > MAX_BACKUPS) {
    const idsToDelete = rows.slice(MAX_BACKUPS).map(r => r.id);

    await pool.query(
      `
      DELETE FROM backups
      WHERE id = ANY($1)
      `,
      [idsToDelete]
    );
  }
}

export async function getLatestBackup(deviceId) {
  const { rows } = await pool.query(
    `
    SELECT payload, created_at
    FROM backups
    WHERE device_id = $1
    ORDER BY created_at DESC
    LIMIT 1
    `,
    [deviceId]
  );

  if (rows.length === 0) return null;

  return {
    createdAt: rows[0].created_at,
    data: rows[0].payload
  };
}
