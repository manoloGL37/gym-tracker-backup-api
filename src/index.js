import express from 'express';
import cors from 'cors';
import { router as backupRoutes } from './routes/backup.routes.js';
import { initDb } from './db.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/backup', backupRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`Backup API running on port ${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
