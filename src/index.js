import express from 'express';
import cors from 'cors';
import { router as backupRoutes } from './routes/backup.routes.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/backup', backupRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backup API running on http://localhost:${PORT}`);
});
