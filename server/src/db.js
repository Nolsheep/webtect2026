// PostgreSQL connection pool + helpers to create tables and load seed data.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { config } from './config.js';

const dbDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../db');

export function createPool(connectionString = config.databaseUrl) {
  return new pg.Pool({
    connectionString,
    ssl: config.databaseSsl ? { rejectUnauthorized: false } : undefined,
  });
}

export async function runSqlFile(pool, fileName) {
  const sql = await fs.readFile(path.join(dbDir, fileName), 'utf8');
  await pool.query(sql);
}

// Create tables if they don't exist, and load the portfolio seed the first time.
export async function initDatabase(pool) {
  await runSqlFile(pool, 'schema.sql');
  const { rows } = await pool.query('SELECT COUNT(*)::int AS n FROM group_info');
  if (rows[0].n === 0) {
    await runSqlFile(pool, 'seed.sql');
    console.log('[db] portfolio seed loaded');
  }
}
