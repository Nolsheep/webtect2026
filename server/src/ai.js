// Typhoon AI client. Typhoon uses an OpenAI-compatible Chat Completions API.
import { config } from './config.js';

export async function chatCompletion(messages, { signal } = {}) {
  const { apiKey, baseUrl, model } = config.typhoon;
  if (!apiKey) throw new Error('TYPHOON_API_KEY is not set');

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages, temperature: 0.2, max_tokens: 1024 }),
    signal: signal ?? AbortSignal.timeout(60_000),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Typhoon API error ${res.status}: ${detail.slice(0, 300)}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? '';
}
