import pkg from 'pg';
const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// inicialización de la tabla (idempotente)
export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS backups (
      id SERIAL PRIMARY KEY,
      device_id TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL,
      payload JSONB NOT NULL
    )
  `);
}
