import { Router } from 'express';
import { getPortfolio } from '../portfolio.js';

export function portfolioRouter(pool) {
  const router = Router();

  // GET /api/portfolio -> group info, group projects, members with their projects
  router.get('/', async (_req, res) => {
    res.json(await getPortfolio(pool));
  });

  // GET /api/portfolio/members/:slug -> one member with projects
  router.get('/members/:slug', async (req, res) => {
    const { members } = await getPortfolio(pool);
    const member = members.find((m) => m.slug === req.params.slug);
    if (!member) return res.status(404).json({ error: 'member not found' });
    res.json(member);
  });

  return router;
}
