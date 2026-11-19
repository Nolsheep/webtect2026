import { config } from './config.js';
import { createPool, initDatabase } from './db.js';
import { createApp } from './app.js';
import { chatCompletion } from './ai.js';

const pool = createPool();
await initDatabase(pool);

const app = createApp({ pool, ai: chatCompletion });
app.listen(config.port, () => {
  console.log(`[server] listening on http://localhost:${config.port}`);
  if (!config.typhoon.apiKey) console.warn('[server] TYPHOON_API_KEY is missing, chat will fail');
});
