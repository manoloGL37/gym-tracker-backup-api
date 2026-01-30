import Database from 'better-sqlite3';

export const db = new Database('backups.db');

db.prepare(`
  CREATE TABLE IF NOT EXISTS backups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    payload TEXT NOT NULL
  )
`).run();
