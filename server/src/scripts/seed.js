// Reloads portfolio data from db/seed.sql (chat history is kept).
import { createPool, runSqlFile } from '../db.js';

const pool = createPool();
await runSqlFile(pool, 'schema.sql');
await runSqlFile(pool, 'seed.sql');
console.log('Portfolio data reloaded from db/seed.sql');
await pool.end();
