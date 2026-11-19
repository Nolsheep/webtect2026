// Builds the Express app. pool (PostgreSQL) and ai (chat function) are passed in
// so tests can swap the real AI for a fake one.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { portfolioRouter } from './routes/portfolio.js';
import { chatRouter } from './routes/chat.js';

const clientDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist');

export function createApp({ pool, ai }) {
  const app = express();
  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json({ limit: '100kb' }));

  app.get('/api/health', async (_req, res) => {
    try {
      await pool.query('SELECT 1');
      res.json({ status: 'ok', db: 'up' });
    } catch {
      res.status(503).json({ status: 'error', db: 'down' });
    }
  });
  app.use('/api/portfolio', portfolioRouter(pool));
  app.use('/api/chat', chatRouter(pool, ai));
  app.use('/api', (_req, res) => res.status(404).json({ error: 'not found' }));

  // In production the built React app is served by the same server.
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.get('/{*any}', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
  }

  // Express 5 forwards errors from async handlers here.
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  });

  return app;
}
