-- Schema for the group portfolio + AI chat app.
-- Every text that is shown on the site has a Thai (_th) and English (_en) column.

CREATE TABLE IF NOT EXISTS group_info (
  id          SERIAL PRIMARY KEY,
  name_th     TEXT NOT NULL,
  name_en     TEXT NOT NULL,
  tagline_th  TEXT,
  tagline_en  TEXT,
  concept_th  TEXT,
  concept_en  TEXT,
  highlights_th TEXT[] DEFAULT '{}',
  highlights_en TEXT[] DEFAULT '{}',
  university  TEXT,
  email       TEXT,
  github      TEXT,
  instagram   TEXT,
  line        TEXT
);

CREATE TABLE IF NOT EXISTS members (
  id           SERIAL PRIMARY KEY,
  slug         TEXT UNIQUE NOT NULL,
  nickname_th  TEXT NOT NULL,
  nickname_en  TEXT NOT NULL,
  full_name_th TEXT,
  full_name_en TEXT,
  role_th      TEXT,
  role_en      TEXT,
  bio_th       TEXT,
  bio_en       TEXT,
  skills       TEXT[] DEFAULT '{}',
  email        TEXT,
  github       TEXT,
  photo_url    TEXT,
  color        TEXT DEFAULT '#8b5cf6',
  sort_order   INT DEFAULT 0
);

-- member_id NULL  = a project the whole group did together
CREATE TABLE IF NOT EXISTS projects (
  id             SERIAL PRIMARY KEY,
  member_id      INT REFERENCES members(id) ON DELETE CASCADE,
  title_th       TEXT NOT NULL,
  title_en       TEXT NOT NULL,
  description_th TEXT,
  description_en TEXT,
  tech           TEXT[] DEFAULT '{}',
  year           TEXT,
  link           TEXT,
  sort_order     INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS conversations (
  id         UUID PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id              SERIAL PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role            TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content         TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, id);

-- v2: extra project fields for the member profile pages
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category  TEXT;  -- competition | research | course | training | work | group
ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_url TEXT;  -- e.g. /works/kanat-hackathon.jpg (put files in client/public/works)
