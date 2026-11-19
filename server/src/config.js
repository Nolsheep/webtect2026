// Loads environment variables from the project root .env (one file for the whole repo).
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(here, '../../.env'), quiet: true });

export const config = {
  port: Number(process.env.PORT) || 3001,
  databaseUrl: process.env.DATABASE_URL || 'postgres://webtect:webtect@localhost:5432/webtect',
  // Render's managed Postgres needs SSL; local Docker Postgres does not.
  databaseSsl: process.env.DATABASE_SSL === 'true',
  typhoon: {
    apiKey: process.env.TYPHOON_API_KEY || '',
    baseUrl: process.env.TYPHOON_BASE_URL || 'https://api.opentyphoon.ai/v1',
    model: process.env.TYPHOON_MODEL || 'typhoon-v2.5-30b-a3b-instruct',
  },
  corsOrigin: process.env.CORS_ORIGIN || '*',
};
