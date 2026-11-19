import { Router } from 'express';
import { getPortfolio } from '../portfolio.js';

export function portfolioRouter(pool) {
  const router = Router();

  // GET /api/portfolio -> group info, group projects, members with their projects
  router.get('/', async (_req, res) => {
    res.json(await getPortfolio(pool));
  });

  return router;
}
