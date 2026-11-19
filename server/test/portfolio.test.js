import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildPortfolioContext, buildSystemPrompt } from '../src/portfolio.js';

const sample = {
  group: { name_th: 'เซ่นเซวิก', name_en: 'Sen Sevik', concept_en: 'AI crew', email: 'team@example.com' },
  groupProjects: [{ title_th: 'แชต', title_en: 'Chat', tech: ['React'], year: '2026' }],
  members: [
    { nickname_th: 'นล', nickname_en: 'Nol', role_en: 'Backend', skills: ['Python', 'SQL'], projects: [] },
    { nickname_th: 'เก่ง', nickname_en: 'Keng', role_en: 'Frontend', skills: ['React'], projects: [] },
  ],
};

test('context contains group and every member', () => {
  const ctx = buildPortfolioContext(sample);
  assert.match(ctx, /เซ่นเซวิก/);
  assert.match(ctx, /Number of members: 2/);
  assert.match(ctx, /นล \(Nol\)/);
  assert.match(ctx, /เก่ง \(Keng\)/);
  assert.match(ctx, /Python, SQL/);
  assert.match(ctx, /team@example.com/);
});

test('system prompt restricts the AI to portfolio data', () => {
  const prompt = buildSystemPrompt(sample);
  assert.match(prompt, /ONLY using the PORTFOLIO DATA/);
  assert.match(prompt, /=== PORTFOLIO DATA ===/);
});

test('empty database gives a safe context', () => {
  assert.equal(buildPortfolioContext({ group: null, groupProjects: [], members: [] }), 'No portfolio data has been loaded yet.');
});
