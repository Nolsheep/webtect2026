// Integration tests: real PostgreSQL (DATABASE_URL), fake AI.
// Skipped automatically when no database is reachable.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createPool, initDatabase } from '../src/db.js';
import { createApp } from '../src/app.js';

let pool;
let dbReady = false;
const aiCalls = [];
const fakeAi = async (messages) => {
  aiCalls.push(messages);
  return `echo: ${messages.at(-1).content}`;
};

before(async () => {
  pool = createPool();
  try {
    await initDatabase(pool);
    dbReady = true;
  } catch (err) {
    console.warn('Skipping API tests, database not reachable:', err.message);
  }
});
after(() => pool?.end());

const app = () => createApp({ pool, ai: fakeAi });

test('GET /api/health', async (t) => {
  if (!dbReady) return t.skip('no database');
  const res = await request(app()).get('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.db, 'up');
});

test('GET /api/portfolio returns group and members', async (t) => {
  if (!dbReady) return t.skip('no database');
  const res = await request(app()).get('/api/portfolio');
  assert.equal(res.status, 200);
  assert.ok(res.body.group.name_th);
  assert.ok(res.body.members.length >= 3);
  assert.ok(Array.isArray(res.body.members[0].projects));
});

test('POST /api/chat saves history and sends portfolio context to AI', async (t) => {
  if (!dbReady) return t.skip('no database');
  const first = await request(app()).post('/api/chat').send({ message: 'Who is Nol?' });
  assert.equal(first.status, 200);
  assert.equal(first.body.reply, 'echo: Who is Nol?');
  const { conversationId } = first.body;

  const systemPrompt = aiCalls.at(-1)[0];
  assert.equal(systemPrompt.role, 'system');
  assert.match(systemPrompt.content, /PORTFOLIO DATA/);

  await request(app()).post('/api/chat').send({ conversationId, message: 'And Keng?' });
  // second call includes the first turn as history
  assert.equal(aiCalls.at(-1).length, 4);

  const history = await request(app()).get(`/api/chat/${conversationId}`);
  assert.deepEqual(history.body.messages.map((m) => m.role), ['user', 'assistant', 'user', 'assistant']);

  const del = await request(app()).delete(`/api/chat/${conversationId}`);
  assert.equal(del.status, 204);
});

test('POST /api/chat rejects empty message', async (t) => {
  if (!dbReady) return t.skip('no database');
  const res = await request(app()).post('/api/chat').send({ message: '   ' });
  assert.equal(res.status, 400);
});
