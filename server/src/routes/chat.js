import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { getPortfolio, buildSystemPrompt } from '../portfolio.js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_MESSAGE_LENGTH = 2000;
const HISTORY_TURNS = 10; // how many previous messages the AI sees

export function chatRouter(pool, ai) {
  const router = Router();

  // POST /api/chat  { conversationId?, message }  ->  { conversationId, reply }
  router.post('/', async (req, res) => {
    const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
    if (!message) return res.status(400).json({ error: 'message is required' });
    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ error: `message is longer than ${MAX_MESSAGE_LENGTH} characters` });
    }

    let conversationId = req.body?.conversationId;
    if (!UUID_RE.test(conversationId ?? '')) conversationId = randomUUID();
    await pool.query('INSERT INTO conversations (id) VALUES ($1) ON CONFLICT DO NOTHING', [conversationId]);

    // Previous turns of this conversation, oldest first
    const { rows: history } = await pool.query(
      `SELECT role, content FROM (
         SELECT id, role, content FROM messages WHERE conversation_id = $1 ORDER BY id DESC LIMIT $2
       ) t ORDER BY id`,
      [conversationId, HISTORY_TURNS],
    );

    await pool.query('INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3)', [
      conversationId, 'user', message,
    ]);

    const portfolio = await getPortfolio(pool);
    let reply;
    try {
      reply = await ai([
        { role: 'system', content: buildSystemPrompt(portfolio) },
        ...history,
        { role: 'user', content: message },
      ]);
    } catch (err) {
      console.error('[ai]', err.message);
      return res.status(502).json({ conversationId, error: 'AI service is unavailable, please try again.' });
    }
    if (!reply) reply = 'ขออภัย ตอนนี้ยังตอบไม่ได้ / Sorry, I could not answer that right now.';

    await pool.query('INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3)', [
      conversationId, 'assistant', reply,
    ]);
    res.json({ conversationId, reply });
  });

  // GET /api/chat/:id -> all messages of one conversation (for reloading the page)
  router.get('/:id', async (req, res) => {
    if (!UUID_RE.test(req.params.id)) return res.status(400).json({ error: 'invalid conversation id' });
    const { rows } = await pool.query(
      'SELECT id, role, content, created_at FROM messages WHERE conversation_id = $1 ORDER BY id',
      [req.params.id],
    );
    res.json({ conversationId: req.params.id, messages: rows });
  });

  // DELETE /api/chat/:id -> clear a conversation
  router.delete('/:id', async (req, res) => {
    if (!UUID_RE.test(req.params.id)) return res.status(400).json({ error: 'invalid conversation id' });
    await pool.query('DELETE FROM conversations WHERE id = $1', [req.params.id]);
    res.status(204).end();
  });

  return router;
}
