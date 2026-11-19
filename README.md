# เซ่นเซวิก · Galaxy Portfolio Chat

เว็บ Portfolio ของกลุ่ม **เซ่นเซวิก** ธีมอวกาศแบบ bento grid พร้อม **Nova** แชตบอท AI ที่ตอบคำถามเกี่ยวกับกลุ่มและสมาชิกแต่ละคนจากข้อมูลในฐานข้อมูล รองรับภาษาไทยและอังกฤษ

A space-themed group portfolio with **Nova**, an AI chat that answers questions about the group and each member using portfolio data stored in PostgreSQL. Thai and English.

| | |
|---|---|
| Frontend | React 19 + Vite, React Router, react-markdown |
| Backend | Node.js + Express 5 |
| Database | PostgreSQL 16 (chat history + portfolio data) |
| AI | [Typhoon](https://opentyphoon.ai) `typhoon-v2.5-30b-a3b-instruct` (OpenAI-compatible API) |
| CI/CD | GitHub Actions → Render deploy hook |

## สมาชิก / Team

| ชื่อเล่น | ชื่อ | บทบาท | GitHub |
|---|---|---|---|
| นล | Kanat Thongniyom | Backend & AI Engineer | [@Nolsheep](https://github.com/Nolsheep) |
| เก่ง | Nitikul Keawpaitoon | Frontend Developer | [@KengJoJo](https://github.com/KengJoJo) |
| ไทม์ | เจตนิพัทธ อินทรีย์ | DevOps & Data | - |

## How it works

```
React (client/)  ──POST /api/chat──▶  Express (server/)  ──▶  Typhoon AI
      ▲                                   │   ▲
      └────── GET /api/portfolio ─────────┘   │ system prompt = portfolio data
                                          PostgreSQL
                          group_info · members · projects · conversations · messages
```

1. The visitor types a question in the chat page.
2. Express saves it in `messages`, loads the whole portfolio (group, members, projects) from PostgreSQL and turns it into a fact sheet (`server/src/portfolio.js`).
3. The fact sheet goes into the **system prompt** together with rules: answer only from this data, reply in the visitor's language, never mix up members' work. The last 10 messages of the conversation are sent as history.
4. Typhoon's reply is saved and returned. The conversation id is kept in `localStorage`, so the chat survives a page reload.

## Project structure

```
client/                React app (portfolio page + chat page)
  src/pages/           Portfolio.jsx, Chat.jsx
  src/components/      Navbar, Starfield (canvas background), Avatar
  src/i18n.jsx         TH/EN switch
server/                Express API
  src/app.js           routes + serves client/dist in production
  src/routes/          chat.js, portfolio.js
  src/portfolio.js     DB -> AI context + system prompt
  src/ai.js            Typhoon client
  db/schema.sql        tables
  db/seed.sql          portfolio data (edit this to change the content)
  test/                node:test unit + API tests
.github/workflows/     CI/CD pipeline
render.yaml            Render blueprint (web service + Postgres)
docker-compose.yml     local PostgreSQL
```

## Run locally

Requirements: Node.js 20+ and Docker (for PostgreSQL).

```bash
git clone https://github.com/Nolsheep/webtect2026.git
cd webtect2026
cp .env.example .env          # then put your TYPHOON_API_KEY in .env
docker compose up -d          # PostgreSQL on localhost:5432
npm run install:all
```

Development (two terminals, hot reload):

```bash
npm run dev:server            # http://localhost:3001  (creates tables + seed on first start)
npm run dev:client            # http://localhost:5173  (proxies /api to :3001)
```

Production-like (one server serves API + built React app):

```bash
npm run build
npm start                     # http://localhost:3001
```

Tests (needs the database running):

```bash
npm test
```

## Editing portfolio data

All content lives in `server/db/seed.sql` (lines marked `TODO` are placeholders). After editing:

```bash
npm run db:seed               # reloads group/members/projects, keeps chat history
```

The AI reads the database on every message, so new data is used immediately.

## API

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | server + database status |
| GET | `/api/portfolio` | group, group projects, members with projects |
| POST | `/api/chat` | body `{ message, conversationId? }` → `{ conversationId, reply }` |
| GET | `/api/chat/:id` | messages of a conversation |
| DELETE | `/api/chat/:id` | delete a conversation |

## CI/CD

`.github/workflows/ci.yml` runs on every push and pull request:

1. **server**: starts a PostgreSQL service container, installs, runs unit + API tests (the AI is replaced by a fake function in tests).
2. **client**: lint (oxlint) and production build, uploads `dist` as an artifact.
3. **deploy** (only on `main`, after both jobs pass): calls the Render deploy hook stored in the repo secret `RENDER_DEPLOY_HOOK_URL`. If the secret is missing it skips.

## Deploy to Render

1. Render dashboard → **New → Blueprint** → pick this repo (uses `render.yaml`: web service + free PostgreSQL).
2. Set `TYPHOON_API_KEY` in the web service's environment.
3. Web service → Settings → **Deploy Hook** → copy the URL → GitHub repo → Settings → Secrets → Actions → add `RENDER_DEPLOY_HOOK_URL`.
4. Push to `main`; GitHub Actions tests and then deploys.

## Environment variables

See `.env.example`. Never commit `.env`.

| Name | Description |
|---|---|
| `PORT` | server port (default 3001) |
| `DATABASE_URL` | PostgreSQL connection string |
| `DATABASE_SSL` | `true` when the database requires SSL |
| `TYPHOON_API_KEY` | Typhoon API key |
| `TYPHOON_BASE_URL` | default `https://api.opentyphoon.ai/v1` |
| `TYPHOON_MODEL` | default `typhoon-v2.5-30b-a3b-instruct` |
| `CORS_ORIGIN` | allowed origin for the API (default `*`) |
